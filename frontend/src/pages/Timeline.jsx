import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import LifeTimeline from '../components/timeline/LifeTimeline.jsx';
import { HiPlus, HiX } from 'react-icons/hi';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ type: 'education', title: '', institution: '', date: '' });

  const fetchEvents = async () => {
    try {
      const res = await api.get('/timeline/events');
      setEvents(res.data.data || []);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.institution || !newEvent.date) return;
    
    try {
      // Create new event
      await api.post('/timeline/events', {
        title: newEvent.title,
        institution: newEvent.institution,
        date: newEvent.date,
        type: newEvent.type
      });
      
      toast.success('Event added successfully!');
      
      // Reset form and UI
      setNewEvent({ type: 'education', title: '', institution: '', date: '' });
      setShowModal(false);
      
      // Refresh timeline directly from backend to inherit real db IDs and validation layers
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save event');
    }
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
