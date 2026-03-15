import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import TrustScoreWidget from '../components/trustscore/TrustScoreWidget.jsx';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();

  const details = [
    { label: 'Full Name', value: user?.fullName || 'John Doe' },
    { label: 'Email', value: user?.email || 'john@example.com' },
    { label: 'Phone', value: user?.phone || '+91 9876543210' },
    { label: 'Aadhaar', value: '•••• •••• 1234' },
    { label: 'Member Since', value: 'March 2025' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <h1 className="text-2xl font-bold text-white mb-8">Profile</h1>

          <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card border border-gray-800 rounded-xl p-8 mb-6">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl font-bold text-dark">
                  {(user?.fullName || 'U').charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.fullName || 'User'}</h2>
                  <p className="text-gray-400">{user?.email || 'user@example.com'}</p>
                </div>
              </div>

              <div className="space-y-4">
                {details.map((d) => (
                  <div key={d.label} className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-gray-400 text-sm">{d.label}</span>
                    <span className="text-white font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Trust Score</h3>
              <TrustScoreWidget score={78} />
            </div>

            <button onClick={logout}
              className="w-full border border-red-500/30 text-red-400 py-3 rounded-xl hover:bg-red-500/10 transition font-medium">
              Sign Out
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
