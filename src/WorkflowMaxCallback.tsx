import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function WorkflowMaxCallback() {
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''))

    const allQueryParams = Object.fromEntries(query.entries())
    const allHashParams = Object.fromEntries(hash.entries())

    console.log('Query params:', allQueryParams)
    console.log('Hash params:', allHashParams)

    // Temporary: store whatever comes back so you can inspect it
    localStorage.setItem(
      'workflowmax_oauth_response',
      JSON.stringify({
        query: allQueryParams,
        hash: allHashParams,
      })
    )
  }, [location])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>WorkflowMax callback received</h1>
      <p>You can now inspect the returned OAuth data in the console or localStorage.</p>
    </main>
  )
}