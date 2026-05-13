import { useState } from 'react';
import './HistoryList.css';

const HistoryList = ({ stats, allPrompts }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<any | null>(null);

  if (!stats || stats.totalLessons === 0) {
    return <p>עדיין לא למדת כלום, בוא נתחיל!</p>;
  }

  // סינון השיעורים של הקטגוריה שנבחרה
  const filteredPrompts = allPrompts?.filter((p: any) => 
    p.category_id?.name === selectedCategory
  );

  return (
    <div className="history-container">
      <h2>פירוט לפי קטגוריה:</h2>
      {stats.categoryBreakdown.map((cat: any) => (
        <div key={cat.name} className="category-group">
          <div 
            className="history-item" 
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>{cat.name}</span>
            <span>{cat.count} שיעורים {selectedCategory === cat.name ? '▲' : '▼'}</span>
          </div>

          {/* הצגת השיעורים של אותה קטגוריה */}
          {selectedCategory === cat.name && (
            <div className="prompts-sub-list" style={{ padding: '10px', background: '#f9f9f9' }}>
              {filteredPrompts?.map((p: any) => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{p.prompt}</span>
                  <button onClick={() => setViewingPrompt(p)}>ראה שיעור מה-AI</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* חלונית (Modal) להצגת התשובה */}
      {viewingPrompt && (
        <div className="modal-overlay" onClick={() => setViewingPrompt(null)} style={modalStyles.overlay}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={modalStyles.content}>
            <button onClick={() => setViewingPrompt(null)}>סגור</button>
            <h3>השיעור שלך: {viewingPrompt.prompt}</h3>
            <div style={{ whiteSpace: 'pre-wrap', direction: 'rtl', marginTop: '20px' }}>
              {viewingPrompt.response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// עיצוב בסיסי למודל (אפשר להעביר ל-CSS)
const modalStyles: any = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }
};

export default HistoryList;