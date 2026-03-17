import { useEffect, useState } from 'react'

type TrelloBoard = {
  id: string
  name: string
  desc?: string
  url: string
  closed: boolean
}

export default function TrelloBoardsPage() {
  const [boards, setBoards] = useState<TrelloBoard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/trello/boards')
        const data = await res.json()
        console.log('Trello API response:', data)
        if (!res.ok) {
          throw new Error(data?.error || data?.message || 'Failed to fetch Trello boards')
        }

        setBoards(Array.isArray(data) ? data : [])
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
      <h1>Trello Boards</h1>

      {boards.length === 0 ? (
        <p>No boards found.</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board.id} style={{ marginBottom: '1rem' }}>
              <strong>{board.name}</strong>
              <br />
              {board.desc ? <p>{board.desc}</p> : null}
              <a href={board.url} target="_blank" rel="noreferrer">
                Open card
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}