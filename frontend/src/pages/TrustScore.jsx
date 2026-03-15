import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';

const score = 78;
const gaugeData = [{ name: 'score', value: score, fill: score > 70 ? '#00C9A7' : score > 50 ? '#FFB800' : '#ef4444' }];

const categories = [
  { name: 'Education', score: 22, max: 25, color: '#00C9A7', items: [{ label: 'Degree', val: 9 }, { label: 'Certifications', val: 8 }, { label: 'Institution', val: 5 }] },
  { name: 'Finance', score: 20, max: 25, color: '#FFB800', items: [{ label: 'Income', val: 8 }, { label: 'Savings', val: 7 }, { label: 'Credit', val: 5 }] },
  { name: 'Health', score: 18, max: 25, color: '#ef4444', items: [{ label: 'Insurance', val: 7 }, { label: 'Checkups', val: 6 }, { label: 'Records', val: 5 }] },
  { name: 'Employment', score: 18, max: 25, color: '#7C6EF5', items: [{ label: 'Stability', val: 7 }, { label: 'Seniority', val: 6 }, { label: 'Verified', val: 5 }] },
];

const history = [
  { month: 'Oct', score: 62 }, { month: 'Nov', score: 65 }, { month: 'Dec', score: 68 },
  { month: 'Jan', score: 71 }, { month: 'Feb', score: 74 }, { month: 'Mar', score: 78 },
];

export default function TrustScore() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <h1 className="text-2xl font-bold text-white mb-8">Trust Score</h1>

          {/* Gauge */}
          <motion.div className="bg-card border border-gray-800 rounded-xl p-8 mb-6 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="relative w-48 h-48">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="75%" outerRadius="100%" data={gaugeData} startAngle={225} endAngle={-45}>
                  <RadialBar background={{ fill: '#1f2937' }} dataKey="value" cornerRadius={10} max={100} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{score}</span>
                <span className="text-gray-400 text-sm">/ 100</span>
              </div>
            </div>
            <p className="text-primary font-medium mt-2">+4 points this month</p>
          </motion.div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {categories.map((c) => (
              <div key={c.name} className="bg-card border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{c.name}</h3>
                  <span className="text-sm font-bold" style={{ color: c.color }}>{c.score}/{c.max}</span>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={c.items}>
                    <Bar dataKey="val" fill={c.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          {/* History */}
          <div className="bg-card border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Score History (6 months)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} domain={[50, 100]} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#00C9A7" strokeWidth={2} dot={{ fill: '#00C9A7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Explanation */}
          <div className="bg-card border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What Affects Your Score?</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• <span className="text-primary">Education (25pts):</span> Degree level, institution rating, certifications</li>
              <li>• <span className="text-accent">Finance (25pts):</span> Income regularity, savings, credit history</li>
              <li>• <span className="text-red-400">Health (25pts):</span> Insurance status, regular checkups, health records</li>
              <li>• <span className="text-secondary">Employment (25pts):</span> Job stability, seniority, verification status</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
