import { useEffect, useRef, useState } from 'react'
import { XCircle } from 'lucide-react'

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

export default function ArcaneTrustCaptcha({ siteKey, onVerify }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (window.ArcaneTrust) {
      if (containerRef.current) {
        window.ArcaneTrust.render(containerRef.current, { siteKey, onVerify: (t) => onVerify?.(t) })
      }
      return
    }

    const script = document.createElement('script')
    script.src = 'https://arcane.wsgpolar.me/cdn/trust.js'
    script.async = true
    script.onload = () => {
      if (window.ArcaneTrust && containerRef.current) {
        window.ArcaneTrust.render(containerRef.current, { siteKey, onVerify: (t) => onVerify?.(t) })
      }
    }
    script.onerror = () => setError('Failed to load Arcane Trust. Check your connection.')
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) document.head.removeChild(script)
    }
  }, [siteKey, onVerify])

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

  return <div ref={containerRef} />
}
