# AI-SMART Frontend Guide

## Overview

The frontend is built with **React 18**, **Vite**, and **Zustand** for state management. It follows a minimalist, clean design philosophy focused on user efficiency and quick workflows.

## Architecture

### Directory Structure

```
client/
├── src/
│   ├── pages/              # Full-page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Dashboard.jsx
│   │   └── Settings.jsx
│   ├── components/         # Reusable components
│   │   └── PostCard.jsx
│   ├── stores/             # Zustand state management
│   │   ├── authStore.js
│   │   └── postStore.js
│   ├── styles/             # Global styles
│   │   └── index.css
│   ├── App.jsx             # Root component with routing
│   └── main.jsx            # Entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

## Pages Overview

### 1. Login Page (`pages/Login.jsx`)

**Purpose:** User authentication

**Features:**
- Email and password input
- Form validation
- Error handling
- Link to register page
- Loading state with spinner

**User Flow:**
1. User enters email and password
2. Submits form
3. Backend validates credentials
4. Token stored in localStorage
5. Redirects to dashboard

### 2. Register Page (`pages/Register.jsx`)

**Purpose:** New user account creation

**Features:**
- Name, email, password fields
- Password confirmation
- Password strength validation (min 6 chars)
- Error handling
- Link to login page

**User Flow:**
1. User fills in registration form
2. Validates all fields are filled
3. Confirms passwords match
4. Submits to backend
5. Account created
6. Redirects to onboarding

### 3. Onboarding Page (`pages/Onboarding.jsx`)

**Purpose:** Collect user preferences for AI learning

**Features:**
- 4-step wizard with progress bar
- Step 1: Niche selection (6 options)
- Step 2: Target audience description
- Step 3: Posting style selection (5 options)
- Step 4: Review summary
- Back/Next navigation
- Form validation at each step

**Niche Options:**
- Technology
- Business
- Marketing
- Lifestyle
- Finance
- Education

**Posting Styles:**
- Professional
- Casual
- Humorous
- Inspirational
- Educational

**User Flow:**
1. User selects niche
2. Describes target audience
3. Chooses posting style
4. Reviews selections
5. Completes onboarding
6. Redirects to settings

### 4. Settings Page (`pages/Settings.jsx`)

**Purpose:** API credential management and preferences

**Features:**
- Tabbed interface (Credentials, Preferences)
- OpenAI API key input
- Facebook credential fields (Page ID, Access Token)
- LinkedIn credential fields (Profile ID, Access Token)
- Connection status indicators
- External links to get credentials
- Preference settings (future)

**Tabs:**

**Credentials Tab:**
- OpenAI API configuration
- Facebook connection
- LinkedIn connection
- Save/Connect buttons

**Preferences Tab:**
- Posting preferences (coming soon)
- Automation settings
- Notification preferences

**User Flow:**
1. User enters API credentials
2. Clicks "Save" or "Connect"
3. Backend validates and stores securely
4. Success message displayed
5. Connection status updated

### 5. Dashboard Page (`pages/Dashboard.jsx`)

**Purpose:** Main interface for post review and approval

**Features:**
- Header with user greeting
- Generate Post button
- Post filters (Draft, Posted, All)
- Post grid layout
- Empty state messaging
- Logout button
- Settings link

**Filters:**
- **Draft** - Posts awaiting approval
- **Posted** - Published posts
- **All** - All posts

**User Flow:**
1. User sees all draft posts
2. Reviews each post
3. Can edit, delete, or approve
4. Clicks "Approve & Post" to publish
5. Post status changes to "Posted"
6. Engagement metrics displayed

## Components

### PostCard Component (`components/PostCard.jsx`)

**Purpose:** Display individual post with actions

**Features:**
- Status badge (Draft, Posted, Failed)
- Image preview
- Caption display
- Hashtags display
- Trending topics section
- Edit mode with inline editing
- Topic suggestion field
- Action buttons:
  - Edit/Save Changes
  - Delete
  - Approve & Post
- Engagement metrics (for posted posts)

**States:**
- **View Mode** - Display post content
- **Edit Mode** - Edit caption, hashtags, suggest topic
- **Posted Mode** - Show engagement metrics

**Props:**
- `post` - Post object
- `onRefresh` - Callback to refresh post list

## State Management (Zustand)

### Auth Store (`stores/authStore.js`)

**State:**
```javascript
{
  user: null,              // Current user object
  token: null,             // JWT token
  isLoading: false,        // Loading state
  error: null,             // Error message
}
```

**Actions:**
- `register(email, password, name)` - Create new account
- `login(email, password)` - Authenticate user
- `getProfile()` - Fetch user profile
- `updateProfile(data)` - Update user info
- `completeOnboarding(data)` - Complete onboarding
- `connectSocialMedia(platform, credentials)` - Connect social media
- `logout()` - Clear auth state
- `clearError()` - Clear error message

### Post Store (`stores/postStore.js`)

**State:**
```javascript
{
  posts: [],               // Array of posts
  currentPost: null,       // Currently selected post
  isLoading: false,        // Loading state
  error: null,             // Error message
  filters: {               // Current filters
    status: 'all',
    limit: 20,
    skip: 0
  }
}
```

**Actions:**
- `generatePost()` - Create new post draft
- `getUserPosts(filters)` - Fetch posts with filters
- `getPost(postId)` - Fetch single post
- `updatePost(postId, updates)` - Update post draft
- `approveAndPost(postId)` - Approve and publish post
- `deletePost(postId)` - Delete draft post
- `setCurrentPost(post)` - Set current post
- `clearError()` - Clear error message

## Styling System

### Design Principles

- **Minimalist** - Clean, simple interface
- **Functional** - Focus on usability
- **Consistent** - Unified design language
- **Accessible** - Clear hierarchy and contrast

### CSS Variables

Located in `styles/index.css`:

**Colors:**
- `--primary: #2563eb` (Blue)
- `--success: #10b981` (Green)
- `--error: #ef4444` (Red)
- `--warning: #f59e0b` (Amber)
- `--gray-*` (50-900) - Neutral palette

