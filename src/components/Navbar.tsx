import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, LogOut, User, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="w-7 h-7 text-white group-hover:opacity-80 transition-opacity" />
            <span className="text-xl font-bold text-white">Arcane</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/captcha-demo" className="text-white/60 hover:text-white transition-colors text-sm">Arcane Trust</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-white/60 hover:text-white transition-colors text-sm">Dashboard</Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                  <User className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/60">{user.email}</span>
                  <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-white/60 hover:text-white transition-colors text-sm">Sign In</Link>
                <Link to="/signup" className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-all">Get Started</Link>
              </div>
            )}
          </div>
          <button className="md:hidden text-white/60 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3 bg-[#0a0a0a]">
          <Link to="/captcha-demo" className="block text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>Arcane Trust</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block text-red-400">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" className="block text-white hover:text-white/80" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
