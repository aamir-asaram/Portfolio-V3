export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const apiKey = process.env.TRELLO_API_KEY
    const token = process.env.TRELLO_TOKEN

    if (!apiKey || !token) {
      return res.status(500).json({
        error: 'Missing Trello environment variables',
        hasApiKey: Boolean(apiKey),
        hasToken: Boolean(token),
      })
    }

    const trelloRes = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${encodeURIComponent(apiKey)}&token=${encodeURIComponent(token)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    )

    const raw = await trelloRes.text()

    let data: any
    try {
      data = JSON.parse(raw)
    } catch {
      data = { raw }
    }

    return res.status(trelloRes.status).json(data)
  } catch (error: any) {
    return res.status(500).json({
      error: 'Server error',
      message: error?.message || 'Unknown error',
    })
  }
}