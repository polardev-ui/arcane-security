import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Key, Activity, Plus, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Site {
  id: string
  domain: string
  name: string
  is_active: boolean
  created_at: string
}

interface ApiKey {
  id: string
  name: string
  key_value: string
  is_active: boolean
  created_at: string
}

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    Promise.all([
      supabase.from('sites').select('*').order('created_at', { ascending: false }),
      supabase.from('api_keys').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([sitesRes, keysRes]) => {
      if (sitesRes.data) setSites(sitesRes.data)
      if (keysRes.data) setApiKeys(keysRes.data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/60" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Welcome back, {user?.email}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-white/60" />
            <h3 className="text-white font-medium">Sites</h3>
          </div>
          <p className="text-3xl font-bold text-white">{sites.length}</p>
          <p className="text-xs text-white/40 mt-1">Protected sites</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Key className="w-5 h-5 text-white/60" />
            <h3 className="text-white font-medium">API Keys</h3>
          </div>
          <p className="text-3xl font-bold text-white">{apiKeys.length}</p>
          <p className="text-xs text-white/40 mt-1">Active keys</p>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-white/60" />
            <h3 className="text-white font-medium">Verifications</h3>
          </div>
          <p className="text-3xl font-bold text-white">-</p>
          <p className="text-xs text-white/40 mt-1">Add a site to get started</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Your Sites</h3>
            <Link to="/dashboard/sites" className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
              Manage <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          {sites.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">No sites yet</p>
              <Link to="/dashboard/sites" className="text-white hover:text-white/80 text-sm mt-2 inline-flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add your first site
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sites.map((site) => (
                <div key={site.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{site.name}</p>
                    <p className="text-white/40 text-xs">{site.domain}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${site.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'}`}>
                    {site.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">API Keys</h3>
            <Link to="/dashboard/api-keys" className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
              Manage <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">No API keys yet</p>
              <Link to="/dashboard/api-keys" className="text-white hover:text-white/80 text-sm mt-2 inline-flex items-center gap-1">
                <Plus className="w-3 h-3" /> Create your first key
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{key.name}</p>
                    <p className="text-white/40 text-xs font-mono">{key.key_value.slice(0, 16)}...</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${key.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'}`}>
                    {key.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
