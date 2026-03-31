import { useEffect, useState } from 'react'

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const stored = localStorage.getItem('workflowmax_tokens')
        const tokens = stored ? JSON.parse(stored) : {}

        const accessToken = tokens.accessToken || tokens.access_token
        const refreshToken = tokens.refreshToken || tokens.refresh_token

        if (!accessToken) {
          window.location.href = '/workflowmax-connect'
          return
        }

        if (!refreshToken) {
          throw new Error('Missing WorkflowMax refresh token')
        }

        const res = await fetch('/api/workflowmax/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
          }),
        })

        const data = await res.json()
        console.log('WorkflowMax API response:', data)

        if (!res.ok) {
          throw new Error(data?.message || data?.error || 'Failed to fetch jobs')
        }

        if (data?.tokens?.accessToken && data?.tokens?.refreshToken) {
          localStorage.setItem(
            'workflowmax_tokens',
            JSON.stringify({
              accessToken: data.tokens.accessToken,
              refreshToken: data.tokens.refreshToken,
              expiresIn: data.tokens.expiresIn ?? null,
              expiresAt: data.tokens.expiresIn
                ? Date.now() + data.tokens.expiresIn * 1000
                : null,
            })
          )
        }

        setJobs(data.workflowmaxResponse?.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <main style={{ padding: '2rem' }}>
      <h1>WorkflowMax Jobs</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.uuid || job.id || job.jobNumber}>
            <strong>{job.jobNumber}</strong> - {job.name}
            {job.priority ? <> | Priority: {job.priority}</> : null}
            {job.description ? <p>{job.description}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}