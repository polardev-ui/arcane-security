import { Shield, Code, CheckCircle, Copy, CheckCheck } from 'lucide-react'
import ArcaneTrustCaptcha from '../components/ArcaneTrustCaptcha'
import { useState } from 'react'

export default function CaptchaDemo() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`<script src="https://arcane.wsgpolar.me/cdn/trust.js"></script>
<div id="arcane-trust"></div>
<script>
  ArcaneTrust.render(document.getElementById('arcane-trust'), {
    siteKey: 'your_site_key',
    onVerify: (token) => console.log('Verified!', token)
  });
</script>`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
          <Shield className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/60">Interactive Demo</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Arcane Trust Captcha</h1>
        <p className="text-white/50 max-w-xl mx-auto">
          A next-generation verification system that keeps bots out while letting humans through—no puzzles required.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Try It Out</h2>
          <ArcaneTrustCaptcha siteKey="demo_site_key" onVerify={(token) => console.log('Verified:', token)} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Key Features</h2>
          <div className="space-y-3">
            {[
              'Invisible to real users — no more distorted text or traffic lights',
              'Cryptographic challenge-response verification',
              'Behavioral biometric analysis (mouse movement, scrolling)',
              'Browser integrity and environment checks',
              'IP reputation and rate-limit scoring',
              'Seamless CDN integration in any framework',
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">CDN Integration</h2>
          </div>
          <button
            onClick={handleCopy}
            className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1.5"
          >
            {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-sm text-white/50 mb-4">
          Add the script to your <code className="text-white bg-white/5 px-1 rounded">&lt;head&gt;</code> and render the widget anywhere:
        </p>
        <pre className="bg-black border border-white/10 rounded-lg p-4 overflow-x-auto text-sm">
          <code className="text-white/80">
{`<script src="https://arcane.wsgpolar.me/cdn/trust.js"></script>

<!-- Place the widget anywhere -->
<div id="arcane-trust"></div>

<script>
  ArcaneTrust.render(
    document.getElementById('arcane-trust'),
    {
      siteKey: 'your_site_key',
      onVerify: (token) => {
        // Token sent to your backend for validation
        console.log('Human verified:', token)
      }
    }
  );
</script>`}
          </code>
        </pre>
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-medium text-white mb-2">React / Next.js / Vue</h3>
          <p className="text-sm text-white/50">
            Use the <span className="text-white">@arcane/trust</span> npm package for framework-native rendering.
          </p>
        </div>
      </div>
    </div>
  )
}
