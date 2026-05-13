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

  if (isLoading) return <div className="loading-state">טוען...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
  <div className="page-container">
    <header className="page-header">
      <h1>היסטוריית למידה</h1>
      <div className="header-buttons">
        <button className="secondary-btn" onClick={() => navigate('/dashboard')}>חזרה לדשבורד</button>
        <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>התנתק</button>
      </div>
    </header>
    
    {stats && (
      <section className="stats-overview card-container">
        <div className="stat-box">
          <p>סה"כ שיעורים: <strong>{stats.totalLessons}</strong></p>
        </div>
        <div className="stat-box">
          <p>קטגוריה מועדפת: <strong>{stats.favoriteCategory}</strong></p>
        </div>
      </section>
    )}

    <div style={{ marginTop: '50px' }}></div>

    <section className="history-details-bottom">
      <HistoryList stats={stats} allPrompts={prompts} />
    </section>
  </div>
);
};

export default HistoryPage;