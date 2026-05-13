import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register, login } from '../services/userService';

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

      } else if (mode === 'login') {
        const result = await login(phone);
        authLogin(result.user, result.token);
        navigate('/dashboard');

      } else if (mode === 'admin') {
        const result = await login(phone);
        if (result.user.role !== 'admin') {
          setError('אין לך הרשאות מנהל');
          return;
        }
        authLogin(result.user, result.token);
        navigate('/admin');
      }
    } catch (err) {
      setError('אירעה שגיאה, אנא נסה שנית');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setMode('login')}>כניסה</button>
      <button onClick={() => setMode('register')}>רישום</button>
      <button onClick={() => setMode('admin')}>כניסת מנהל</button>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="שם מלא"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="text"
          placeholder="מספר טלפון"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'טוען...' : mode === 'register' ? 'הרשמה' : 'כניסה'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
