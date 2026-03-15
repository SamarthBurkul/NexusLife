import { createContext, useContext, useState, useCallback } from 'react';
import { getScore, getBreakdown } from '../services/trustScoreService.js';
import { getRequests } from '../services/consentService.js';
import { getInsights } from '../services/advisorService.js';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [trustScore, setTrustScore] = useState(null);
  const [trustBreakdown, setTrustBreakdown] = useState(null);
  const [consentRequests, setConsentRequests] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [scoreRes, breakdownRes, consentsRes] = await Promise.allSettled([
        getScore(),
        getBreakdown(),
        getRequests(),
      ]);
      if (scoreRes.status === 'fulfilled') setTrustScore(scoreRes.value.data);
      if (breakdownRes.status === 'fulfilled') setTrustBreakdown(breakdownRes.value.data);
      if (consentsRes.status === 'fulfilled') setConsentRequests(consentsRes.value.data);

      // AI insights — graceful fallback if service is down
      try {
        const insightsRes = await getInsights();
        setInsights(insightsRes.data);
      } catch {
        setInsights([]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{
      profile, setProfile,
      trustScore, trustBreakdown,
      consentRequests, setConsentRequests,
      insights,
      loading,
      fetchAll,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
