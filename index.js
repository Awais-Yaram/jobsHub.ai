import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    async function fetchJobs() {
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data)
    }
    fetchJobs()
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 920, margin: '40px auto', padding: '0 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>jobsHub — AI jobs</h1>
        <Link href="/admin">Admin</Link>
      </header>

      <p>Click a job to view details and follow the referral link.</p>

      <main>
        {jobs.length === 0 && <p>Loading...</p>}
        {jobs.map((job) => (
          <article key={job.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <h2 style={{ margin: '0 0 8px' }}>{job.title}</h2>
            <p style={{ margin: '0 0 12px' }}>{job.description}</p>
            <a href={`/r/${job.id}`}>Open referral link →</a>
          </article>
        ))}
      </main>

      <footer style={{ marginTop: 30, color: '#666' }}>
        <small>Powered by jobsHub</small>
      </footer>
    </div>
  )
}