**Spacing:**
- `--spacing-xs` to `--spacing-3xl`
- Based on 0.25rem increments

**Typography:**
- `--font-family` - System fonts
- `--font-size-*` - 8 size options
- `--line-height-*` - 3 options

**Components:**
- `.btn-*` - Button variants
- `.card` - Card container
- `.alert` - Alert messages
- `.grid-*` - Grid layouts
- `.flex-*` - Flex utilities

### Utility Classes

**Text:**
- `.text-center`, `.text-right`, `.text-left`
- `.text-sm`, `.text-base`, `.text-lg`
- `.text-muted`, `.text-error`, `.text-success`
- `.font-bold`, `.font-semibold`, `.font-medium`

**Layout:**
- `.grid`, `.grid-2`, `.grid-3`
- `.flex`, `.flex-center`, `.flex-between`, `.flex-col`
- `.gap-sm`, `.gap-md`, `.gap-lg`

**Spacing:**
- `.mt-*`, `.mb-*`, `.p-*` (margin/padding utilities)

## Routing

### Protected Routes

All routes except login/register require authentication:

```
/login              - Public (redirects to dashboard if logged in)
/register           - Public (redirects to dashboard if logged in)
/onboarding         - Protected (requires auth)
/dashboard          - Protected (requires auth)
/settings           - Protected (requires auth)
/                   - Redirects to /dashboard
```

### Route Guards

- `ProtectedRoute` - Redirects to login if not authenticated
- `PublicRoute` - Redirects to dashboard if already authenticated

## API Integration

### Base URL

```javascript
VITE_API_URL = http://localhost:5000/api
```

### Axios Configuration

Automatically adds JWT token to all requests:

```javascript
Authorization: Bearer <token>
```

### Error Handling

- All API errors caught and displayed to user
- Loading states managed per action
- Error messages cleared on input change

## Development Workflow

### Running Development Server

```bash
cd client
npm run dev
```

Server runs on `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output in `dist/` directory

### Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

## Best Practices

### Component Structure

```jsx
import { useState, useEffect } from 'react';
import { useStore } from '../stores/store';

export default function Component() {
  const { data, action, isLoading } = useStore();
  const [localState, setLocalState] = useState('');

  useEffect(() => {
    // Side effects
  }, []);

  const handleAction = async () => {
    // Handle action
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Store Usage

```javascript
const { data, isLoading, error } = useStore();

// Use actions
await useStore.getState().action();

// Or in component
const { action } = useStore();
await action();
```

### Error Handling

```javascript
try {
  await action();
} catch (error) {
  setLocalError(error.response?.data?.message || 'Failed');
}
```

### Form Validation

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.field) {
    setError('Field is required');
    return;
  }
  
  // Submit
};
```

## Performance Optimization

### Code Splitting

Routes are automatically code-split by React Router.

### Image Optimization

- Use `<img>` with `objectFit: 'cover'`
- Lazy load images when needed
- Optimize image sizes on backend

### State Management

- Use Zustand for global state
- Use useState for local component state
- Avoid unnecessary re-renders

### Memoization

```javascript
import { useMemo } from 'react';

const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [dependency]);
```

## Accessibility

### Semantic HTML

- Use proper heading hierarchy
- Use `<label>` with form inputs
- Use `<button>` for actions

### ARIA Attributes

- Add `aria-label` for icon buttons
- Add `aria-describedby` for form errors
- Add `role` when needed

### Keyboard Navigation

- All buttons and links are keyboard accessible
- Focus states are visible
- Tab order is logical

## Common Tasks

### Adding a New Page

1. Create file in `pages/`
2. Add route in `App.jsx`
3. Import necessary stores
4. Build UI with components
5. Add styling with CSS variables

### Adding a New Component

1. Create file in `components/`
2. Define props and default values
3. Use stores if needed
4. Add styling
5. Export component

### Connecting to New API Endpoint

1. Add action to store
2. Make axios request
3. Update state
4. Handle errors
5. Use in component

## Troubleshooting

### Page not loading

- Check route in `App.jsx`
- Verify component export
- Check browser console for errors

### State not updating

- Verify store action is called
- Check async/await handling
- Verify state dependency

### Styling not applied

- Check CSS variable names
- Verify class names match
- Check CSS file import
- Clear browser cache

### API requests failing

- Check backend is running
- Verify API URL in `.env`
- Check network tab in DevTools
- Verify token is valid

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Responsive mobile design
- [ ] Image uploader component
- [ ] Post preview modal
- [ ] Analytics dashboard
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality
- [ ] Batch actions
- [ ] Search and filter
- [ ] Export posts

---

**Last Updated:** October 2025  
**Version:** 1.0.0
