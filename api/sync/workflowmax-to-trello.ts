import { redis } from '@/lib/redis'

type WorkflowMaxTokenState = {
  accessToken: string
  refreshToken: string
  expiresAt?: number | null
}

type SyncState = {
  initialized: boolean
  lastSeenCreatedAt: number
}

function decodeJwtPayload(token: string) {
  const payload = token.split('.')[1]
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function cardContainsExactJobNumber(cardName: string, jobNumber: string) {
  const regex = new RegExp(`\\b${escapeRegExp(jobNumber)}\\b`, 'i')
  return regex.test(cardName)
}

function getJobCreatedTimestamp(job: any) {
  return new Date(
    job?.createdAt ||
      job?.createdDate ||
      job?.dateCreated ||
      job?.created ||
      0
  ).getTime()
}

function getJobIdentifier(job: any) {
  return (
    job?.uuid ||
    job?.id ||
    job?.identifier ||
    job?.jobId ||
    job?.jobUUID
  )
}

async function loadWorkflowMaxTokens(): Promise<WorkflowMaxTokenState | null> {
  return await redis.get<WorkflowMaxTokenState>('workflowmax:tokens')
}

async function saveWorkflowMaxTokens(tokens: WorkflowMaxTokenState) {
  await redis.set('workflowmax:tokens', tokens)
}

async function loadSyncState(): Promise<SyncState | null> {
  return await redis.get<SyncState>('workflowmax:sync-state')
}

async function saveSyncState(state: SyncState) {
  await redis.set('workflowmax:sync-state', state)
}

async function refreshWorkflowMaxToken(refreshToken: string) {
  const clientId = process.env.WORKFLOWMAX_CLIENT_ID
  const clientSecret = process.env.WORKFLOWMAX_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing WorkflowMax client credentials')
  }

  const res = await fetch('https://oauth.workflowmax.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  })

  const raw = await res.text()

  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    data = { raw }
  }

  if (!res.ok) {
    throw new Error(
      data?.error_description || data?.message || 'Failed to refresh WorkflowMax token'
    )
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresIn: typeof data.expires_in === 'number' ? data.expires_in : 1800,
  }
}

async function getValidWorkflowMaxTokens() {
  const storedTokens = await loadWorkflowMaxTokens()

  if (!storedTokens?.accessToken || !storedTokens?.refreshToken) {
    throw new Error(
      'Missing stored WorkflowMax tokens. Seed Redis key "workflowmax:tokens" first.'
    )
  }

  let { accessToken, refreshToken, expiresAt } = storedTokens

  const shouldRefresh = !expiresAt || Date.now() >= expiresAt - 60_000

  if (shouldRefresh) {
    const refreshed = await refreshWorkflowMaxToken(refreshToken)

    accessToken = refreshed.accessToken
    refreshToken = refreshed.refreshToken
    expiresAt = Date.now() + refreshed.expiresIn * 1000

    await saveWorkflowMaxTokens({
      accessToken,
      refreshToken,
      expiresAt,
    })
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
  }
}

async function fetchWorkflowMaxJson(url: string, accessToken: string, orgId: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'account-id': String(orgId),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  const raw = await res.text()

  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    data = { raw }
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
  }
}

async function fetchAllWorkflowMaxJobs(accessToken: string, orgId: string) {
  const pageSize = 200
  let page = 1
  let total = 0
  let allJobs: any[] = []
  let keepGoing = true

  while (keepGoing) {
    const result = await fetchWorkflowMaxJson(
      `https://api.workflowmax.com/v2/jobs?page=${page}&pageSize=${pageSize}`,
      accessToken,
      orgId
    )

    if (result.status === 401) {
      throw new Error('WorkflowMax access token was rejected after refresh')
    }

    if (!result.ok) {
      throw new Error(`Failed to fetch WorkflowMax jobs on page ${page}`)
    }

    const pageItems = Array.isArray(result.data?.data) ? result.data.data : []
    total = typeof result.data?.total === 'number' ? result.data.total : total
    allJobs = allJobs.concat(pageItems)

    if (pageItems.length < pageSize || (total > 0 && allJobs.length >= total)) {
      keepGoing = false
    } else {
      page += 1
    }
  }

  return allJobs
}

async function fetchWorkflowMaxJobDetail(accessToken: string, orgId: string, identifier: string) {
  const result = await fetchWorkflowMaxJson(
    `https://api.workflowmax.com/v2/jobs/${identifier}`,
    accessToken,
    orgId
  )

  if (!result.ok) {
    throw new Error(`Failed to fetch WorkflowMax job detail for ${identifier}`)
  }

  return result.data?.data ?? result.data
}

