import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Globe, Plus, Trash2, ChevronDown, ChevronUp, ExternalLink, Copy, CheckCheck, Loader2, Shield, RefreshCw, FileText, Search, Code, Monitor, Braces, Server } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScannedPage {
  path: string
  hasForm: boolean
}

interface Site {
  id: string
  domain: string
  name: string
  is_active: boolean
  verification_status: string
  verification_code: string | null
  verified_at: string | null
  verification_method: string | null
  scanned_pages: ScannedPage[]
  last_scanned_at: string | null
  created_at: string
}

export default function Sites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [scanningId, setScanningId] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState('')
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const [integrationTab, setIntegrationTab] = useState<Record<string, string>>({})

  const fetchSites = async () => {
    const { data } = await supabase.from('sites').select('*').order('created_at', { ascending: false })
    if (data) {
      setSites(data.map(s => ({
        ...s,
        scanned_pages: typeof s.scanned_pages === 'string' ? JSON.parse(s.scanned_pages) : (s.scanned_pages ?? []),
      })))
    }
    setLoading(false)
  }

  useEffect(() => { fetchSites() }, [])

  const generateCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let code = 'arcane-verify='
    for (let i = 0; i < 32; i++) code += chars[Math.floor(Math.random() * chars.length)]
    return code
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return

    const verificationCode = generateCode()

    const { error: err } = await supabase.from('sites').insert({
      user_id: user.user.id,
      name,
      domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      verification_code: verificationCode,
      verification_status: 'pending',
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

  const handleVerify = async (site: Site) => {
    setVerifyingId(site.id)
    setVerifyError('')

    const { data: session } = await supabase.auth.getSession()
    const token = session?.session?.access_token
    if (!token) { setVerifyError('Not authenticated'); setVerifyingId(null); return }

    try {
      const resp = await fetch('/api/verify-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          domain: site.domain,
          verificationCode: site.verification_code,
          token,
        }),
      })
      const result = await resp.json()
      if (result.verified) {
        fetchSites()
      } else {
        setVerifyError(result.error || 'Verification failed')
      }
    } catch (err: any) {
      setVerifyError(err.message)
    }
    setVerifyingId(null)
  }

  const handleScan = async (site: Site) => {
    setScanningId(site.id)

    const { data: session } = await supabase.auth.getSession()
    const token = session?.session?.access_token
    if (!token) return

    try {
      await fetch('/api/scan-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, domain: site.domain, token }),
      })
      fetchSites()
    } catch {}
    setScanningId(null)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
    setVerifyError('')
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
            <div key={site.id}>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <Globe className="w-5 h-5 text-white/60 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{site.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50 truncate">{site.domain}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        site.verification_status === 'verified'
                          ? 'bg-green-500/10 text-green-400'
                          : site.verification_status === 'failed'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {site.verification_status === 'verified' ? 'Verified' : site.verification_status === 'failed' ? 'Failed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleExpand(site.id)}
                    className="text-white/40 hover:text-white transition-colors p-1"
                  >
                    {expandedId === site.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
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
                  <button onClick={() => handleDelete(site.id)} className="text-white/30 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === site.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/[0.02] border-x border-b border-white/10 rounded-b-xl p-5 -mt-1 space-y-6">
                      {/* Verification Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-4 h-4 text-white/60" />
                          <h4 className="text-sm font-medium text-white">Ownership Verification</h4>
                          {site.verification_status === 'verified' && (
                            <span className="text-xs text-green-400">Complete</span>
                          )}
                        </div>
                        {site.verification_status === 'verified' ? (
                          <div className="text-sm text-green-400/80 bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                            Site verified {site.verification_method === 'auto' ? 'automatically via script' : ''} on {new Date(site.verified_at!).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                              <p className="text-sm text-blue-300/90 font-medium mb-1">Quick: Install the script</p>
                              <p className="text-sm text-blue-300/60">
                                Add the script from the <strong>Integration</strong> section below to your site.
                                When it loads, it will automatically verify your ownership — no files needed.
                              </p>
                            </div>
                            <details className="group">
                              <summary className="text-xs text-white/40 hover:text-white/60 cursor-pointer list-none flex items-center gap-1">
                                <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                                Manual: file-based verification
                              </summary>
                              <div className="mt-3 space-y-3">
                                <p className="text-sm text-white/60">
                                  Create a text file at the root of your site with the following content:
                                </p>
                                <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
                                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                                    <span className="text-xs text-white/40">
                                      https://{site.domain}/arcane-verify.txt
                                    </span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(site.verification_code || '')
                                        setCopiedCodeId(site.id)
                                        setTimeout(() => setCopiedCodeId(null), 2000)
                                      }}
                                      className="text-white/40 hover:text-white transition-colors"
                                    >
                                      {copiedCodeId === site.id ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                  </div>
                                  <div className="p-4">
                                    <code className="text-sm text-white/80 font-mono break-all">{site.verification_code}</code>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleVerify(site)}
                                  disabled={verifyingId === site.id}
                                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 disabled:opacity-50"
                                >
                                  {verifyingId === site.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                                  {verifyingId === site.id ? 'Checking...' : 'Verify Ownership'}
                                </button>
                              </div>
                            </details>
                            {verifyError && <p className="text-sm text-red-400">{verifyError}</p>}
                          </div>
                        )}
                      </div>

                      {/* Scan Section */}
                      {site.verification_status === 'verified' && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Search className="w-4 h-4 text-white/60" />
                              <h4 className="text-sm font-medium text-white">Page Scan</h4>
                            </div>
                            <button
                              onClick={() => handleScan(site)}
                              disabled={scanningId === site.id}
                              className="text-white/40 hover:text-white transition-colors text-xs flex items-center gap-1"
                            >
                              <RefreshCw className={`w-3 h-3 ${scanningId === site.id ? 'animate-spin' : ''}`} />
                              {scanningId === site.id ? 'Scanning...' : 'Rescan'}
                            </button>
                          </div>
                          {site.scanned_pages && site.scanned_pages.length > 0 ? (
                            <div className="space-y-2">
                              {site.scanned_pages.filter(p => p.hasForm).length === 0 && (
                                <p className="text-sm text-white/40">No login or registration pages found.</p>
                              )}
                              {site.scanned_pages.filter(p => p.hasForm).map((page) => (
                                <div key={page.path} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
                                  <FileText className="w-4 h-4 text-green-400 flex-shrink-0" />
                                  <span className="text-sm text-white/80 font-mono">{page.path}</span>
                                  <span className="text-xs text-green-400/80 ml-auto">Form detected</span>
                                </div>
                              ))}
                              <p className="text-xs text-white/30 mt-1">
                                Scanned {site.scanned_pages.length} paths — {site.scanned_pages.filter(p => p.hasForm).length} forms found
                              </p>
                            </div>
                          ) : scanningId === site.id ? (
                            <div className="flex items-center gap-2 text-sm text-white/40">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Scanning common paths...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-white/40">
                              <Search className="w-4 h-4" />
                              Click scan to find login &amp; registration pages
                            </div>
                          )}
                        </div>
                      )}

                      {/* CDN Integration */}
                      {site.verification_status === 'verified' && (function () {
                        const CDN_URL = `https://arcane.wsgpolar.me/cdn/trust.js`
                        const snippets: Record<string, { label: string, icon: any, code: string }> = {
                          html: {
                            label: 'HTML',
                            icon: Monitor,
                            code: `<!DOCTYPE html>\n<html>\n<head>\n  <script src="${CDN_URL}" data-site-key="${site.id}"></script>\n</head>\n<body>\n  <!-- Your content -->\n</body>\n</html>`,
                          },
                          react: {
                            label: 'React',
                            icon: Braces,
                            code: `// src/index.js or src/main.jsx\nimport { useEffect } from 'react'\n\nexport default function App() {\n  useEffect(() => {\n    const script = document.createElement('script')\n    script.src = "${CDN_URL}"\n    script.setAttribute('data-site-key', '${site.id}')\n    document.head.appendChild(script)\n  }, [])\n\n  return <div>Your app</div>\n}`,
                          },
                          nextjs: {
                            label: 'Next.js',
                            icon: Braces,
                            code: `// app/layout.tsx\nimport Script from 'next/script'\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <head>\n        <Script\n          src="${CDN_URL}"\n          strategy="afterInteractive"\n          data-site-key="${site.id}"\n        />\n      </head>\n      <body>{children}</body>\n    </html>\n  )\n}`,
                          },
                          wordpress: {
                            label: 'WordPress',
                            icon: Server,
                            code: `// Add to your theme's functions.php\nadd_action('wp_head', function() { ?>\n  <script src="${CDN_URL}" data-site-key="${site.id}"></script>\n<?php });`,
                          },
                        }
                        const activeTab = integrationTab[site.id] || 'html'
                        const tab = snippets[activeTab]
                        return (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="w-4 h-4 text-white/60" />
                            <h4 className="text-sm font-medium text-white">Integration</h4>
                          </div>
                          <p className="text-sm text-white/60 mb-3">
                            Add the script to your site. It auto-detects login/register forms and gates them.
                          </p>
                          <div className="flex gap-1 mb-3 flex-wrap">
                            {Object.entries(snippets).map(([key, s]) => {
                              const BtnIcon = s.icon
                              return (
                                <button
                                  key={key}
                                  onClick={() => setIntegrationTab(prev => ({ ...prev, [site.id]: key }))}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    activeTab === key
                                      ? 'bg-white text-black'
                                      : 'text-white/50 hover:text-white bg-white/5'
                                  }`}
                                >
                                  <BtnIcon className="w-3.5 h-3.5" />
                                  {s.label}
                                </button>
                              )
                            })}
                          </div>
                          <pre className="bg-black border border-white/10 rounded-lg p-3 text-xs overflow-x-auto">
                            <code className="text-white/70 whitespace-pre">{tab.code}</code>
                          </pre>
                        </div>
                        )
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


