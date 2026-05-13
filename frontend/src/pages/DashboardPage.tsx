import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCategories, getSubCategories } from '../services/categoryService';
import { generateLesson } from '../services/promptService';
import CategorySelector from '../components/CategorySelector/CategorySelector';
import PromptForm from '../components/PromptForm/PromptForm';
import LessonResponse from '../components/LessonResponse/LessonResponse';

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [lesson, setLesson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      getCategories(token)
        .then(setCategories)
        .catch(() => setError('שגיאה בטעינת הקטגוריות'));
    }
  }, [token]);
  const handleCategoryChange = async (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategoryId('');
    setSubCategories([]);
    try {
      const subs = await getSubCategories(categoryName, token!);
      setSubCategories(subs);
    } catch {
      setError('שגיאה בטעינת תתי הקטגוריות');
    }
  };

  const handlePromptSubmit = async (userPrompt: string) => {
    if (!selectedSubCategoryId) {
      setError('יש לבחור תת-קטגוריה');
      return;
    }
    setIsLoading(true);
    setError('');
    setLesson('');
    try {
      const result = await generateLesson(selectedSubCategoryId, userPrompt, token!);
      setLesson(result.data.response);
    } catch {
      setError('שגיאה ביצירת השיעור');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>שלום {user?.name}!</h1>
        <button onClick={() => { logout(); navigate('/'); }}>התנתק</button>
      </div>
      <button onClick={() => navigate('/history')}>היסטוריית למידה</button>
      <CategorySelector
        categories={categories}
        subCategories={subCategories}
        selectedCategory={selectedCategory}
        selectedSubCategoryId={selectedSubCategoryId}
        onCategoryChange={handleCategoryChange}
        onSubCategoryChange={setSelectedSubCategoryId}
      />
      {selectedSubCategoryId && (
        <PromptForm onSubmit={handlePromptSubmit} isLoading={isLoading} />
      )}
      {error && <p>{error}</p>}
      {lesson && <LessonResponse lesson={lesson} />}
    </div>
  );
};

export default DashboardPage;
