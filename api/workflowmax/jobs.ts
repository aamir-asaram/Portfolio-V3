function decodeJwtPayload(token: string) {
  const payload = token.split('.')[1]
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
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

    const accessToken = body.accessToken

    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(400).json({ error: 'Missing accessToken' })
    }

    const jwtPayload = decodeJwtPayload(accessToken)

    const orgId = Array.isArray(jwtPayload.org_ids)
      ? jwtPayload.org_ids[0]
      : undefined

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

    while (keepGoing) {
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

      if (!apiRes.ok) {
        return res.status(apiRes.status).json({
          orgId,
          workflowmaxResponse: data,
          failedPage: page,
        })
      }

      const pageItems = Array.isArray(data?.data) ? data.data : []
      total = typeof data?.total === 'number' ? data.total : total

      allJobs = allJobs.concat(pageItems)

      if (pageItems.length < pageSize || (total > 0 && allJobs.length >= total)) {
        keepGoing = false
      } else {
        page += 1
      }
    }

    const lastFiveJobs = allJobs
      .sort((a, b) => {
        const aDate = new Date(
          a?.updatedDate || a?.createdDate || 0
        ).getTime()
        const bDate = new Date(
          b?.updatedDate || b?.createdDate || 0
        ).getTime()
        return bDate - aDate
      })
      .slice(0, 5)

    return res.status(200).json({
      orgId,
      workflowmaxResponse: {
        data: lastFiveJobs,
        count: lastFiveJobs.length,
        total,
      },
    })
  } catch (error: any) {
    return res.status(500).json({
      error: 'Server error',
      message: error?.message || 'Unknown error',
    })
  }
}