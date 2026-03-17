import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { HiBell, HiChevronDown, HiLogout, HiUser, HiCog } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/timeline', label: 'Timeline' },
    { to: '/consent', label: 'Consent' },
    { to: '/trustscore', label: 'Trust Score' },
    { to: '/advisor', label: 'AI Advisor' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 print:hidden">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-xl font-bold">
            <span className="text-primary">Nexus</span><span className="text-white">Life</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${location.pathname === l.to ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-gray-400 hover:text-white transition">
            <HiBell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] font-bold text-dark rounded-full flex items-center justify-center">3</span>
          </button>

          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xs font-bold text-dark">
                {(user?.fullName || 'U').charAt(0)}
              </div>
              <HiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-gray-800 rounded-xl shadow-xl py-2 z-50">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"><HiUser /> Profile</Link>
                <Link to="/connect" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"><HiCog /> Settings</Link>
                <hr className="border-gray-800 my-1" />
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 w-full text-left"><HiLogout /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
