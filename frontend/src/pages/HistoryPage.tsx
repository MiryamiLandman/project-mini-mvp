import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/promptService';
import HistoryList from '../components/HistoryList/HistoryList';

const HistoryPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user && token) {
      getUserStats(user._id, token)
        .then(setStats)
        .catch(() => setError('שגיאה בטעינת היסטוריית הלמידה'))
        .finally(() => setIsLoading(false));
    }
  }, [user, token]);

  if (isLoading) return <div>טוען...</div>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>היסטוריית למידה</h1>
      <button onClick={() => navigate('/dashboard')}>חזרה לדשבורד</button>
      <button onClick={() => { logout(); navigate('/'); }}>התנתק</button>
      {stats && (
        <div>
          <p>סה"כ שיעורים: {stats.totalLessons}</p>
          <p>קטגוריה מועדפת: {stats.favoriteCategory}</p>
        </div>
      )}
      <HistoryList stats={stats} />
    </div>
  );
};

export default HistoryPage;
