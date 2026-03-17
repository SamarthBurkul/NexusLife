import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import TrustScoreWidget from '../components/trustscore/TrustScoreWidget.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { HiShieldCheck, HiDocumentText, HiLink } from 'react-icons/hi';
import api from '../services/api.js';

const mockTrend = [
  { month: 'Oct', score: 62 }, { month: 'Nov', score: 65 }, { month: 'Dec', score: 68 },
  { month: 'Jan', score: 71 }, { month: 'Feb', score: 74 }, { month: 'Mar', score: 78 },
];

const mockActivity = [
  { id: 1, text: 'SBI requested your financial data', time: '2 hours ago', type: 'consent' },
  { id: 2, text: 'Education score updated to 22/25', time: '1 day ago', type: 'score' },
  { id: 3, text: 'DigiLocker sync completed', time: '2 days ago', type: 'sync' },
  { id: 4, text: 'AI Insight: Consider health insurance renewal', time: '3 days ago', type: 'insight' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [trustScore, setTrustScore] = useState(0);
  const [activeConsents, setActiveConsents] = useState(0);
  const [connectedSources, setConnectedSources] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [scoreRes, consentRes, sourcesRes] = await Promise.all([
          api.get('/trustscore'),
          api.get('/consent/requests'),
          api.get('/sources')
        ]);
        
        setTrustScore(scoreRes.data?.data?.score || 0);
        setActiveConsents(consentRes.data?.data?.length || 0);
        setConnectedSources(sourcesRes.data?.data?.length || 0);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      }
    };
    fetchDashboardStats();
  }, []);

  const quickStats = [
    { icon: HiShieldCheck, label: 'Trust Score', value: `${trustScore}/100`, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: HiDocumentText, label: 'Active Consents', value: activeConsents, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: HiLink, label: 'Connected Sources', value: connectedSources, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-white mb-6">Welcome back, {user?.fullName || 'User'} 👋</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {quickStats.map((s, i) => (
                <div key={i} className="bg-card border border-gray-800 rounded-xl p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${s.bg}`}><s.icon className={`text-2xl ${s.color}`} /></div>
                  <div>
                    <p className="text-gray-400 text-sm">{s.label}</p>
                    <p className="text-xl font-bold text-white">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Profile Card + Trust Widget */}
              <div className="bg-card border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Your Profile</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-dark">
                    {(user?.fullName || 'U').charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user?.fullName || 'User'}</p>
                    <p className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <TrustScoreWidget score={trustScore} />
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {mockActivity.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition">
                      <div className={`w-2 h-2 rounded-full mt-2 ${a.type === 'consent' ? 'bg-accent' : a.type === 'score' ? 'bg-primary' : a.type === 'sync' ? 'bg-secondary' : 'bg-blue-400'}`} />
                      <div>
                        <p className="text-gray-300 text-sm">{a.text}</p>
                        <p className="text-gray-500 text-xs">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Score Trend */}
            <div className="bg-card border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Trust Score Trend</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockTrend}>
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[50, 100]} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                  <Line type="monotone" dataKey="score" stroke="#00C9A7" strokeWidth={2} dot={{ fill: '#00C9A7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
