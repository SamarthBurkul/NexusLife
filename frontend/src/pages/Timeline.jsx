import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import LifeTimeline from '../components/timeline/LifeTimeline.jsx';
import { HiPlus, HiX } from 'react-icons/hi';

const mockEvents = [
  { id: 1, type: 'education', title: 'B.Tech Computer Science', institution: 'MIT Pune', date: '2020-07-01', verified: true },
  { id: 2, type: 'employment', title: 'Software Engineer at TCS', institution: 'TCS', date: '2021-01-15', verified: true },
  { id: 3, type: 'health', title: 'Annual Health Checkup', institution: 'Apollo Hospital', date: '2022-03-10', verified: true },
  { id: 4, type: 'finance', title: 'Home Loan Approved', institution: 'SBI', date: '2022-06-20', verified: true },
  { id: 5, type: 'employment', title: 'Senior Engineer at Infosys', institution: 'Infosys', date: '2023-04-01', verified: true },
  { id: 6, type: 'education', title: 'AWS Cloud Certification', institution: 'Amazon', date: '2023-09-15', verified: false },
];

export default function Timeline() {
  const [events, setEvents] = useState(mockEvents);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ type: 'education', title: '', institution: '', date: '' });

  const addEvent = () => {
    if (!newEvent.title || !newEvent.institution || !newEvent.date) return;
    setEvents((prev) => [...prev, { ...newEvent, id: Date.now(), verified: false }]);
    setNewEvent({ type: 'education', title: '', institution: '', date: '' });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Life Journey Timeline</h1>
              <p className="text-gray-400 text-sm mt-1">Your verified milestones across all domains</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary text-dark font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition">
              <HiPlus /> Add Event
            </button>
          </div>

          <LifeTimeline events={events.sort((a, b) => new Date(b.date) - new Date(a.date))} />

          {/* Add Event Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-gray-800 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Add Life Event</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><HiX size={20} /></button>
                </div>
                <div className="space-y-4">
                  <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none">
                    <option value="education">Education</option>
                    <option value="employment">Employment</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                  </select>
                  <input placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                  <input placeholder="Institution" value={newEvent.institution} onChange={(e) => setNewEvent({ ...newEvent, institution: e.target.value })}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                  <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none" />
                  <button onClick={addEvent} className="w-full bg-primary text-dark font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition">Add Event</button>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
