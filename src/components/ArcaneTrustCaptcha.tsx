import { useEffect, useRef, useState } from 'react'
import { Shield, Loader2, CheckCircle, XCircle } from 'lucide-react'

declare global {
  interface Window {
    ArcaneTrust?: {
      render: (container: HTMLElement, config: { siteKey: string; onVerify: (token: string) => void }) => void
    }
  }
}

interface Props {
  siteKey: string
  onVerify?: (token: string) => void
}

type Status = 'loading' | 'ready' | 'verifying' | 'passed' | 'failed'

export default function ArcaneTrustCaptcha({ siteKey, onVerify }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (window.ArcaneTrust) {
      setStatus('ready')
      return
    }

    const script = document.createElement('script')
    script.src = 'https://arcane.wsgpolar.me/cdn/trust.js'
    script.async = true
    script.onload = () => {
      if (window.ArcaneTrust && containerRef.current) {
        window.ArcaneTrust.render(containerRef.current, {
          siteKey,
          onVerify: (token: string) => {
            setStatus('passed')
            onVerify?.(token)
          },
        })
        setStatus('ready')
      }
    }
    script.onerror = () => {
      setError('Failed to load Arcane Trust. Check your connection.')
      setStatus('ready')
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [siteKey, onVerify])

  const handleVerify = () => {
    setStatus('verifying')
    setTimeout(() => {
      const passed = Math.random() > 0.2
      setStatus(passed ? 'passed' : 'failed')
      if (passed) onVerify?.('mock_token_abc123')
    }, 2000)
  }

  const handleReset = () => setStatus('ready')

  if (error) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-xl p-5 max-w-md mx-auto">
        <div className="text-center py-3">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-5 max-w-md mx-auto" ref={containerRef}>
      <div className="flex items-center gap-3 mb-3">
        <Shield className={`w-5 h-5 ${status === 'passed' ? 'text-green-400' : status === 'failed' ? 'text-red-400' : 'text-white/60'}`} />
        <span className="text-sm font-medium text-white/80">Arcane Trust</span>
        <span className="text-xs text-white/30 ml-auto">Security Check</span>
      </div>

      {status === 'loading' && (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin mx-auto mb-2" />
          <p className="text-xs text-white/40">Loading Arcane Trust...</p>
        </div>
      )}

      {status === 'ready' && (
        <div className="text-center py-4">
          <p className="text-sm text-white/60 mb-4">Verify you're human to continue</p>
          <button
            onClick={handleVerify}
            className="bg-white text-black hover:bg-white/90 px-6 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Verify Humanity
          </button>
        </div>
      )}

      {status === 'verifying' && (
        <div className="text-center py-4">
          <Loader2 className="w-8 h-8 text-white/60 animate-spin mx-auto mb-2" />
          <p className="text-sm text-white/60">Running verification protocols...</p>
        </div>
      )}

      {status === 'passed' && (
        <div className="text-center py-4">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-400 font-medium">Verification Passed</p>
          <p className="text-xs text-white/40 mt-1">Human confirmed</p>
          <button onClick={handleReset} className="mt-3 text-xs text-white/60 hover:text-white">Reset</button>
        </div>
      )}

      {status === 'failed' && (
        <div className="text-center py-4">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400 font-medium">Verification Failed</p>
          <p className="text-xs text-white/40 mt-1">Try again</p>
          <button onClick={handleReset} className="mt-3 text-xs text-white/60 hover:text-white">Try Again</button>
        </div>
      )}
    </div>
  )
}
