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

    const orgId =
      jwtPayload.org_id ||
      jwtPayload.organisation_id ||
      jwtPayload.organization_id ||
      jwtPayload.account_id

    if (!orgId) {
      return res.status(400).json({
        error: 'Could not find organisation ID in JWT payload',
        jwtPayload,
      })
    }

    // Best-effort endpoint based on WorkflowMax job list references
    const apiRes = await fetch('https://api.workflowmax.com/job.api/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        account_id: String(orgId),
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

    return res.status(apiRes.status).json({
      orgId,
      jwtPayload,
      workflowmaxResponse: data,
    })
  } catch (error: any) {
    return res.status(500).json({
      error: 'Server error',
      message: error?.message || 'Unknown error',
    })
  }
}