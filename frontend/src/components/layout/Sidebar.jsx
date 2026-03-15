import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { HiHome, HiClock, HiShieldCheck, HiChartBar, HiLightBulb, HiLink, HiDocumentText, HiUser } from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { to: '/timeline', icon: HiClock, label: 'Timeline' },
  { to: '/consent', icon: HiShieldCheck, label: 'Consent' },
  { to: '/datacards', icon: HiDocumentText, label: 'Data Cards' },
  { to: '/trustscore', icon: HiChartBar, label: 'Trust Score' },
  { to: '/advisor', icon: HiLightBulb, label: 'AI Advisor' },
  { to: '/connect', icon: HiLink, label: 'Sources' },
  { to: '/profile', icon: HiUser, label: 'Profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-[57px] bottom-0 w-64 bg-card/50 border-r border-gray-800 z-30">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <item.icon className="text-lg" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-bold text-dark">
            {(user?.fullName || 'U').charAt(0)}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.fullName || 'User'}</p>
            <p className="text-xs text-primary">Score: 78/100</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
