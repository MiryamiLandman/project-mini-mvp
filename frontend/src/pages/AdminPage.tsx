import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPromptsAdmin } from '../services/promptService';
import AdminUserTable from '../components/AdminUserTable/AdminUserTable';

const AdminPage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (token) {
      getAllPromptsAdmin(token)
        .then(setPrompts)
        .catch(() => setError('שגיאה בטעינת הנתונים'))
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  if (isLoading) return <div>טוען...</div>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>לוח בקרה - מנהל</h1>
      <button onClick={() => { logout(); navigate('/'); }}>התנתק</button>
      <p>סה"כ הנחיות: {prompts.length}</p>
      <AdminUserTable prompts={prompts} />
    </div>
  );
};

export default AdminPage;
