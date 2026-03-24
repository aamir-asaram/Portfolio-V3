import { useEffect, useState } from 'react'

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem('workflowmax_tokens') || '{}')

        const res = await fetch('/api/workflowmax/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: tokens.access_token,
          }),
        })

        const data = await res.json()
        console.log('WorkflowMax API response:', data)

        if (!res.ok) {
          throw new Error(data?.message || data?.error || 'Failed to fetch jobs')
        }

        setJobs(data.workflowmaxResponse?.data ?? [])
        console.log('WorkflowMax API response:', data)
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
          <li key={job.uuid}>
            <strong>{job.jobNumber}</strong> - {job.name} | Priority: {job.priority}<br />
            {/* <p>{job.description}</p> */}
          </li>
        ))}
      </ul>
    </main>
  )
}