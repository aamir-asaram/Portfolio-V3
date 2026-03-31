function decodeJwtPayload(token: string) {
  const payload = token.split('.')[1]
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
}

async function refreshWorkflowMaxToken(refreshToken: string) {
  const clientId = process.env.WORKFLOWMAX_CLIENT_ID
  const clientSecret = process.env.WORKFLOWMAX_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing WORKFLOWMAX_CLIENT_ID or WORKFLOWMAX_CLIENT_SECRET')
  }

  const tokenRes = await fetch('https://oauth.workflowmax.com/oauth/token', {
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

  const raw = await tokenRes.text()

  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    data = { raw }
  }

  if (!tokenRes.ok) {
    const error = new Error('Failed to refresh WorkflowMax token') as any
    error.status = tokenRes.status
    error.data = data
    throw error
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresIn: data.expires_in,
    raw: data,
  }
}

async function fetchJobsPage(accessToken: string, orgId: string | number, page: number, pageSize: number) {
  const apiUrl = `https://api.workflowmax.com/v2/jobs?page=${page}&pageSize=${pageSize}`

  const apiRes = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'account-id': String(orgId),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const raw = await apiRes.text()

  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    data = { raw }
  }

  return {
    ok: apiRes.ok,
    status: apiRes.status,
    data,
  }
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body ?? {})

    let accessToken = body.accessToken
    let refreshToken = body.refreshToken

    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(400).json({ error: 'Missing accessToken' })
    }

    if (!refreshToken || typeof refreshToken !== 'string') {
      return res.status(400).json({ error: 'Missing refreshToken' })
    }

    let jwtPayload: any
    let orgId: string | undefined

    try {
      jwtPayload = decodeJwtPayload(accessToken)
      orgId = Array.isArray(jwtPayload.org_ids)
        ? jwtPayload.org_ids[0]
        : undefined
    } catch (error: any) {
      return res.status(400).json({
        error: 'Invalid accessToken JWT',
        message: error?.message || 'Could not decode accessToken',
      })
    }

    if (!orgId) {
      return res.status(400).json({
        error: 'Could not find organisation ID in JWT payload',
        jwtPayload,
      })
    }

    const pageSize = 200
    let page = 1
    let total = 0
    let allJobs: any[] = []
    let keepGoing = true
    let tokenRefreshed = false
    let expiresIn: number | undefined

    while (keepGoing) {
      let pageResult = await fetchJobsPage(accessToken, orgId, page, pageSize)

      if (pageResult.status === 401) {
        const refreshed = await refreshWorkflowMaxToken(refreshToken)
        accessToken = refreshed.accessToken
        refreshToken = refreshed.refreshToken
        expiresIn = refreshed.expiresIn
        tokenRefreshed = true

        jwtPayload = decodeJwtPayload(accessToken)
        orgId = Array.isArray(jwtPayload.org_ids)
          ? jwtPayload.org_ids[0]
          : undefined

        if (!orgId) {
          return res.status(400).json({
            error: 'Could not find organisation ID after token refresh',
            jwtPayload,
          })
        }

        pageResult = await fetchJobsPage(accessToken, orgId, page, pageSize)
      }

      if (!pageResult.ok) {
        return res.status(pageResult.status).json({
          orgId,
          workflowmaxResponse: pageResult.data,
          failedPage: page,
          tokenRefreshed,
        })
      }

      const pageItems = Array.isArray(pageResult.data?.data) ? pageResult.data.data : []
      total = typeof pageResult.data?.total === 'number' ? pageResult.data.total : total

      allJobs = allJobs.concat(pageItems)

      if (pageItems.length < pageSize || (total > 0 && allJobs.length >= total)) {
        keepGoing = false
      } else {
        page += 1
      }
    }

    return res.status(200).json({
      orgId,
      tokenRefreshed,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn,
      },
      workflowmaxResponse: {
        data: allJobs,
        total,
      },
    })
  } catch (error: any) {
    return res.status(error?.status || 500).json({
      error: 'Server error',
      message: error?.message || 'Unknown error',
      details: error?.data || null,
    })
  }
}