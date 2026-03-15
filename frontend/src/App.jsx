import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Timeline from './pages/Timeline.jsx';
import ConsentPage from './pages/ConsentPage.jsx';
import DataCards from './pages/DataCards.jsx';
import TrustScore from './pages/TrustScore.jsx';
import AIAdvisor from './pages/AIAdvisor.jsx';
import ConnectSources from './pages/ConnectSources.jsx';
import Profile from './pages/Profile.jsx';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/timeline" element={<PrivateRoute><Timeline /></PrivateRoute>} />
      <Route path="/consent" element={<PrivateRoute><ConsentPage /></PrivateRoute>} />
      <Route path="/datacards" element={<PrivateRoute><DataCards /></PrivateRoute>} />
      <Route path="/trustscore" element={<PrivateRoute><TrustScore /></PrivateRoute>} />
      <Route path="/advisor" element={<PrivateRoute><AIAdvisor /></PrivateRoute>} />
      <Route path="/connect" element={<PrivateRoute><ConnectSources /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
