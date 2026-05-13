import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register, login } from '../../services/userService';
import './RegisterPage.css'; // ייבוא העיצוב החדש

type Mode = 'register' | 'login' | 'admin';

const RegisterPage = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        await register(name, phone);
        const result = await login(phone);
        authLogin(result.user, result.token);
        navigate('/dashboard');
      } else {
        const result = await login(phone);
        if (mode === 'admin' && result.user.role !== 'admin') {
          setError('אין לך הרשאות מנהל');
          return;
        }
        authLogin(result.user, result.token);
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      if (err.response?.status === 404 && mode !== 'register') {
        setError('משתמש לא רשום, אנא הירשם');
        setMode('register');
      } else {
        setError(err.response?.data?.message || 'אירעה שגיאה בתקשורת');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ברוכים הבאים</h1>
          <p>הפלטפורמה החכמה ללמידה עם AI</p>
        </div>

        <div className="mode-selector">
          <button 
            className={mode === 'login' ? 'active' : ''} 
            onClick={() => setMode('login')}
          >
            כניסה
          </button>
          <button 
            className={mode === 'register' ? 'active' : ''} 
            onClick={() => setMode('register')}
          >
            הרשמה
          </button>
          <button 
            className={mode === 'admin' ? 'active' : ''} 
            onClick={() => setMode('admin')}
          >
            מנהל
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="input-group">
              <label>שם מלא</label>
              <input
                type="text"
                placeholder="איך קוראים לך?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>מספר טלפון</label>
            <input
              type="text"
              placeholder="הכנס מספר טלפון"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'מתחבר...' : mode === 'register' ? 'יוצאים לדרך!' : 'כניסה למערכת'}
          </button>
        </form>
        
        <div className="auth-footer">
          {mode === 'login' ? (
            <p>עוד לא רשומים? <span onClick={() => setMode('register')}>צרו חשבון חדש</span></p>
          ) : (
            <p>כבר יש לכם חשבון? <span onClick={() => setMode('login')}>התחברו כאן</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;