import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserStats, getMyPrompts } from '../services/promptService'; 
import HistoryList from '../components/HistoryList/HistoryList';

const HistoryPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [prompts, setPrompts] = useState<any[]>([]); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      Promise.all([
        getUserStats(user._id, token),
        getMyPrompts(token)
      ])
        .then(([statsData, promptsData]) => {
          setStats(statsData);
          setPrompts(promptsData); 
        })
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
        <div style={{ marginBottom: '20px' }}>
          <p>סה"כ שיעורים: <strong>{stats.totalLessons}</strong></p>
          <p>קטגוריה מועדפת: <strong>{stats.favoriteCategory}</strong></p>
        </div>
      )}

      <HistoryList stats={stats} allPrompts={prompts} />
    </div>
  );
};

export default HistoryPage;