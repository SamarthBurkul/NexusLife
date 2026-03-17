import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { register as registerApi, verifyOTP } from '../services/authService.js';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiPhone, HiLockClosed, HiIdentification } from 'react-icons/hi';

const domains = ['Education', 'Health', 'Finance', 'Employment'];

// InputField component moved outside to prevent re-renders losing focus
const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
    <input {...props} className="w-full bg-dark border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:outline-none transition" />
  </div>
);

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', aadhaar: '', otp: '', domains: [] });
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const toggleDomain = (d) => setForm((prev) => ({
    ...prev, domains: prev.domains.includes(d) ? prev.domains.filter((x) => x !== d) : [...prev.domains, d],
  }));

  const handleOTP = async () => {
    try {
      await verifyOTP(form.phone, form.otp);
      toast.success('OTP verified!');
      setStep(3);
    } catch {
      toast.error('Invalid OTP');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await registerApi({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, aadhaar: form.aadhaar, domains: form.domains });
      login(res.data.token);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = { enter: { x: 80, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -80, opacity: 0 } };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold"><span className="text-primary">Nexus</span><span className="text-white">Life</span></h1>
          <p className="text-gray-400 mt-2">Create your digital passport</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary text-dark' : 'bg-gray-800 text-gray-500'}`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card border border-gray-800 rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Personal Details</h2>
                <InputField icon={HiUser} placeholder="Full Name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                <InputField icon={HiMail} type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                <InputField icon={HiPhone} placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                <InputField icon={HiLockClosed} type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} />
                <button onClick={() => setStep(2)} className="w-full bg-primary text-dark font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition">Next</button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Identity Verification</h2>
                <InputField icon={HiIdentification} placeholder="Aadhaar Number" value={form.aadhaar} onChange={(e) => update('aadhaar', e.target.value)} />
                <InputField icon={HiPhone} placeholder="Enter 6-digit OTP" value={form.otp} onChange={(e) => update('otp', e.target.value)} maxLength={6} />
                <p className="text-xs text-gray-500">Mock: Enter any 6-digit code</p>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-lg hover:border-primary transition">Back</button>
                  <button onClick={handleOTP} className="flex-1 bg-primary text-dark font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition">Verify & Next</button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Connect Domains</h2>
                <p className="text-gray-400 text-sm mb-4">Select which domains you want to connect:</p>
                <div className="grid grid-cols-2 gap-3">
                  {domains.map((d) => (
                    <button key={d} onClick={() => toggleDomain(d)} className={`p-4 rounded-lg border text-sm font-medium transition ${form.domains.includes(d) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}>{d}</button>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep(2)} className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-lg hover:border-primary transition">Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-primary text-dark font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
