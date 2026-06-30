import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Globe, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Site {
  id: string
  domain: string
  name: string
  is_active: boolean
  created_at: string
}

export default function Sites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')

  const fetchSites = async () => {
    const { data } = await supabase.from('sites').select('*').order('created_at', { ascending: false })
    if (data) setSites(data)
    setLoading(false)
  }

  useEffect(() => { fetchSites() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return

    const { error: err } = await supabase.from('sites').insert({
      user_id: user.user.id,
      name,
      domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    })

    if (err) {
      setError(err.message)
    } else {
      setName('')
      setDomain('')
      setShowForm(false)
      fetchSites()
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('sites').delete().eq('id', id)
    fetchSites()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('sites').update({ is_active: !current }).eq('id', id)
    fetchSites()
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
          <h1 className="text-2xl font-bold text-white">Sites</h1>
          <p className="text-white/50 text-sm mt-1">Manage your protected websites</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Site
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
          <h3 className="text-white font-medium mb-4">Add New Site</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Site Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                placeholder="My Website"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                placeholder="example.com"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-all">Add Site</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-white/60 hover:text-white px-4 py-2 text-sm">Cancel</button>
          </div>
        </motion.form>
      )}

      {sites.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/10 rounded-xl">
          <Globe className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">No sites yet</h3>
          <p className="text-white/50 text-sm mb-4">Add your first site to start protecting it.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Your First Site
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sites.map((site) => (
            <div key={site.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white font-medium">{site.name}</p>
                  <p className="text-white/50 text-sm">{site.domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(site.id, site.is_active)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    site.is_active
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-white/5 text-white/40 border-white/10'
                  }`}
                >
                  {site.is_active ? 'Active' : 'Paused'}
                </button>
                <button
                  onClick={() => handleDelete(site.id)}
                  className="text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
