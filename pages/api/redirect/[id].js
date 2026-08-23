const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
const { id } = req.query
if (!id) return res.status(400).send('Missing id')

const jobRes = await fetch(${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}, {
headers: {
apikey: SUPABASE_SERVICE_ROLE_KEY,
Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY},
'Content-Type': 'application/json'
}
})

const jobs = await jobRes.json()
if (!jobs || jobs.length === 0) return res.status(404).send('Job not found')

const job = jobs[0]
await fetch(${SUPABASE_URL}/rest/v1/clicks, {
method: 'POST',
headers: {
apikey: SUPABASE_SERVICE_ROLE_KEY,
Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY},
'Content-Type': 'application/json'
},
body: JSON.stringify({ job_id: job.id })
})

res.writeHead(307, { Location: job.external_url })
res.end()
}
