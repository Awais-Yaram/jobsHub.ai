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
    <div style={{fontFamily:'system-ui,Segoe UI,Roboto',maxWidth:900,margin:'40px auto',padding:'0 20px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>jobsHub — Curated AI tasks</h1>
        <nav>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <p style={{color:'#555'}}>Click a job to view details and follow the referral link.</p>

      <main>
        {jobs.length === 0 && <p>Loading...</p>}
        {jobs.map(job => (
          <article key={job.id} style={{border:'1px solid #eee',padding:16,borderRadius:8,marginBottom:12}}>
            <h2 style={{margin:'0 0 6px'}}>{job.title}</h2>
            <p style={{margin:'0 0 8px',color:'#333'}}>{job.description}</p>
            <a href={`/r/${job.id}`} style={{color:'#0070f3'}}>Open referral link →</a>
          </article>
        ))}
      </main>

      <footer style={{marginTop:40,color:'#888'}}>
        <small>Powered by jobsHub</small>
      </footer>
    </div>
  )
}
