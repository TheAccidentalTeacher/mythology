# 🧪 TESTING STRATEGY

**Comprehensive testing approach for Mythology Builder Platform**

---

## 🎯 TESTING PHILOSOPHY

**Goal:** Ship confidently with automated tests covering critical user flows, business logic, and edge cases.

**Principles:**
- **Test user behavior, not implementation details**
- **Prioritize critical paths** (auth, content creation, grading, moderation)
- **Fail fast** (tests should catch bugs before production)
- **Mock expensive services** (OpenAI, image generation) in tests
- **Keep tests fast** (<5 min for full suite)

---

## 📊 TESTING PYRAMID

```
        /\
       /  \    E2E Tests (5-10%)
      /    \   - Critical user journeys
     /------\  - Cross-browser
    /        \ Integration Tests (20-30%)
   /          \ - API routes + database
  /            \ - Real-time features
 /--------------\ Unit Tests (60-70%)
/                \ - Business logic
                   - Utility functions
                   - Validation
```

---

## 🔬 UNIT TESTING

**Framework:** Jest + React Testing Library

**What to Test:**
- Utility functions (points calculation, badge checking, moderation)
- React hooks (custom hooks without UI)
- Form validation logic
- Data transformations
- Business logic functions

### **Setup**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### **Example Unit Tests**

```typescript
// src/lib/gamification/__tests__/points.test.ts
import { calculateLevel, calculatePointsForAction } from '../points';

describe('Points System', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 points', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should return level 5 for 500 points', () => {
      expect(calculateLevel(500)).toBe(5);
    });

    it('should return level 10 for 2000 points', () => {
      expect(calculateLevel(2000)).toBe(10);
    });

    it('should handle large point values', () => {
      expect(calculateLevel(10000)).toBe(22);
    });
  });

  describe('calculatePointsForAction', () => {
    it('should award 50 points for character creation', () => {
      expect(calculatePointsForAction('character_created')).toBe(50);
    });

    it('should award 100 points for completing a story', () => {
      expect(calculatePointsForAction('story_completed')).toBe(100);
    });

    it('should award bonus for long stories (500+ words)', () => {
      expect(calculatePointsForAction('story_completed', { wordCount: 600 })).toBe(150);
    });

    it('should return 0 for unknown actions', () => {
      expect(calculatePointsForAction('invalid_action')).toBe(0);
    });
  });
});
```

```typescript
// src/lib/moderation/__tests__/contentFilter.test.ts
import { containsInappropriateContent } from '../contentFilter';

describe('Content Filtering', () => {
  it('should flag explicit language', () => {
    const result = containsInappropriateContent('This is a bad word');
    expect(result.flagged).toBe(true);
    expect(result.reason).toContain('inappropriate language');
  });

  it('should allow mythology-specific terms', () => {
    const result = containsInappropriateContent('The god of war killed the monster');
    expect(result.flagged).toBe(false);
  });

  it('should flag hate speech', () => {
    const result = containsInappropriateContent('racist content here');
    expect(result.flagged).toBe(true);
    expect(result.category).toBe('hate_speech');
  });

  it('should allow empty strings', () => {
    expect(containsInappropriateContent('').flagged).toBe(false);
  });
});
```

```typescript
// src/components/characters/__tests__/CharacterForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterForm from '../CharacterForm';

describe('CharacterForm', () => {
  it('should render all form fields', () => {
    render(<CharacterForm mythologyId="123" />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/archetype/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/domain/i)).toBeInTheDocument();
  });

  it('should show validation errors on submit with empty fields', async () => {
    render(<CharacterForm mythologyId="123" />);
    
    const submitButton = screen.getByRole('button', { name: /create character/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = jest.fn();
    render(<CharacterForm mythologyId="123" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Zeus');
    await userEvent.selectOptions(screen.getByLabelText(/archetype/i), 'god');
    
    const submitButton = screen.getByRole('button', { name: /create character/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Zeus',
          archetype: 'god',
        })
      );
    });
  });

  it('should disable submit during submission', async () => {
    const onSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<CharacterForm mythologyId="123" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Zeus');
    
    const submitButton = screen.getByRole('button', { name: /create character/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
```

