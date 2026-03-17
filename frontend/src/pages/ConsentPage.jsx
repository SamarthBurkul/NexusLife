import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import ConsentCard from '../components/consent/ConsentCard.jsx';
import FieldSelector from '../components/consent/FieldSelector.jsx';
import { approveRequest, denyRequest, getRequests, getHistory } from '../services/consentService.js';
import toast from 'react-hot-toast';

export default function ConsentPage() {
  const [tab, setTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, histRes] = await Promise.all([
        getRequests(),
        getHistory()
      ]);
      setRequests(reqRes.data?.data || []);
      setHistory(histRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch consent data:', err);
      toast.error('Failed to load consent data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approvedFields, expiryHours) => {
    try {
      await approveRequest(selectedRequest.id, approvedFields, expiryHours);
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      setSelectedRequest(null);
      fetchData(); // Refresh history
      toast.success('Approved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to approve');
    }
  };

  const handleDeny = async (id) => {
    try {
      await denyRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      fetchData(); // Refresh history
      toast.success('Request denied');
    } catch (err) {
      console.error(err);
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
