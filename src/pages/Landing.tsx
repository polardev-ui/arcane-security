import { Link } from 'react-router-dom'
import { Shield, Fingerprint, Bot, Lock, ArrowRight, CheckCircle, Globe, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-white/[0.03] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent" />
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <Shield className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Next-Generation Security Platform</span>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Protect Your Site with{' '}
              <span className="text-white">Arcane Trust</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              Advanced CAPTCHA challenges and bot detection powered by real verification protocols.
              Secure your webpages like never before.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <Link
                to="/signup"
                className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/captcha-demo"
                className="border border-white/20 hover:border-white/40 text-white/80 px-8 py-3 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2"
              >
                Try Arcane Trust
                <Shield className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" {...fadeUp}>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Why Arcane?</h2>
          <p className="text-white/50 max-w-xl mx-auto">Enterprise-grade security that doesn't compromise user experience.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Fingerprint, title: 'Arcane Trust Captcha', desc: 'Invisible verification that real humans pass seamlessly while blocking bots.' },
            { icon: Bot, title: 'Advanced Bot Detection', desc: 'Multi-layer detection analyzing behavior, browser fingerprint, and request patterns.' },
            { icon: Lock, title: 'Challenge Pages', desc: 'Customizable challenge pages that adapt to threat levels in real-time.' },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all"
              whileHover={{ y: -4 }}
            >
              <feature.icon className="w-10 h-10 text-white/80 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="bg-white/[0.02] border-y border-white/10" {...fadeUp}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">How Arcane Trust Works</h2>
              <div className="space-y-6">
                {[
                  { icon: Globe, step: '1. Visitor loads your page', desc: 'Arcane Trust initializes in the background without interrupting the user.' },
                  { icon: Zap, step: '2. Real-time verification', desc: 'Behavioral analysis, browser checks, and cryptographic challenges run instantly.' },
                  { icon: CheckCircle, step: '3. Seamless pass or challenge', desc: 'Humans pass invisibly. Suspicious traffic gets an adaptive challenge.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.step}</p>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Trusted Verification</h3>
              <div className="space-y-3 text-sm text-white/50">
                {['Cryptographic challenge-response', 'Behavioral biometric analysis', 'Browser integrity verification', 'IP reputation scoring', 'Rate limiting & anomaly detection'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center" {...fadeUp}>
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Site?</h2>
        <p className="text-white/50 mb-8 max-w-lg mx-auto">Join the next generation of web security. Get started in minutes.</p>
        <Link
          to="/signup"
          className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2"
        >
          Create Free Account
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.section>
    </div>
  )
}
