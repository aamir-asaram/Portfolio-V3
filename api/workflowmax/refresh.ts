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
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
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
      return res.status(tokenRes.status).json({
        error: 'Token refresh failed',
        workflowmaxResponse: data,
      })
    }

    return res.status(200).json({
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope,
      raw: data,
    })
  } catch (error: any) {
    return res.status(500).json({
      error: 'Server error',
      message: error?.message || 'Unknown error',
    })
  }
}