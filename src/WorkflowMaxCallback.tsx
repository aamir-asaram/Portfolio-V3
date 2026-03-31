import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function WorkflowMaxCallback() {
  const location = useLocation()
  const [message, setMessage] = useState('Processing login...')

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(location.search)
      const code = params.get('code')
      const state = params.get('state')
      const error = params.get('error')
      const errorDescription = params.get('error_description')

      if (error) {
        setMessage(`OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
        return
      }

      if (!code) {
        setMessage('No authorization code found in callback URL.')
        return
      }

      try {
        const res = await fetch('/api/workflowmax/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        })

        const raw = await res.text()

        let data: any
        try {
          data = JSON.parse(raw)
        } catch {
          throw new Error(raw || 'Non-JSON response from server')
        }

        if (!res.ok) {
          throw new Error(data?.error || data?.message || 'Token exchange failed')
        }

        localStorage.setItem('workflowmax_tokens', JSON.stringify(data))
        setMessage('WorkflowMax connected successfully.')
        window.location.href = '/workflowmax/jobs'
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Unexpected error')
      }
    }

    run()
  }, [location.search])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>WorkflowMax callback</h1>
      <p>{message}</p>
    </main>
  )
}