async function fetchTrelloCards() {
  const key = process.env.TRELLO_KEY
  const token = process.env.TRELLO_TOKEN

  if (!key || !token) {
    throw new Error('Missing Trello credentials')
  }

  const res = await fetch(
    `https://api.trello.com/1/members/me/cards?key=${encodeURIComponent(key)}&token=${encodeURIComponent(token)}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  )

  const raw = await res.text()

  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    data = { raw }
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch Trello cards')
  }

  return Array.isArray(data) ? data : []
}

async function createTrelloCard(name: string, desc: string) {
  const key = process.env.TRELLO_KEY
  const token = process.env.TRELLO_TOKEN
  const listId = process.env.TRELLO_LIST_ID

  if (!key || !token || !listId) {
    throw new Error('Missing Trello configuration')
  }

  const res = await fetch('https://api.trello.com/1/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      idList: listId,
      name,
      desc,
      key,
      token,
    }).toString(),
  })

  const raw = await res.text()

  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    data = { raw }
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to create Trello card')
  }

  return data
}

export default async function handler(req: any, res: any) {
  const authHeader = req.headers.authorization

  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { accessToken, refreshToken, expiresAt } =
      await getValidWorkflowMaxTokens()

    const jwtPayload = decodeJwtPayload(accessToken)
    const orgId = Array.isArray(jwtPayload.org_ids)
      ? jwtPayload.org_ids[0]
      : undefined

    if (!orgId) {
      return res.status(400).json({
        error: 'Could not determine WorkflowMax orgId',
      })
    }

    const [jobs, trelloCards] = await Promise.all([
      fetchAllWorkflowMaxJobs(accessToken, orgId),
      fetchTrelloCards(),
    ])

    const validJobs = jobs
      .map((job) => ({
        ...job,
        __createdTs: getJobCreatedTimestamp(job),
      }))
      .filter((job) => Number.isFinite(job.__createdTs) && job.__createdTs > 0)
      .sort((a, b) => a.__createdTs - b.__createdTs)

    const newestSeenTimestamp =
      validJobs.length > 0
        ? validJobs[validJobs.length - 1].__createdTs
        : Date.now()

    const existingState = await loadSyncState()

    if (!existingState?.initialized) {
      await saveSyncState({
        initialized: true,
        lastSeenCreatedAt: newestSeenTimestamp,
      })

      return res.status(200).json({
        ok: true,
        initialized: true,
        message:
          'Baseline created. Existing jobs were ignored. Future jobs will sync to Trello.',
        createdCount: 0,
        createdCards: [],
        baselineTimestamp: newestSeenTimestamp,
        tokens: {
          accessToken,
          refreshToken,
          expiresAt,
        },
      })
    }

    const baseline = existingState.lastSeenCreatedAt

    const futureJobsOnly = validJobs.filter((job) => job.__createdTs > baseline)

    const jobsToCreate = futureJobsOnly.filter((job) => {
      const jobNumber = job?.jobNumber
      if (!jobNumber) return false

      const alreadyInTrello = trelloCards.some((card: any) =>
        cardContainsExactJobNumber(card.name || '', jobNumber)
      )

      return !alreadyInTrello
    })

    const createdCards: any[] = []

    for (const job of jobsToCreate) {
      const identifier = getJobIdentifier(job)
      if (!identifier) continue

      const detail = await fetchWorkflowMaxJobDetail(
        accessToken,
        orgId,
        identifier
      )

      const jobNumber = detail?.jobNumber || job?.jobNumber || 'Unknown Job'
      const jobName = detail?.name || job?.name || 'Untitled job'
      const description =
        detail?.description ||
        detail?.jobDescription ||
        'No description provided in WorkflowMax.'

      const cardName = `${jobNumber} - ${jobName}`
      const cardDesc = [`WorkflowMax Job: ${jobNumber}`, '', description].join(
        '\n'
      )

      const created = await createTrelloCard(cardName, cardDesc)
      createdCards.push(created)
    }

    const newestProcessedTimestamp =
      futureJobsOnly.length > 0
        ? Math.max(...futureJobsOnly.map((job) => job.__createdTs))
        : baseline

    await saveSyncState({
      initialized: true,
      lastSeenCreatedAt: newestProcessedTimestamp,
    })

    return res.status(200).json({
      ok: true,
      initialized: false,
      baselineTimestamp: baseline,
      seenNewJobsCount: futureJobsOnly.length,
      createdCount: createdCards.length,
      createdCards,
      tokens: {
        accessToken,
        refreshToken,
        expiresAt,
      },
    })
  } catch (error: any) {
    return res.status(500).json({
      error: 'Sync failed',
      message: error?.message || 'Unknown error',
    })
  }
}