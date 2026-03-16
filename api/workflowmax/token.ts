export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body ?? {})

    const code = body.code

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing code' })
    }

    const clientId = process.env.WORKFLOWMAX_CLIENT_ID
    const clientSecret = process.env.WORKFLOWMAX_CLIENT_SECRET
    const redirectUri = process.env.WORKFLOWMAX_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(500).json({
        error: 'Missing server environment variables',
        hasClientId: Boolean(clientId),
        hasClientSecret: Boolean(clientSecret),
        hasRedirectUri: Boolean(redirectUri),
      })
    }

    const tokenRes = await fetch('https://oauth.workflowmax.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
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

    return res.status(tokenRes.status).json(data)
  } catch (error: any) {
    return res.status(500).json({
      error: 'Server error',
      message: error?.message || 'Unknown error',
    })
  }
}