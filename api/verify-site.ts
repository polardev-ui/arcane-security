import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteId, domain, verificationCode, token } = req.body

    if (!siteId || !domain || !verificationCode || !token) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    })

    const fileUrl = `https://${domain.replace(/\/$/, '')}/arcane-verify.txt`
    const resp = await fetch(fileUrl)

    if (!resp.ok) {
      return res.status(200).json({
        verified: false,
        error: `Could not fetch ${fileUrl} (HTTP ${resp.status})`,
      })
    }

    const content = (await resp.text()).trim()

    if (content !== verificationCode) {
      return res.status(200).json({ verified: false, error: 'Verification code does not match' })
    }

    await supabase
      .from('sites')
      .update({ verification_status: 'verified', verified_at: new Date().toISOString() })
      .eq('id', siteId)

    return res.status(200).json({ verified: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