### **Run Unit Tests**

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Generate coverage report
npm test CharacterForm     # Run specific test file
```

---

## 🔌 INTEGRATION TESTING

**Framework:** Jest + MSW (Mock Service Worker) + Supabase Test Client

**What to Test:**
- API routes (`/api/*`)
- Database queries (with test database)
- Authentication flows
- Real-time subscriptions
- File uploads

### **Setup**

```bash
npm install --save-dev msw @supabase/supabase-js
```

```typescript
// src/lib/testing/supabase-test.ts
import { createClient } from '@supabase/supabase-js';

export function createTestSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
    process.env.SUPABASE_TEST_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export async function cleanupTestData(userId: string) {
  const supabase = createTestSupabaseClient();
  
  // Clean up test user's data
  await supabase.from('mythologies').delete().eq('created_by', userId);
  await supabase.from('profiles').delete().eq('id', userId);
}
```

### **Example Integration Tests**

```typescript
// src/app/api/characters/__tests__/route.test.ts
import { POST } from '../route';
import { createTestSupabaseClient, cleanupTestData } from '@/lib/testing/supabase-test';

describe('POST /api/characters', () => {
  let testUserId: string;
  let testMythologyId: string;

  beforeAll(async () => {
    // Create test user and mythology
    const supabase = createTestSupabaseClient();
    
    const { data: user } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'testpass123',
    });
    testUserId = user.user!.id;

    const { data: mythology } = await supabase
      .from('mythologies')
      .insert({
        name: 'Test Mythology',
        created_by: testUserId,
      })
      .select()
      .single();
    testMythologyId = mythology!.id;
  });

  afterAll(async () => {
    await cleanupTestData(testUserId);
  });

  it('should create a character successfully', async () => {
    const request = new Request('http://localhost:3000/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mythology_id: testMythologyId,
        name: 'Zeus',
        archetype: 'god',
        domain: ['thunder', 'sky'],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.character.name).toBe('Zeus');
    expect(data.character.archetype).toBe('god');
  });

  it('should reject character without name', async () => {
    const request = new Request('http://localhost:3000/api/characters', {
      method: 'POST',
      body: JSON.stringify({
        mythology_id: testMythologyId,
        archetype: 'god',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should run content moderation', async () => {
    const request = new Request('http://localhost:3000/api/characters', {
      method: 'POST',
      body: JSON.stringify({
        mythology_id: testMythologyId,
        name: 'Evil Character',
        description: 'inappropriate content here',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('content moderation');
  });
});
```

---

## 🌐 END-TO-END (E2E) TESTING

**Framework:** Playwright

**What to Test:**
- Critical user journeys (student signup → create mythology → earn badge)
- Teacher workflows (create classroom → grade student work)
- Real-time features (collaborative editing, chat)
- Cross-browser compatibility (Chrome, Firefox, Safari)

### **Setup**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **Example E2E Tests**

```typescript
// e2e/student-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Student Journey', () => {
  test('should complete full mythology creation flow', async ({ page }) => {
    // 1. Sign up
    await page.goto('/signup');
    await page.fill('input[name="email"]', 'student@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.fill('input[name="join_code"]', 'ABC123');
    await page.click('button[type="submit"]');

    // 2. Navigate to dashboard
    await expect(page).toHaveURL('/student/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');

    // 3. Create mythology
    await page.click('text=Create Your Mythology');
    await page.fill('input[name="name"]', 'My Epic Mythology');
    await page.selectOption('select[name="mythology_type"]', 'fantasy');
    await page.fill('textarea[name="description"]', 'A world of magic and wonder');
    await page.click('button:has-text("Create")');

    await expect(page).toHaveURL(/\/mythologies\/[a-z0-9-]+$/);

    // 4. Create a character
    await page.click('text=Add Character');
    await page.fill('input[name="name"]', 'Zeus');
    await page.selectOption('select[name="archetype"]', 'god');
    await page.fill('textarea[name="domain"]', 'Thunder');
    await page.fill('textarea[name="powers"]', 'Lightning bolts');
    await page.click('button:has-text("Create Character")');

    // 5. Verify badge earned
    await page.click('text=Badges');
    await expect(page.locator('.badge-card:has-text("First Creation")')).toBeVisible();

    // 6. Check points awarded
    const pointsElement = page.locator('[data-testid="user-points"]');
    await expect(pointsElement).toContainText('50'); // +50 for first character
  });

  test('should allow collaborative editing', async ({ browser }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    // Student 1 creates story
    await page1.goto('/login');
    await page1.fill('input[name="email"]', 'student1@test.com');
    await page1.fill('input[name="password"]', 'pass123');
    await page1.click('button[type="submit"]');
    await page1.goto('/stories/new');
    await page1.fill('input[name="title"]', 'The Epic Battle');

    // Student 2 joins
    await page2.goto('/login');
    await page2.fill('input[name="email"]', 'student2@test.com');
    await page2.fill('input[name="password"]', 'pass123');
    await page2.click('button[type="submit"]');
    await page2.goto('/stories/new');

    // Student 1 types
    await page1.locator('.tiptap-editor').fill('Once upon a time');

    // Student 2 should see the text
    await expect(page2.locator('.tiptap-editor')).toContainText('Once upon a time');

    await context1.close();
    await context2.close();
  });
});
```

```typescript
// e2e/teacher-grading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Teacher Grading', () => {
  test('should grade student mythology', async ({ page }) => {
    // Teacher login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'teacher@test.com');
    await page.fill('input[name="password"]', 'teacherpass');
    await page.click('button[type="submit"]');

    // Navigate to grading queue
    await page.goto('/teacher/grading');
    
    // Find pending submission
    await page.click('.mythology-card:first-child');

    // Review content
    await expect(page.locator('.mythology-detail')).toBeVisible();

    // Provide feedback
    await page.fill('textarea[name="feedback"]', 'Great work! Very creative mythology.');
    await page.selectOption('select[name="grade"]', 'A');
    await page.click('button:has-text("Submit Grade")');

    // Verify success
    await expect(page.locator('.success-message')).toContainText('Grade submitted');
  });
});
```

### **Run E2E Tests**

```bash
npx playwright test                 # Run all E2E tests
npx playwright test --headed        # Run with browser visible
npx playwright test --project=chromium  # Run on specific browser
npx playwright show-report          # View test report
```

---

## 🎭 MOCKING STRATEGIES

### **Mock OpenAI API**

```typescript
// src/lib/testing/mocks/openai.ts
import { rest } from 'msw';

export const openaiHandlers = [
  // Mock moderation endpoint
  rest.post('https://api.openai.com/v1/moderations', (req, res, ctx) => {
    return res(
      ctx.json({
        results: [{
          flagged: false,
          categories: {
            hate: false,
            'hate/threatening': false,
            violence: false,
            'violence/graphic': false,
            sexual: false,
            'sexual/minors': false,
          },
        }],
      })
    );
  }),

  // Mock GPT-4 completion
  rest.post('https://api.openai.com/v1/chat/completions', (req, res, ctx) => {
    return res(
      ctx.json({
        choices: [{
          message: {
            content: 'This is a mock AI response for testing.',
          },
        }],
      })
    );
  }),

  // Mock DALL-E 3
  rest.post('https://api.openai.com/v1/images/generations', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [{
          url: 'https://example.com/mock-image.png',
        }],
      })
    );
  }),
];
```

```typescript
// jest.setup.js
import { setupServer } from 'msw/node';
import { openaiHandlers } from './src/lib/testing/mocks/openai';

export const server = setupServer(...openaiHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### **Mock Supabase Realtime**

```typescript
// src/lib/testing/mocks/supabase-realtime.ts
export class MockRealtimeChannel {
  private subscribers: Map<string, Function[]> = new Map();

  on(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
    return this;
  }

  subscribe() {
    return this;
  }

  // Simulate receiving a message
  simulateEvent(event: string, payload: any) {
    const callbacks = this.subscribers.get(event) || [];
    callbacks.forEach(cb => cb(payload));
  }

  unsubscribe() {}
}
```

---

## 📸 VISUAL REGRESSION TESTING

**Tool:** Percy or Chromatic (optional)

```bash
npm install --save-dev @percy/cli @percy/playwright
```

```typescript
// e2e/visual-regression.spec.ts
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('visual regression - character gallery', async ({ page }) => {
  await page.goto('/gallery');
  await percySnapshot(page, 'Character Gallery');
});

test('visual regression - mythology dashboard', async ({ page }) => {
  await page.goto('/student/dashboard');
  await percySnapshot(page, 'Student Dashboard');
});
```

---

## 🚀 PERFORMANCE TESTING

### **Lighthouse CI**

```bash
npm install --save-dev @lhci/cli
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/gallery'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

### **Load Testing (Artillery)**

```bash
npm install --save-dev artillery
```

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10 # 10 users per second
scenarios:
  - name: 'Browse gallery'
    flow:
      - get:
          url: '/gallery'
      - think: 2
      - get:
          url: '/gallery?page=2'
```

```bash
artillery run artillery-config.yml
```

---

## 📋 TEST DATA FIXTURES

```typescript
// src/lib/testing/fixtures/characters.ts
export const mockCharacter = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  mythology_id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Zeus',
  archetype: 'god',
  domain: ['thunder', 'sky', 'justice'],
  powers: ['Lightning bolts', 'Shape-shifting', 'Immortality'],
  appearance: 'Tall, bearded, powerful build',
  personality: 'Authoritative, but prone to anger',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

export const mockCreature = {
  id: '223e4567-e89b-12d3-a456-426614174000',
  mythology_id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Cerberus',
  creature_type: 'monster',
  danger_level: 'deadly',
  abilities: ['Three heads', 'Venomous bite', 'Guardian of underworld'],
};
```

---

## 🎯 TESTING CHECKLIST (Per Phase)

### **Phase 1: Foundation/MVP**
- [ ] User signup/login flow
- [ ] Student dashboard loads
- [ ] Teacher dashboard loads
- [ ] Create mythology (name, type, description)
- [ ] Create character (all required fields)
- [ ] Create creature (all required fields)
- [ ] Image upload to Supabase Storage
- [ ] Content moderation (OpenAI API)
- [ ] Teacher impersonation
- [ ] Content visibility controls

### **Phase 2: Advanced Content**
- [ ] Rich text story editor (TipTap)
- [ ] Map canvas (Konva.js draw/erase)
- [ ] Relationship graph (Cytoscape.js nodes/edges)
- [ ] AI battle generation
- [ ] Deity comparison create/edit

### **Phase 3: Gamification**
- [ ] Points awarded for actions
- [ ] Level calculation
- [ ] Badge unlocking
- [ ] Leaderboard ranking
- [ ] Theme switching
- [ ] Avatar customization

### **Phase 4: Collaboration**
- [ ] Real-time co-editing (Yjs)
- [ ] Chat messages send/receive
- [ ] Notifications display
- [ ] Version history restore
- [ ] Collaboration invites

### **Phase 5: AI Enhancements**
- [ ] Prompt enhancement (GPT-4)
- [ ] DALL-E 3 image generation
- [ ] Midjourney integration
- [ ] Style preset application

### **Phase 6: Presentations**
- [ ] Presentation builder
- [ ] TTS narration playback
- [ ] Audio recording
- [ ] PowerPoint export
- [ ] PDF export
- [ ] Shareable link generation

### **Phase 7: Polish**
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Mobile responsive (375px, 768px)
- [ ] Performance (Lighthouse >90)
- [ ] Security (no vulnerabilities)

---

## 🔄 CI/CD INTEGRATION

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📊 COVERAGE GOALS

| Category | Target |
|----------|--------|
| **Overall** | 70%+ |
| **Critical Paths** | 90%+ |
| **Utility Functions** | 80%+ |
| **UI Components** | 60%+ |

---

**Next Steps:**
1. Set up Jest + React Testing Library (Phase 0)
2. Write unit tests for gamification logic (Phase 3)
3. Set up Playwright (Phase 1)
4. Create E2E tests for critical flows (Phase 2+)
5. Integrate with CI/CD (Phase 7)

---

*Testing strategy complete* ✅
