import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import InsightCard from '../components/advisor/InsightCard.jsx';
import { chat as chatApi } from '../services/advisorService.js';
import { HiPaperAirplane } from 'react-icons/hi';

const mockInsights = [
  { id: 1, category: 'finance', text: 'Your income growth suggests you could increase SIP investments by 20%.', urgency: 'medium', action: 'Review investments' },
  { id: 2, category: 'health', text: 'Your health insurance expires in 30 days. Renew to maintain your health score.', urgency: 'high', action: 'Renew insurance' },
  { id: 3, category: 'jobs', text: 'Based on your 2 years at Infosys, consider updating your certifications for career growth.', urgency: 'low', action: 'Explore certifications' },
  { id: 4, category: 'finance', text: 'Your credit score has improved. You may qualify for better loan rates now.', urgency: 'medium', action: 'Check rates' },
];

const suggestions = ['How can I improve my trust score?', 'Analyze my financial health', 'What certifications should I pursue?'];

export default function AIAdvisor() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I\'m your NexusLife AI Advisor. I analyze your life data across education, employment, finance, and health to give you personalized insights. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await chatApi(msg, messages);
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.response }]);
    } catch {
      // Fallback when AI service is unavailable
      setMessages((prev) => [...prev, { role: 'ai', text: 'I\'m currently unable to connect to the AI service. Please try again later. In the meantime, check your insights panel for recent recommendations.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 flex flex-col lg:flex-row h-[calc(100vh-64px)]">
          {/* Insights Sidebar */}
          <div className="w-full lg:w-80 border-r border-gray-800 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Proactive Insights</h2>
            <div className="space-y-3">
              {mockInsights.map((ins) => <InsightCard key={ins.id} insight={ins} onClick={() => sendMessage(ins.text)} />)}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-dark rounded-br-sm' : 'bg-card border border-gray-800 text-gray-300 rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-6 pb-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="text-xs bg-gray-800 text-gray-300 px-3 py-2 rounded-full hover:bg-primary/10 hover:text-primary transition">{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your AI advisor..."
                  className="flex-1 bg-card border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                <button type="submit" disabled={loading || !input.trim()}
                  className="bg-primary text-dark p-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition disabled:opacity-50">
                  <HiPaperAirplane className="text-lg" />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
