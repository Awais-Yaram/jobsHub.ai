import '../styles/globals.css'

export default function App({ Component, pageProps }) {
return <Component {...pageProps} />
}

Create pages/admin.js
Type:
pages/admin.js
Paste:

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Admin() {
const [user, setUser] = useState(null)
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [externalUrl, setExternalUrl] = useState('')
const [jobs, setJobs] = useState([])
useEffect(() => {
const s = supabase.auth.onAuthStateChange((event, session) => {
setUser(session?.user ?? null)
})
supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
fetchJobs()
return () => s.subscription.unsubscribe()
}, [])

async function signIn() {
const email = prompt('Enter admin email:')
if (!email) return
await supabase.auth.signInWithOtp({ email })
alert('Check your email for a magic link to sign in')
}

async function signOut() {
await supabase.auth.signOut()
setUser(null)
}

async function fetchJobs() {
const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
setJobs(data || [])
}

async function addJob(e) {
e.preventDefault()
if (!user) return alert('Sign in first')
const { error } = await supabase.from('jobs').insert({ title, description, external_url: externalUrl })
if (error) return alert(error.message)
setTitle('')
setDescription('')
setExternalUrl('')
fetchJobs()
}

return (
<div style={{maxWidth:800,margin:'40px auto',padding:'0 20px',fontFamily:'system-ui,Segoe UI,Roboto'}}>
<header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<h1>Admin — jobsHub</h1>
<div>
{user ? (
<>
<span style={{marginRight:12}}>{user.email}</span>
<button onClick={signOut}>Sign out</button>
</>
) : (
<button onClick={signIn}>Sign in (magic link)</button>
)}
</div>
</header>
  <section style={{marginTop:20}}>
    <h2>Add job</h2>
    <form onSubmit={addJob}>
      <div style={{marginBottom:8}}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{width:'100%',padding:8}} />
      </div>
      <div style={{marginBottom:8}}>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{width:'100%',padding:8}} />
      </div>
      <div style={{marginBottom:8}}>
        <input placeholder="Referral URL (external)" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} style={{width:'100%',padding:8}} />
      </div>
      <button type="submit">Add job</button>
    </form>
  </section>

  <section style={{marginTop:24}}>
    <h2>Existing jobs</h2>
    {jobs.map(j => (
      <div key={j.id} style={{border:'1px solid #eee',padding:12,borderRadius:6,marginBottom:8}}>
        <strong>{j.title}</strong>
        <div style={{fontSize:13,color:'#555'}}>{j.description}</div>
        <div style={{marginTop:6}}><a href={`/r/${j.id}`}>Open referral link</a></div>
      </div>
    ))}
  </section>
</div>
)
}
