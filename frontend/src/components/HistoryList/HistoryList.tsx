import { useState } from 'react';
import './HistoryList.css';

const HistoryList = ({ stats, allPrompts }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<any | null>(null);

  if (!stats || stats.totalLessons === 0) {
    return <p className="empty-message">עדיין לא למדת כלום, בוא נתחיל!</p>;
  }

  const filteredPrompts = allPrompts?.filter((p: any) => 
    p.category_id?.name === selectedCategory
  );

  return (
    <div className="history-container">
      <h2 className="history-title">פירוט לפי קטגוריה:</h2>
      <div className="category-list-wrapper">
        {stats.categoryBreakdown.map((cat: any) => (
          <div key={cat.name} className="category-group">
            <div 
                  className={`history-item ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}>
                  <span className="category-name">{cat.name}</span>
                  <div className="lesson-count-badge">
                  <span className="count-number">{cat.count}</span>
                  <span className="count-text">שיעורים</span>
                  <span className="arrow-icon">{selectedCategory === cat.name ? '▲' : '▼'}</span>
              </div>
          </div>

            {selectedCategory === cat.name && (
              <div className="prompts-sub-list">
                {filteredPrompts?.map((p: any) => (
                  <div key={p._id} className="prompt-row">
                    <span className="prompt-text">{p.prompt}</span>
                    <button className="view-lesson-btn" onClick={() => setViewingPrompt(p)}>
                      ראה שיעור מה-AI
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {viewingPrompt && (
        <div className="modal-overlay" onClick={() => setViewingPrompt(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>השיעור שלך: {viewingPrompt.prompt}</h3>
              <button className="close-modal-btn" onClick={() => setViewingPrompt(null)}>סגור</button>
            </div>
            <div className="ai-response-content">
              {viewingPrompt.response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;