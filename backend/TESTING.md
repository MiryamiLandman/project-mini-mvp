# Backend Testing Guide

---

## Backend Testing Overview

### Installation

To set up the testing environment, install all necessary dependencies:

```bash
npm install

```

### Running Tests

* **Run all tests:**
```bash
npm test

```


* **Run tests in watch mode:**

```bash
    npm run test:watch
    ```
*   **Run tests with coverage report:**
    
```bash
    npm run test:coverage
    ```
*   **Run a specific test file:**
    
```bash
    npm test -- UserService.test.ts
    ```

---


```

backend/
├── tests/
│   ├── fixtures/           
│   │   └── testData.ts
│   ├── integration/      
│   │   ├── Category.integration.test.ts
│   │   ├── Prompt.integration.test.ts
│   │   ├── SubCategory.integration.test.ts
│   │   ├── testApp.ts
│   │   └── User.integration.test.ts
│   ├── unit/              
│   │   ├── CategoryService.test.ts
│   │   ├── PrompyService.test.ts
│   │   ├── SubCategoryService.test.ts
│   │   └── UserService.test.ts
│   └── setup.ts           
├── jest.config.js
└── package.json

```

---

## What is Being Tested

### Unit Tests
*   **UserService**: Logic for user creation, authentication, and retrieval.
*   **CategoryService & SubCategoryService**: Methods for fetching and managing content hierarchies.
*   **PrompyService**: Core logic for AI-driven lesson generation.

### Integration Tests
*   **API Routes**: Testing the full request-response cycle (e.g., `Category.integration.test.ts`, `User.integration.test.ts`) using the `testApp.ts` utility to ensure controllers and routes work together correctly.

---

## Test Data (Fixtures)

Test data is centralized in `backend/tests/fixtures/testData.ts`. This ensures that all tests use the same mock objects.

### Usage Example
```typescript
import { mockUsers, mockCategories } from '../fixtures/testData';

describe('Integration Example', () => {
  it('should use fixture data', () => {
    const user = mockUsers.validUser;
    // Perform test with mock data
  });
});

```

---

## Writing New Service Tests

When adding a new service test, follow this template to mock dependencies properly:

```typescript
import { someFunction } from '../../services/SomeService';
import { SomeModel } from '../../models/SomeModel';

jest.mock('../../models/SomeModel');

describe('SomeService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Resets mock state between tests
  });

  it('should return mock data successfully', async () => {
    const mockData = { id: '1', name: 'Test' };
    const mockExec = jest.fn().mockResolvedValue(mockData);
    (SomeModel.find as jest.Mock).mockReturnValue({ exec: mockExec });

    const result = await someFunction();

    expect(result).toEqual(mockData);
  });
});

```

---

## Debugging and Coverage

* **Coverage Reports**: After running `npm run test:coverage`, detailed HTML reports are generated in `backend/coverage/lcov-report/index.html`.
* **Setup**: Global configurations, such as database mock connections or environment variables, should be managed in `backend/tests/setup.ts`.
* **Timeouts**: For tests involving external API simulations that might take longer, you can increase the timeout:

```typescript
    it('should complete a long task', async () => {
      
    }, 15000); 
    ```

---

## Next Steps
1.  Maintain **integration tests** for every new API endpoint added to the `routes/` directory.
2.  Ensure that **fixtures** are updated when model schemas change.
3.  Target **80% code coverage** or higher for all backend services.

```