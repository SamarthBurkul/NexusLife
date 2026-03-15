import { motion } from 'framer-motion';
import { HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';

export default function ConsentCard({ request, onApprove, onDeny }) {
  return (
    <motion.div className="bg-card border border-gray-800 rounded-xl p-6 hover:border-accent/30 transition"
      whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent font-bold text-sm">
            {request.institution.charAt(0)}
          </div>
          <div>
            <h3 className="text-white font-semibold">{request.institution}</h3>
            <p className="text-gray-400 text-xs">{request.purpose}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <HiClock /> {request.expiry}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-xs mb-2">Requested fields:</p>
        <div className="flex flex-wrap gap-2">
          {request.fields.map((f) => (
            <span key={f} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">{f.replace('_', ' ')}</span>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 py-2 rounded-lg hover:bg-green-500/20 transition text-sm font-medium">
          <HiCheckCircle /> Approve
        </button>
        <button onClick={onDeny}
          className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 py-2 rounded-lg hover:bg-red-500/20 transition text-sm font-medium">
          <HiXCircle /> Deny
        </button>
      </div>

      <p className="text-gray-500 text-xs mt-3">
        Requested: {new Date(request.createdAt).toLocaleString()}
      </p>
    </motion.div>
  );
}
