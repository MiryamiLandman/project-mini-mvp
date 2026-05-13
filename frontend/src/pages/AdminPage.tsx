import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPromptsAdmin } from '../services/promptService';
import { getCategories, createCategoryAdmin, createSubCategoryAdmin } from '../services/categoryService'; 
import AdminUserTable from '../components/AdminUserTable/AdminUserTable';

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

    return {
      total: prompts.length,
      favorite: breakdown.length > 0 ? breakdown[0].name : 'טרם נלמד',
      breakdown
    };
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

  if (isLoading) return <div>טוען...</div>;
  if (error) return <p>{error}</p>;

  const stats = getGlobalStats();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* אזור כותרת */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>לוח בקרה - מנהל</h1>
        <div>
          <button onClick={() => navigate('/dashboard')} style={{ marginLeft: '10px', padding: '8px 16px' }}>חזרה לדשבורד</button>
          <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '8px 16px' }}>התנתק</button>
        </div>
      </div>

      <div style={{ marginBottom: '40px', fontSize: '18px' }}>
        <p>סה"כ שיעורים: <strong>{stats.total}</strong></p>
        <p>קטגוריה מועדפת: <strong>{stats.favorite}</strong></p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>פירוט לפי קטגוריה:</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stats.breakdown.map((cat, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #e9ecef',
                borderRadius: '5px'
              }}
            >
              <span>{cat.name}</span>
              <span>שיעורים {cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ margin: '40px 0' }} />

      <h2>ניהול תוכן (קטגוריות)</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
      
        <div style={{ padding: '15px', border: '1px solid #ccc', flex: 1, borderRadius: '5px' }}>
          <h3>יצירת קטגוריה חדשה</h3>
          <p style={{ fontSize: '12px', color: 'gray' }}>* חובה להוסיף תת-קטגוריה ראשונה</p>
          
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              placeholder="שם קטגוריה ראשית (לדוגמה: מדע)"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text" 
              value={newSubCategoryName} 
              onChange={(e) => setNewSubCategoryName(e.target.value)} 
              placeholder="שם תת-קטגוריה (לדוגמה: פיזיקה)"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <button onClick={handleCreateNewCategory} style={{ padding: '8px 16px' }}>צור קטגוריה חדשה</button>
        </div>

        <div style={{ padding: '15px', border: '1px solid #ccc', flex: 1, borderRadius: '5px' }}>
          <h3>הוספת תת-קטגוריה לקטגוריה קיימת</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <select 
              value={selectedCategoryName} 
              onChange={(e) => setSelectedCategoryName(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="">-- בחר קטגוריה קיימת --</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text" 
              value={subCatForExisting} 
              onChange={(e) => setSubCatForExisting(e.target.value)} 
              placeholder="שם תת-קטגוריה חדשה"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <button onClick={handleAddSubCategoryToExisting} style={{ padding: '8px 16px' }}>הוסף לקטגוריה</button>
        </div>
      </div>
      <hr style={{ margin: '40px 0' }} />
            <h2>כלל השיעורים במערכת</h2>
      <AdminUserTable prompts={prompts} />
    </div>
  );
};

export default AdminPage;