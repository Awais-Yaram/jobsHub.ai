import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Admin() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetchJobs()
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))

    return () => authListener.subscription.unsubscribe()
  }, [])

  async function fetchJobs() {
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    setJobs(data || [])
  }

  async function signIn() {
    const email = prompt('Enter admin email:')
    if (!email) return
    await supabase.auth.signInWithOtp({ email })
    alert('Check your email for the magic link.')
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function addJob(e) {
    e.preventDefault()
    if (!user) return alert('Please sign in first.')

    const { error } = await supabase.from('jobs').insert({
      title,
      description,
      external_url: externalUrl,
    })

    if (error) return alert(error.message)

    setTitle('')
    setDescription('')
    setExternalUrl('')
    fetchJobs()
  }

  return (
    <div style={{ margin: '40px auto', maxWidth: 800, padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin</h1>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.email}</span>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <button onClick={signIn}>Sign in (magic link)</button>
        )}
      </header>

      <section style={{ marginTop: 20 }}>
        <h2>Add job</h2>
        <form onSubmit={addJob}>
          <div style={{ marginBottom: 8 }}>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: 8, minHeight: 80 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input placeholder="Referral URL" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </div>
          <button type="submit">Add job</button>
        </form>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Current jobs</h2>
        {jobs.map((job) => (
          <div key={job.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <strong>{job.title}</strong>
            <p>{job.description}</p>
            <a href={`/r/${job.id}`}>View referral</a>
          </div>
        ))}
      </section>
    </div>
  )
}
