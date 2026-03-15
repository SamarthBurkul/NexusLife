import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import { HiCheckCircle, HiShare, HiDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

const institutionTypes = ['Bank', 'Hospital', 'Employer', 'Government', 'Insurance'];
const purposes = ['Loan Application', 'Employment Verification', 'Insurance Claim', 'Medical Treatment', 'Government Service'];
const allFields = ['Full Name', 'Date of Birth', 'Email', 'Phone', 'Education', 'Employment', 'Income', 'Credit Score', 'Health Records', 'Insurance ID', 'Aadhaar Verified'];

export default function DataCards() {
  const [institutionType, setInstitutionType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);

  const toggleField = (f) => setSelectedFields((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const handleShare = () => toast.success('One-time link generated and copied!');
  const handleDownload = () => toast.success('PDF downloaded!');

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <h1 className="text-2xl font-bold text-white mb-6">Generate Data Card</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-card border border-gray-800 rounded-xl p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Institution Type</label>
                <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none">
                  <option value="">Select type</option>
                  {institutionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Purpose</label>
                <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none">
                  <option value="">Select purpose</option>
                  {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Fields to Include</label>
                <div className="grid grid-cols-2 gap-2">
                  {allFields.map((f) => (
                    <button key={f} onClick={() => toggleField(f)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition ${selectedFields.includes(f) ? 'bg-primary/10 border border-primary text-primary' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <motion.div className="bg-gradient-to-br from-gray-900 to-card border border-gray-700 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold"><span className="text-primary">Nexus</span><span className="text-white">Life</span></span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    <HiCheckCircle /> Verified
                  </div>
                </div>

                {institutionType && <p className="text-gray-400 text-sm mb-1">For: <span className="text-white">{institutionType}</span></p>}
                {purpose && <p className="text-gray-400 text-sm mb-4">Purpose: <span className="text-white">{purpose}</span></p>}

                {/* Fields */}
                {selectedFields.length > 0 ? (
                  <div className="space-y-2 mb-6">
                    {selectedFields.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <HiCheckCircle className="text-green-400" />
                        <span className="text-gray-300">{f}</span>
                        <span className="text-gray-500 ml-auto">••••••</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-8 text-center">Select fields to preview</p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-primary text-dark font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition text-sm">
                    <HiShare /> Share Link
                  </button>
                  <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 border border-gray-600 text-gray-300 py-2 rounded-lg hover:border-primary hover:text-primary transition text-sm">
                    <HiDownload /> PDF
                  </button>
                </div>

                {/* Background decoration */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
