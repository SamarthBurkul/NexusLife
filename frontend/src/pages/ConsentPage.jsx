import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import ConsentCard from '../components/consent/ConsentCard.jsx';
import FieldSelector from '../components/consent/FieldSelector.jsx';
import { approveRequest, denyRequest } from '../services/consentService.js';
import toast from 'react-hot-toast';

const mockRequests = [
  { id: 1, institution: 'State Bank of India', fields: ['full_name', 'income', 'credit_score', 'employment_status'], purpose: 'Loan Application', expiry: '48 hours', createdAt: '2025-03-14T10:00:00Z', status: 'pending' },
  { id: 2, institution: 'Apollo Hospital', fields: ['full_name', 'blood_group', 'allergies', 'insurance_id'], purpose: 'Treatment Records', expiry: '24 hours', createdAt: '2025-03-13T14:30:00Z', status: 'pending' },
  { id: 3, institution: 'Infosys HR', fields: ['full_name', 'education', 'certifications'], purpose: 'Background Verification', expiry: '7 days', createdAt: '2025-03-12T09:00:00Z', status: 'pending' },
];

const mockHistory = [
  { id: 101, institution: 'HDFC Bank', purpose: 'Credit Card Application', status: 'approved', decidedAt: '2025-03-10T11:00:00Z', fields: ['income', 'employment_status'] },
  { id: 102, institution: 'LIC', purpose: 'Insurance Claim', status: 'denied', decidedAt: '2025-03-08T16:00:00Z', fields: ['health_records'] },
  { id: 103, institution: 'TCS', purpose: 'Employment Verification', status: 'approved', decidedAt: '2025-03-05T10:00:00Z', fields: ['education', 'certifications'] },
];

export default function ConsentPage() {
  const [tab, setTab] = useState('pending');
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApprove = async (approvedFields, expiryHours) => {
    try {
      await approveRequest(selectedRequest.id, approvedFields, expiryHours);
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      setSelectedRequest(null);
      toast.success('Access granted');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleDeny = async (id) => {
    try {
      await denyRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success('Request denied');
    } catch {
      toast.error('Failed to deny');
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <h1 className="text-2xl font-bold text-white mb-6">Consent Manager</h1>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 mb-8 w-fit">
            {['pending', 'history'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-primary text-dark' : 'text-gray-400 hover:text-white'}`}>
                {t === 'pending' ? `Pending (${requests.length})` : 'History'}
              </button>
            ))}
          </div>

          {tab === 'pending' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {requests.map((r) => (
                <ConsentCard key={r.id} request={r}
                  onApprove={() => setSelectedRequest(r)}
                  onDeny={() => handleDeny(r.id)} />
              ))}
              {requests.length === 0 && <p className="text-gray-500 col-span-2 text-center py-12">No pending requests</p>}
            </div>
          ) : (
            <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Institution</th>
                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Purpose</th>
                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Decision</th>
                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistory.map((h) => (
                    <tr key={h.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-white">{h.institution}</td>
                      <td className="px-6 py-4 text-gray-400">{h.purpose}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${h.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{h.status}</span></td>
                      <td className="px-6 py-4 text-gray-400">{new Date(h.decidedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedRequest && (
            <FieldSelector request={selectedRequest}
              onConfirm={handleApprove}
              onClose={() => setSelectedRequest(null)} />
          )}
        </main>
      </div>
    </div>
  );
}
