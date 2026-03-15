import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiClock, HiLightBulb, HiDocumentText, HiChartBar, HiLink } from 'react-icons/hi';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: HiShieldCheck, title: 'Unified Identity', desc: 'Store verified credentials from education, health, finance & employment.', color: 'text-primary' },
  { icon: HiClock, title: 'Consent Engine', desc: 'Approve or deny data access requests with field-level control.', color: 'text-accent' },
  { icon: HiChartBar, title: 'Trust Score', desc: 'Dynamic cross-domain score calculated from all your life domains.', color: 'text-secondary' },
  { icon: HiLightBulb, title: 'AI Life Advisor', desc: 'AI-powered insights combining data across all your life domains.', color: 'text-primary' },
  { icon: HiDocumentText, title: 'Data Cards', desc: 'Generate verified mini-summaries to share with institutions.', color: 'text-accent' },
  { icon: HiLink, title: 'Life Timeline', desc: 'Visual journey across education, jobs, health & financial milestones.', color: 'text-secondary' },
];

const steps = [
  { num: '01', title: 'Connect Sources', desc: 'Link DigiLocker, ABHA, financial accounts, and employment records.' },
  { num: '02', title: 'Control Access', desc: 'Approve or deny institution requests with granular field selection.' },
  { num: '03', title: 'Get Insights', desc: 'AI advisor analyzes your cross-domain data for actionable life insights.' },
];

const stats = [
  { value: '500M+', label: 'Potential Users' },
  { value: 'AES-256', label: 'Encryption' },
  { value: '<30sec', label: 'Verification' },
  { value: '100%', label: 'User Control' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold">
          <span className="text-primary">Nexus</span><span className="text-white">Life</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-sm text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/register" className="px-5 py-2 text-sm bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center"
        initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Your Life.</span>
          <br />
          <span className="text-white">One Passport.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          A unified digital identity platform. Store verified records, control data sharing, and get AI-powered life insights — all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="px-8 py-3 bg-primary text-dark font-bold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition text-lg">Get Started</Link>
          <Link to="/login" className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-primary hover:text-primary transition text-lg">See Demo</Link>
        </div>
      </motion.section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
          Everything You Need
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} className="bg-card border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition group"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <f.icon className={`text-3xl ${f.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div key={i} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.15, duration: 0.5 }}>
              <div className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">{s.num}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        © 2025 NexusLife. Built for a better digital future.
      </footer>
    </div>
  );
}
