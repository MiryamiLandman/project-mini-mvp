export const mockUsers = {
  validUser: {
    _id: '507f1f77bcf86cd799439011',
    name: 'David Cohen',
    phone: '0501234567',
    role: 'user'
  },
  adminUser: {
    _id: '507f1f77bcf86cd799439012',
    name: 'Admin User',
    phone: '0509876543',
    role: 'admin'
  },
  newUser: {
    name: 'New User',
    phone: '0507654321'
  }
};

export const mockCategories = {
  javascript: {
    _id: '507f1f77bcf86cd799439021',
    name: 'JavaScript'
  },
  python: {
    _id: '507f1f77bcf86cd799439022',
    name: 'Python'
  },
  react: {
    _id: '507f1f77bcf86cd799439023',
    name: 'React'
  },
  newCategory: {
    name: 'TypeScript'
  }
};

export const mockSubCategories = {
  es6: {
    _id: '507f1f77bcf86cd799439031',
    name: 'ES6 Basics',
    category: '507f1f77bcf86cd799439021'
  },
  promises: {
    _id: '507f1f77bcf86cd799439032',
    name: 'Promises & Async/Await',
    category: '507f1f77bcf86cd799439021'
  },
  reactHooks: {
    _id: '507f1f77bcf86cd799439033',
    name: 'React Hooks',
    category: '507f1f77bcf86cd799439023'
  },
  newSubCategory: {
    name: 'Advanced ES6',
    categoryId: '507f1f77bcf86cd799439021'
  }
};

export const mockPrompts = {
  validPrompt: {
    _id: '507f1f77bcf86cd799439041',
    user_id: '507f1f77bcf86cd799439011',
    category_id: '507f1f77bcf86cd799439021',
    sub_category_id: '507f1f77bcf86cd799439031',
    prompt: 'What is an arrow function in JavaScript?',
    response: 'An arrow function is a concise syntax for writing functions in JavaScript, introduced in ES6...',
    created_at: new Date('2024-01-15')
  },
  anotherPrompt: {
    _id: '507f1f77bcf86cd799439042',
    user_id: '507f1f77bcf86cd799439011',
    category_id: '507f1f77bcf86cd799439021',
    sub_category_id: '507f1f77bcf86cd799439032',
    prompt: 'How do I use async/await?',
    response: 'Async/await is a syntax for handling asynchronous operations in JavaScript...',
    created_at: new Date('2024-01-16')
  },
  newPrompt: {
    userId: '507f1f77bcf86cd799439011',
    subCategoryId: '507f1f77bcf86cd799439031',
    prompt: 'Explain closures in JavaScript'
  }
};

export const mockUserStats = {
  withLessons: {
    totalLessons: 5,
    favoriteCategory: 'JavaScript',
    categoryBreakdown: [
      { name: 'JavaScript', count: 3 },
      { name: 'React', count: 2 }
    ]
  },
  noLessons: {
    totalLessons: 0,
    favoriteCategory: 'טרם נלמד',
    categoryBreakdown: []
  }
};

// OpenAI Mock Responses
export const mockOpenAIResponses = {
  lessonsResponse: {
    choices: [
      {
        message: {
          content: `שיעור מלא על נושא מסוים...
          
1. מבוא
2. הסברים מפורטים
3. דוגמאות
4. סיכום`
        }
      }
    ]
  },
  errorResponse: {
    error: {
      message: 'Rate limit exceeded',
      type: 'server_error'
    }
  }
};

export const mockLoginData = {
  validLogin: {
    phone: '0501234567',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    expiresIn: '7d'
  },
  invalidLogin: {
    phone: '9999999999'
  }
};

export const mockErrorMessages = {
  userNotFound: 'משתמש לא נמצא',
  categoryNotFound: 'קטגוריה לא נמצאה',
  subCategoryNotFound: 'תת-קטגוריה לא נמצאה',
  promptNotFound: 'שיעור לא נמצא',
  aiFailure: 'נכשלה יצירת השיעור',
  phoneAlreadyExists: 'מספר טלפון זה כבר קיים בシステם'
};
