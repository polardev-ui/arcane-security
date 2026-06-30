import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!

function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req: any, res: any) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteKey } = req.body
    if (!siteKey) return res.status(400).json({ error: 'Missing siteKey' })

    const origin = req.headers['origin'] || req.headers['referer'] || ''
    const domain = origin.replace(/^https?:\/\//, '').replace(/\/.*$/, '').split(':')[0]

    if (!domain) return res.status(400).json({ error: 'Could not determine domain' })

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' })

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${serviceRoleKey}` } },
    })

    const { data: site } = await supabase.from('sites').select('id, domain, verification_status').eq('id', siteKey).single()
    if (!site) return res.status(404).json({ error: 'Site not found' })

    if (site.domain !== domain) return res.status(400).json({ error: 'Domain mismatch' })

    if (site.verification_status !== 'verified') {
      await supabase.from('sites').update({
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
        verification_method: 'auto',
      }).eq('id', siteKey)
    }

    return res.status(200).json({ verified: true, domain })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
