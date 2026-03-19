import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiShieldCheck, HiClock, HiLightBulb, HiDocumentText, HiChartBar, HiLink, 
  HiOutlineLightningBolt 
} from 'react-icons/hi';
import { FaCheckCircle } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const stats = [
  { value: '500M+', label: 'Indians affected by data silos' },
  { value: 'AES-256', label: 'Military-grade encryption' },
  { value: '<30 sec', label: 'vs 2-3 days traditional' },
];

const steps = [
  { icon: HiLink, title: 'Connect your verified sources (DigiLocker, ABHA, Bank)' },
  { icon: HiShieldCheck, title: 'You control every access request' },
  { icon: HiOutlineLightningBolt, title: 'Institutions verify in seconds, not days' },
];

const features = [
  { icon: HiShieldCheck, title: 'Unified Identity', desc: 'Securely link all your credentials in one place.' },
  { icon: HiClock, title: 'Consent Engine', desc: 'Approve or deny access in one tap with field-level precision.' },
  { icon: HiLink, title: 'Life Timeline', desc: 'A beautiful visual journey of your milestones.' },
  { icon: HiDocumentText, title: 'Context Cards', desc: 'Share exactly what is needed—nothing more.' },
  { icon: HiLightBulb, title: 'AI Life Advisor', desc: 'Intelligent, cross-domain actionable insights.' },
  { icon: HiChartBar, title: 'Trust Score', desc: 'A unified metric measuring your digital reliability.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0D1F] text-white font-sans overflow-x-hidden selection:bg-primary/30">
      
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#0A0D1F]/80 backdrop-blur-lg border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="text-primary">Nexus</span>Life
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-bold bg-primary text-[#0A0D1F] rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[100vh] flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="absolute top-0 right-0 w-[800px] height-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] height-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

        <motion.div className="flex-1 z-10 text-center md:text-left"
          initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight mb-8" variants={fadeUp}>
            <span className="text-white block">Your Life.</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">One Passport.</span>
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light" variants={fadeUp}>
            NexusLife unifies education, health, finance and employment — giving <strong className="text-white font-semibold">YOU</strong> full control over who sees what.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start" variants={fadeUp}>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-[#0A0D1F] font-bold rounded-xl shadow-[0_0_30px_rgba(20,241,149,0.3)] hover:shadow-[0_0_40px_rgba(20,241,149,0.5)] transition-all hover:-translate-y-1">
              Create Your Passport
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 border-2 border-white/10 text-white font-medium rounded-xl hover:border-white/30 hover:bg-white/5 transition-all">
              See Live Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Mockup Card */}
        <motion.div className="flex-1 z-10 mt-20 md:mt-0 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          <motion.div 
            animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full max-w-md bg-gradient-to-br from-gray-900 to-[#0A0D1F] p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold tracking-tight">NexusCard</span>
              <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"><FaCheckCircle /> Verified</span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Holder Name</p>
                <p className="text-2xl text-white font-medium">Arjun Sharma</p>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                {[
                  { label: "Identity", val: 'Aadhaar Verified', icon: HiShieldCheck, c: 'text-orange-400' },
                  { label: "Education", val: 'B.Tech CS / Mumbai Univ', icon: HiDocumentText, c: 'text-primary' },
                  { label: "Finance", val: 'HDFC Active / Tax Cleared', icon: HiChartBar, c: 'text-accent' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-center bg-white/5 p-3 rounded-xl">
                    <div className={`p-2 bg-black/40 rounded-lg ${item.c}`}><item.icon size={18} /></div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{item.label}</p>
                      <p className="text-white text-sm font-medium">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: STATS BAR */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            {stats.map((s, i) => (
              <motion.div key={i} className="text-center pt-8 md:pt-0 first:pt-0" variants={fadeUp}>
                <motion.div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                  {s.value}
                </motion.div>
                <div className="text-gray-400 font-medium tracking-wide">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative">
        <div className="text-center mb-20">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </motion.h2>
          <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-1 bg-primary mx-auto rounded-full"></motion.div>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-0"></div>

          {steps.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-full bg-[#0A0D1F] border-2 border-white/10 flex items-center justify-center mb-6 shadow-2xl group-hover:border-primary/50 group-hover:shadow-[0_0_40px_rgba(20,241,149,0.2)] transition-all duration-500 relative">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/5 to-transparent"></div>
                <s.icon className="text-5xl text-gray-300 group-hover:text-primary transition-colors duration-500" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-[#0A0D1F] font-bold flex items-center justify-center border-4 border-[#0A0D1F]">{i + 1}</div>
              </div>
              <h3 className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors px-4 leading-relaxed">{s.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 4: FEATURES GRID */}
      <section className="bg-white/[0.02] py-32 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-secondary/10 blur-[150px] pointer-events-none rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold mb-4">
              Infrastructure for Trust
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-xl text-gray-400">Everything you need to own your digital footprint.</motion.p>
          </div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-[#0A0D1F] border border-white/10 p-8 rounded-3xl hover:border-primary/40 hover:bg-white/[0.02] transition-colors duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="text-3xl text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: CTA BANNER */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="bg-gradient-to-br from-primary to-accent rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_80px_rgba(20,241,149,0.2)]">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0D1F] mb-6">Start building your digital passport today</h2>
            <p className="text-[#0A0D1F]/80 text-xl font-medium mb-10 max-w-2xl mx-auto">
              Join thousands securing their identity and controlling their data on NexusLife.
            </p>
            <Link to="/register" className="inline-block px-10 py-5 bg-[#0A0D1F] text-white font-bold rounded-2xl hover:scale-105 hover:shadow-2xl transition-all text-lg">
              Get Started Free &rarr;
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0A0D1F]/10 blur-[60px] rounded-full"></div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0A0D1F] py-12 text-center text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-4">
           <span className="text-primary font-bold">Nexus</span><span className="text-white font-bold">Life</span>
        </div>
        <p>© 2026 NexusLife. Built for a better digital future.</p>
      </footer>
    </div>
  );
}
