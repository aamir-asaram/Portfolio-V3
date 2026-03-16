export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body ?? {})

    const refreshToken = body.refreshToken

    if (!refreshToken || typeof refreshToken !== 'string') {
      return res.status(400).json({ error: 'Missing refreshToken' })
    }

    const clientId = process.env.WORKFLOWMAX_CLIENT_ID
    const clientSecret = process.env.WORKFLOWMAX_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'Missing server environment variables',
        hasClientId: Boolean(clientId),
        hasClientSecret: Boolean(clientSecret),
      })
    }

    const tokenRes = await fetch('https://oauth.workflowmax.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'openid profile email workflowmax offline_access',
      }).toString(),
    })

    const raw = await tokenRes.text()

    let data: any
    try {
      data = JSON.parse(raw)
    } catch {
      data = { raw }
    }

    return res.status(tokenRes.status).json(data)
  } catch (error: any) {
    return res.status(500).json({
      error: 'Server error',
      message: error?.message || 'Unknown error',
    })
  }
}