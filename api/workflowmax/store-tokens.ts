import { redis } from '@/lib/redis'

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
    const refreshToken = body.refreshToken
    const expiresAt = body.expiresAt ?? null

    if (!accessToken || !refreshToken) {
      return res.status(400).json({ error: 'Missing accessToken or refreshToken' })
    }

    await redis.set('workflowmax:tokens', {
      accessToken,
      refreshToken,
      expiresAt,
    })

    return res.status(200).json({ ok: true })
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to store tokens',
      message: error?.message || 'Unknown error',
    })
  }
}