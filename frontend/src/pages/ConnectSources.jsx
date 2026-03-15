import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiCloudUpload, HiRefresh } from 'react-icons/hi';
import { FaIdCard, FaHospital, FaUniversity, FaLinkedin, FaFingerprint, FaFileInvoice } from 'react-icons/fa';

const sources = [
  { id: 'digilocker', name: 'DigiLocker', desc: 'Education certificates & government documents', icon: FaIdCard, color: 'text-primary', connected: true, lastSync: '2025-03-14T10:00:00Z' },
  { id: 'abha', name: 'ABHA', desc: 'Health records & medical history', icon: FaHospital, color: 'text-red-400', connected: true, lastSync: '2025-03-13T15:00:00Z' },
  { id: 'aa', name: 'Account Aggregator', desc: 'Financial accounts & transactions', icon: FaUniversity, color: 'text-accent', connected: false, lastSync: null },
  { id: 'linkedin', name: 'LinkedIn / HRMS', desc: 'Employment history & professional profile', icon: FaLinkedin, color: 'text-secondary', connected: true, lastSync: '2025-03-12T10:00:00Z' },
  { id: 'aadhaar', name: 'Aadhaar Auth', desc: 'Government identity authentication', icon: FaFingerprint, color: 'text-orange-400', connected: true, lastSync: '2025-03-10T10:00:00Z' },
  { id: 'pan', name: 'PAN Verification', desc: 'Tax identification & history', icon: FaFileInvoice, color: 'text-yellow-400', connected: false, lastSync: null },
];

export default function ConnectSources() {
  const [sourceList, setSourceList] = useState(sources);

  const handleConnect = (id) => {
    setSourceList((prev) => prev.map((s) => s.id === id ? { ...s, connected: true, lastSync: new Date().toISOString() } : s));
    toast.success('Source connected successfully!');
  };

  const handleSync = (id) => {
    setSourceList((prev) => prev.map((s) => s.id === id ? { ...s, lastSync: new Date().toISOString() } : s));
    toast.success('Sync completed!');
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Connect Data Sources</h1>
            <p className="text-gray-400 text-sm mt-1">Link your verified data sources to build your digital passport</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sourceList.map((s, i) => (
              <motion.div key={s.id} className="bg-card border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-800 ${s.color}`}><s.icon size={24} /></div>
                  {s.connected && (
                    <span className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
                      <HiCheckCircle /> Connected
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold mb-1">{s.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{s.desc}</p>

                {s.connected ? (
                  <div>
                    <p className="text-gray-500 text-xs mb-3">Last sync: {new Date(s.lastSync).toLocaleString()}</p>
                    <button onClick={() => handleSync(s.id)}
                      className="w-full flex items-center justify-center gap-2 border border-gray-700 text-gray-300 py-2 rounded-lg hover:border-primary hover:text-primary transition text-sm">
                      <HiRefresh /> Sync Now
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleConnect(s.id)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-dark font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition text-sm">
                    <HiCloudUpload /> Connect
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
