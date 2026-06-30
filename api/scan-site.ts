import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!

const COMMON_PATHS = [
  '/login', '/signin', '/sign-in', '/log-in', '/auth/login',
  '/register', '/signup', '/sign-up', '/auth/register', '/auth/signup',
  '/wp-login', '/admin', '/account/login', '/account/register',
  '/user/login', '/user/register', '/users/login', '/users/signup',
]

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteId, domain, token } = req.body

    if (!siteId || !domain || !token) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const baseUrl = `https://${domain.replace(/\/$/, '')}`
    const foundPages: { path: string; hasForm: boolean }[] = []

    for (const path of COMMON_PATHS) {
      try {
        const resp = await fetch(`${baseUrl}${path}`, { signal: AbortSignal.timeout(5000) })
        if (resp.ok) {
          const html = await resp.text()
          const hasForm = /<form/i.test(html) && /(password|login|register|signin|signup)/i.test(html)
          foundPages.push({ path, hasForm })
        }
      } catch {
        // silently skip unreachable paths
      }
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    })

    await supabase
      .from('sites')
      .update({ scanned_pages: JSON.stringify(foundPages), last_scanned_at: new Date().toISOString() })
      .eq('id', siteId)

    return res.status(200).json({ pages: foundPages })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
