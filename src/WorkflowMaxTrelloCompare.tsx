import { useEffect, useMemo, useState } from 'react'

type WorkflowMaxJob = {
  uuid: string
  jobNumber: string
  name: string
  createdAt?: string
  updatedAt?: string
}

type TrelloCard = {
  id: string
  name: string
  url: string
  idList?: string
  closed?: boolean
}

type WorkflowMaxResponse = {
  workflowmaxResponse?: {
    data?: WorkflowMaxJob[]
    total?: number
  }
  data?: WorkflowMaxJob[]
  total?: number
}

type TrelloResponse = {
  cards?: TrelloCard[]
} | TrelloCard[]

// function normalize(value: string) {
//   return value.trim().toLowerCase()
// }

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function cardContainsExactJobNumber(cardName: string, jobNumber: string) {
  const regex = new RegExp(`\\b${escapeRegExp(jobNumber)}\\b`, 'i')
  return regex.test(cardName)
}

export default function WorkflowMaxTrelloCompare() {
  const [jobs, setJobs] = useState<WorkflowMaxJob[]>([])
  const [cards, setCards] = useState<TrelloCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem('workflowmax_tokens') || '{}')

        const [jobsRes, cardsRes] = await Promise.all([
          fetch('/api/workflowmax/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accessToken: tokens.access_token,
            }),
          }),
          fetch('/api/trello/cards'),
        ])

        const jobsJson: WorkflowMaxResponse = await jobsRes.json()
        const cardsJson: TrelloResponse = await cardsRes.json()

        if (!jobsRes.ok) {
          throw new Error(
            (jobsJson as any)?.error ||
              (jobsJson as any)?.message ||
              'Failed to fetch WorkflowMax jobs'
          )
        }

        if (!cardsRes.ok) {
          throw new Error(
            (cardsJson as any)?.error ||
              (cardsJson as any)?.message ||
              'Failed to fetch Trello cards'
          )
        }

        const workflowMaxJobs =
          jobsJson.workflowmaxResponse?.data ??
          jobsJson.data ??
          []

        const trelloCards = Array.isArray(cardsJson)
          ? cardsJson
          : cardsJson.cards ?? []

        setJobs(workflowMaxJobs)
        setCards(trelloCards)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const { matchedJobs, unmatchedJobs } = useMemo(() => {
    const matched = jobs
      .map((job) => {
        const matchingCards = cards.filter((card) =>
          cardContainsExactJobNumber(card.name, job.jobNumber)
        )

        return {
          job,
          matchingCards,
        }
      })
      .filter((item) => item.matchingCards.length > 0)

    const unmatched = jobs.filter(
      (job) =>
        !cards.some((card) =>
          cardContainsExactJobNumber(card.name, job.jobNumber)
        )
    )

    return {
      matchedJobs: matched,
      unmatchedJobs: unmatched,
    }
  }, [jobs, cards])

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-primary p-8">
        <h1 className="text-4xl font-semibold mb-4">WorkflowMax vs Trello</h1>
        <p>Loading...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-primary p-8">
        <h1 className="text-4xl font-semibold mb-4">WorkflowMax vs Trello</h1>
        <p className="text-red-400">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-primary p-8">
      <h1 className="text-4xl font-semibold mb-2">WorkflowMax vs Trello</h1>
      <p className="mb-8 text-sm opacity-80">
        WorkflowMax jobs: {jobs.length} · Trello cards: {cards.length}
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Matched Jobs ({matchedJobs.length})
        </h2>

        {matchedJobs.length === 0 ? (
          <p>No matched jobs found.</p>
        ) : (
          <div className="space-y-4">
            {matchedJobs.map(({ job, matchingCards }) => (
              <div
                key={job.uuid}
                className="border border-neutral-800 rounded-xl p-4"
              >
                <div className="mb-3">
                  <p className="text-lg font-semibold">
                    {job.jobNumber} — {job.name}
                  </p>
                </div>

                <div className="space-y-2">
                  {matchingCards.map((card) => (
                    <div
                      key={card.id}
                      className="rounded-lg border border-neutral-900 p-3"
                    >
                      <p className="font-medium">{card.name}</p>
                      <a
                        href={card.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-sm"
                      >
                        Open Trello card
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Unmatched WorkflowMax Jobs ({unmatchedJobs.length})
        </h2>

        {unmatchedJobs.length === 0 ? (
          <p>All WorkflowMax jobs have matching Trello cards.</p>
        ) : (
          <div className="space-y-4">
            {unmatchedJobs.map((job) => (
              <div
                key={job.uuid}
                className="border border-neutral-800 rounded-xl p-4"
              >
                <p className="text-lg font-semibold">
                  {job.jobNumber} — {job.name}
                </p>
                <p className="text-sm opacity-75 mt-1">
                  No Trello card title contains this job number.
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}