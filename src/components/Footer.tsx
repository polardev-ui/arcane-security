import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white/60" />
            <span className="text-white/60 font-medium">Arcane Security</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <span>Arcane Trust Captcha</span>
            <span>Challenge Pages</span>
            <span>Bot Detection</span>
          </div>
          <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} Arcane Security. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
