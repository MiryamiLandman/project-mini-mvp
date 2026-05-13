import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllPromptsAdmin } from '../../services/promptService';
import { getCategories, createCategoryAdmin, createSubCategoryAdmin } from '../../services/categoryService'; 
import AdminUserTable from '../../components/AdminUserTable/AdminUserTable';
import './AdminPage.css'; 

const AdminPage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [categories, setCategories] = useState<any[]>([]); 
  const [selectedCategoryName, setSelectedCategoryName] = useState(''); 
  const [subCatForExisting, setSubCatForExisting] = useState(''); 

  useEffect(() => {
    if (token) {
      Promise.all([
        getAllPromptsAdmin(token),
        getCategories(token)
      ])
        .then(([promptsData, categoriesData]) => {
          setPrompts(promptsData);
          setCategories(categoriesData);
        })
        .catch(() => setError('שגיאה בטעינת הנתונים'))
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const getGlobalStats = () => {
    if (prompts.length === 0) return { total: 0, favorite: 'טרם נלמד', breakdown: [] };
    const categoryCounts: Record<string, number> = {};
    prompts.forEach((p) => {
      const catName = p.category_id?.name || 'ללא קטגוריה';
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    });
    const breakdown = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return { total: prompts.length, favorite: breakdown.length > 0 ? breakdown[0].name : 'טרם נלמד', breakdown };
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim() || !newSubCategoryName.trim()) {
      alert('חובה להזין גם שם לקטגוריה וגם שם לתת-הקטגוריה הראשונה!');
      return;
    }
    try {
      if (!token) return;
      await createCategoryAdmin(newCategoryName, token);
      await createSubCategoryAdmin(newSubCategoryName, newCategoryName, token);
      alert('הקטגוריה ותת-הקטגוריה נוצרו בהצלחה!');
      setNewCategoryName('');
      setNewSubCategoryName('');
      const updatedCategories = await getCategories(token);
      setCategories(updatedCategories);
    } catch (err: any) {
      alert(err.response?.data?.message || 'שגיאה ביצירת הקטגוריה');
    }
  };

  const handleAddSubCategoryToExisting = async () => {
    if (!selectedCategoryName || !subCatForExisting.trim()) {
      alert('חובה לבחור קטגוריה קיימת ולהזין שם לתת-הקטגוריה!');
      return;
    }
    try {
      if (!token) return;
      await createSubCategoryAdmin(subCatForExisting, selectedCategoryName, token);
      alert('תת-הקטגוריה נוספה בהצלחה לקטגוריה הקיימת!');
      setSelectedCategoryName('');
      setSubCatForExisting('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'שגיאה בהוספת תת-הקטגוריה');
    }
  };

  if (isLoading) return <div className="loading-state">טוען...</div>;
  if (error) return <p className="error-message">{error}</p>;

  const stats = getGlobalStats();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>לוח בקרה - מנהל</h1>
        <div className="header-buttons">
          <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>התנתק</button>
        </div>
      </header>

      <section className="stats-overview card-container">
        <div className="stat-box">
          <span>סה"כ שיעורים:</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-box">
          <span>קטגוריה מועדפת:</span>
          <strong>{stats.favorite}</strong>
        </div>
      </section>

      
      <section className="table-section">
        <h2>כלל השיעורים במערכת</h2>
        <div className="table-wrapper card-container">
          <AdminUserTable prompts={prompts} />
        </div>
      </section>
           <section className="category-stats">
      <hr className="divider" />
      <hr className="divider" />
        <h2>פירוט לפי קטגוריה:</h2>
        <div className="stats-grid">
          {stats.breakdown.map((cat, index) => (
            <div key={index} className="stat-item card-container">
              <span className="cat-name"> {cat.name}</span>
              <span className="cat-count"> {cat.count} שיעורים</span>
            </div>
          ))}
        </div>
      </section>
      <hr className="divider" />
      <hr className="divider" />
       <section className="management-section">
        <h2>ניהול תוכן (קטגוריות)</h2>
        <div className="forms-container">
          <div className="admin-form-card card-container">
            <h3>יצירת קטגוריה חדשה</h3>
            <p className="form-hint">* חובה להוסיף תת-קטגוריה ראשונה</p>
            <input 
              type="text" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              placeholder="שם קטגוריה ראשית (לדוגמה: מדע)"
            />
            <input 
              type="text" 
              value={newSubCategoryName} 
              onChange={(e) => setNewSubCategoryName(e.target.value)} 
              placeholder="שם תת-קטגוריה (לדוגמה: פיזיקה)"
            />
            <button onClick={handleCreateNewCategory}>צור קטגוריה חדשה</button>
          </div>

          <div className="admin-form-card card-container">
            <h3>הוספת תת-קטגוריה לקטגוריה קיימת</h3>
            <select value={selectedCategoryName} onChange={(e) => setSelectedCategoryName(e.target.value)}>
              <option value="">-- בחר קטגוריה קיימת --</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              value={subCatForExisting} 
              onChange={(e) => setSubCatForExisting(e.target.value)} 
              placeholder="שם תת-קטגוריה חדשה"
            />
            <button onClick={handleAddSubCategoryToExisting}>הוסף לקטגוריה</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;