import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiShieldCheck } from 'react-icons/hi';

const expiryOptions = [
  { label: '24 Hours', hours: 24 },
  { label: '7 Days', hours: 168 },
  { label: '30 Days', hours: 720 },
  { label: 'One-Time', hours: 1 },
];

export default function FieldSelector({ request, onConfirm, onClose }) {
  const [selectedFields, setSelectedFields] = useState([...request.fields]);
  const [expiry, setExpiry] = useState(24);

  const toggleField = (f) => setSelectedFields((prev) =>
    prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Select Fields to Share</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><HiX size={20} /></button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          <span className="text-accent font-medium">{request.institution}</span> wants access for: {request.purpose}
        </p>

        {/* Field selection */}
        <div className="space-y-2 mb-6">
          {request.fields.map((f) => (
            <label key={f} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition">
              <input type="checkbox" checked={selectedFields.includes(f)} onChange={() => toggleField(f)}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-gray-300 text-sm">{f.replace('_', ' ')}</span>
            </label>
          ))}
        </div>

        {/* Expiry */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Access Duration</p>
          <div className="grid grid-cols-2 gap-2">
            {expiryOptions.map((opt) => (
              <button key={opt.hours} onClick={() => setExpiry(opt.hours)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${expiry === opt.hours ? 'bg-accent/10 border border-accent text-accent' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onConfirm(selectedFields, expiry)} disabled={selectedFields.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-primary text-dark font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition disabled:opacity-50">
          <HiShieldCheck /> Confirm Share ({selectedFields.length} fields)
        </button>
      </motion.div>
    </div>
  );
}
