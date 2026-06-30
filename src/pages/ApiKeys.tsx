import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Key, Plus, Trash2, Copy, CheckCheck } from 'lucide-react'
import { motion } from 'framer-motion'

interface ApiKey {
  id: string
  name: string
  key_value: string
  is_active: boolean
  site_id: string | null
  created_at: string
}

interface Site {
  id: string
  name: string
  domain: string
}

export default function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [siteId, setSiteId] = useState('')
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchData = async () => {
    const [keysRes, sitesRes] = await Promise.all([
      supabase.from('api_keys').select('*').order('created_at', { ascending: false }),
      supabase.from('sites').select('id, name, domain'),
    ])
    if (keysRes.data) setKeys(keysRes.data)
    if (sitesRes.data) setSites(sitesRes.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return

    const { error: err } = await supabase.from('api_keys').insert({
      user_id: user.user.id,
      site_id: siteId || null,
      name,
    })

    if (err) {
      setError(err.message)
    } else {
      setName('')
      setSiteId('')
      setShowForm(false)
      fetchData()
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('api_keys').delete().eq('id', id)
    fetchData()
  }

  const handleCopy = (keyVal: string, id: string) => {
    navigator.clipboard.writeText(keyVal)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/60" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-white/50 text-sm mt-1">Manage keys for integrating Arcane</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Key
        </button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={handleAdd}
          className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-white font-medium mb-4">Create API Key</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Key Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                placeholder="Production Key"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Site (optional)</label>
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/50"
              >
                <option value="">All sites</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.domain})</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-all">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-white/60 hover:text-white px-4 py-2 text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      {keys.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/10 rounded-xl">
          <Key className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">No API keys yet</h3>
          <p className="text-white/50 text-sm mb-4">Create your first API key to start integrating Arcane.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create API Key
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <div key={key.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-white/60" />
                  <span className="text-white font-medium">{key.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopy(key.key_value, key.id)}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Copy key"
                  >
                    {copiedId === key.id ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${key.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'}`}>
                    {key.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => handleDelete(key.id)} className="text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-white/40 bg-black px-2 py-1 rounded font-mono">{key.key_value}</code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
