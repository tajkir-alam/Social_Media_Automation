# AI-SMART: MVC Architecture Documentation

## Project Overview

**AI-SMART** is a full-stack MERN application that automates social media content creation and posting. It uses AI to generate engaging captions with trending topics and hashtags, learns user preferences, and provides a review/approval dashboard for one-click posting to Facebook and LinkedIn.

---

## Architecture Pattern: Model-View-Controller (MVC)

The application follows the **MVC architectural pattern**, which separates concerns into three layers:

### 1. **Model Layer** (Data & Business Logic)
Located in: `/server/models/` and `/server/services/`

**Responsibilities:**
- Define data structures and schemas
- Handle database operations
- Implement business logic and algorithms
- Manage state and data transformations

**Key Models:**
- **User.js** - User profiles, preferences, social media credentials
- **Post.js** - Generated posts, captions, hashtags, status tracking
- **Analytics.js** - Event tracking and engagement metrics

**Key Services:**
- **aiService.js** - AI caption generation using OpenAI API
- **trendingService.js** - Trending topics research and analysis
- **socialMediaService.js** - Facebook/LinkedIn API integration
- **imageService.js** - Image selection and processing
- **schedulerService.js** - Automated daily post generation

### 2. **View Layer** (User Interface)
Located in: `/client/src/`

**Responsibilities:**
- Display data to users
- Capture user input
- Render dynamic content
- Handle UI state management

**Key Components:**
- **Pages/** - Full-page components (Dashboard, Onboarding, Login)
- **Components/** - Reusable UI components (PostCard, ImageUploader, etc.)
- **Stores/** - Zustand stores for state management (authStore, postStore)

**Technology Stack:**
- React 18
- Vite (build tool)
- Zustand (state management)
- Axios (HTTP client)
- CSS/Tailwind (styling)

### 3. **Controller Layer** (Request Handling & Routing)
Located in: `/server/controllers/` and `/server/routes/`

**Responsibilities:**
- Handle HTTP requests from clients
- Validate input data
- Call appropriate services
- Return formatted responses
- Manage middleware and authentication

**Key Controllers:**
- **userController.js** - Authentication, profile management, onboarding
- **postController.js** - Post generation, approval, posting
- **imageController.js** - Image upload and management

**Key Routes:**
- `/api/users/` - User authentication and profile endpoints
- `/api/posts/` - Post CRUD and approval endpoints
- `/api/images/` - Image upload and management endpoints

---

## Data Flow Architecture

### Request-Response Cycle

```
Client (React)
    ↓
HTTP Request (Axios)
    ↓
Express Router (/routes)
    ↓
Middleware (Auth, Validation)
    ↓
Controller (postController, userController, etc.)
    ↓
Service Layer (aiService, socialMediaService, etc.)
    ↓
Model Layer (MongoDB, Database)
    ↓
Response (JSON)
    ↓
Client Store (Zustand)
    ↓
UI Update (React Components)
```

### Example: Generate Post Flow

1. **View (React)** - User clicks "Generate Post" button
2. **Controller** - `POST /api/posts` request received
3. **Service** - `aiService.generateCaption()` called
4. **Service** - `trendingService.getTrendingTopics()` called
5. **Service** - `imageService.selectImageForCaption()` called
6. **Model** - Post document created in MongoDB
7. **Response** - Post data sent back to client
8. **Store** - Zustand updates state
9. **View** - UI renders new post draft

---

## Modular Structure

### Backend Modules

```
server/
├── models/              # Data schemas
│   ├── User.js
│   ├── Post.js
│   └── Analytics.js
├── controllers/         # Request handlers
│   ├── userController.js
│   ├── postController.js
│   └── imageController.js
├── services/           # Business logic
│   ├── aiService.js
│   ├── trendingService.js
│   ├── socialMediaService.js
│   ├── imageService.js
│   └── schedulerService.js
├── routes/             # API endpoints
│   ├── users.js
│   ├── posts.js
│   └── images.js
├── middleware/         # Express middleware
│   └── auth.js
├── config/             # Configuration
│   └── database.js
└── server.js           # Entry point
```

### Frontend Modules

```
client/src/
├── components/         # Reusable UI components
│   ├── PostCard.jsx
│   ├── ImageUploader.jsx
│   ├── OnboardingForm.jsx
│   └── ...
├── pages/              # Full-page components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Onboarding.jsx
│   └── ...
├── stores/             # Zustand stores
│   ├── authStore.js
│   └── postStore.js
├── services/           # API client utilities
│   └── api.js
├── hooks/              # Custom React hooks
│   └── useAuth.js
├── utils/              # Utility functions
│   └── helpers.js
├── styles/             # Global styles
│   └── index.css
└── App.jsx             # Root component
```

---

## Key Features & Implementation

### 1. **Automated Content Generation**

**Service:** `aiService.js`

```javascript
async generateCaption(options) {
  // Calls OpenAI API with user context
  // Returns: { caption, hashtags, trendingTopics, confidenceScore }
}
```

**Workflow:**
1. Fetch user preferences and past engagement data
2. Research trending topics relevant to user's niche
3. Generate caption using AI
4. Extract hashtags and trending topics
5. Store as draft post

### 2. **Trending Topics Research**

**Service:** `trendingService.js`

```javascript
async getTrendingTopics(niche, keywords) {
  // Returns trending topics based on niche
  // Analyzes relevance to user's industry
}
```

**Features:**
- Niche-based topic suggestions
- Keyword-based filtering
- Relevance scoring
- Hashtag generation

### 3. **Social Media Integration**

**Service:** `socialMediaService.js`

```javascript
async postToAllPlatforms(credentials, postData) {
  // Posts to Facebook and LinkedIn simultaneously
  // Returns: [{ platform, postId, success }]
}
```

**Supported Platforms:**
- Facebook Pages
- LinkedIn Personal/Organization

### 4. **User Profiling & Learning**

**Model:** `User.js` with profiling fields

```javascript
{
  niche: String,
  niches: [{
    name: String,
    description: String,
    keywords: [String]
  }],
  targetAudience: String,
  postingStyle: Enum,
  pastPosts: [{
    caption: String,
    engagement: Number,
    likes: Number,
    comments: Number,
    shares: Number
  }]
}
```

**Features:**
- User profiling questionnaire
- Engagement analysis
- Style preference learning
- Niche identification

### 5. **Automated Scheduling**

**Service:** `schedulerService.js`

```javascript
async startScheduler(userId, scheduleTime) {
  // Uses node-cron for scheduling
  // Generates posts at specified time daily
}
```

**Features:**
- Configurable posting times
- Daily automatic generation
- User preference-based scheduling
- Start/stop scheduler per user

### 6. **Image Management**

**Service:** `imageService.js`

```javascript
async selectImageForCaption(caption, keywords) {
  // Selects appropriate image from uploaded folder
  // Matches image with caption content
}
```

**Features:**
- Image upload and storage
- Metadata extraction
- Image resizing and optimization
- Caption-image matching

---

## API Endpoints

### User Endpoints

```
POST   /api/users/register              # Register new user
POST   /api/users/login                 # Login user
GET    /api/users/profile               # Get user profile
PUT    /api/users/profile               # Update profile
POST   /api/users/onboarding/complete   # Complete onboarding
POST   /api/users/social-media/connect  # Connect social media
GET    /api/users/profiling/questions   # Get profiling questions
POST   /api/users/profiling/answers     # Save profiling answers
```

### Post Endpoints

```
POST   /api/posts                       # Generate new post
GET    /api/posts                       # Get user's posts
GET    /api/posts/:postId               # Get single post
PUT    /api/posts/:postId               # Update post draft
POST   /api/posts/:postId/approve       # Approve and post
DELETE /api/posts/:postId               # Delete post
GET    /api/posts/analytics/all         # Get analytics
```

### Image Endpoints

```
POST   /api/images                      # Upload image
GET    /api/images                      # Get all images
GET    /api/images/:filename/metadata   # Get image metadata
DELETE /api/images/:filename            # Delete image
GET    /api/images/:filename/resize     # Resize image
```

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  niche: String,
  niches: [{
    name: String,
    description: String,
    keywords: [String]
  }],
  targetAudience: String,
  postingStyle: Enum,
  socialMediaAccounts: {
    facebook: { pageId, accessToken, connected },
    linkedin: { profileId, accessToken, connected }
  },
  preferences: {
    autoPostingEnabled: Boolean,
    postingFrequency: String,
    bestTimeToPost: String,
    includeHashtags: Boolean,
    includeTrendingTopics: Boolean,
    maxHashtags: Number
  },
  pastPosts: [{
    caption, engagement, likes, comments, shares, postedAt
  }],
  profileCompleteness: Number,
  isOnboarded: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  caption: String,
  hashtags: [String],
  trendingTopics: [String],
  imagePath: String,
  imageUrl: String,
  status: Enum (draft, approved, posted, failed, scheduled),
  generatedAt: Date,
  approvedAt: Date,
  postedAt: Date,
  socialMediaIds: {
    facebook: String,
    linkedin: String
  },
  engagement: {
    likes: Number,
    comments: Number,
    shares: Number,
    views: Number
  },
  aiMetadata: {
    generationModel: String,
    trendingTopicsSources: [String],
    confidenceScore: Number,
    userNiche: String
  },
  editedCaption: String,
  editedHashtags: [String],
  approvalNotes: String,
  failureReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  postId: ObjectId (ref: Post),
  eventType: Enum (post_generated, post_approved, post_posted, post_failed, engagement_tracked),
  data: {
    caption: String,
    hashtags: [String],
    trendingTopics: [String],
    engagement: { likes, comments, shares },
    platform: Enum (facebook, linkedin, both)
  },
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## State Management (Zustand)

### Auth Store (`authStore.js`)

```javascript
{
  user: Object,
  token: String,
  isLoading: Boolean,
  error: String,
  
  // Methods
  register(email, password, name),
  login(email, password),
  getProfile(),
  updateProfile(data),
  completeOnboarding(data),
  connectSocialMedia(platform, credentials),
  logout(),
  clearError()
}
```

### Post Store (`postStore.js`)

```javascript
{
  posts: [Post],
  currentPost: Post,
  isLoading: Boolean,
  error: String,
  filters: Object,
  
  // Methods
  generatePost(),
  getUserPosts(filters),
  getPost(postId),
  updatePost(postId, updates),
  approveAndPost(postId),
  deletePost(postId),
  setCurrentPost(post),
  clearError()
}
```

---

## Authentication & Security

### JWT Authentication

1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT token
4. Client stores token in localStorage
5. Client includes token in Authorization header for protected routes
6. Server verifies token with `authMiddleware`

### Password Security

- Passwords hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Compared using bcrypt.compare()

### Protected Routes

All API endpoints except `/register` and `/login` require valid JWT token in Authorization header:

```
Authorization: Bearer <token>
```

---

## Deployment Considerations

### Environment Variables

```
PORT=5000
NODE_ENV=production
MONGODB_URI=<connection_string>
JWT_SECRET=<secure_random_string>
OPENAI_API_KEY=<your_openai_key>
FACEBOOK_APP_ID=<your_facebook_app_id>
FACEBOOK_APP_SECRET=<your_facebook_app_secret>
FACEBOOK_PAGE_ACCESS_TOKEN=<your_facebook_token>
LINKEDIN_CLIENT_ID=<your_linkedin_client_id>
LINKEDIN_CLIENT_SECRET=<your_linkedin_client_secret>
LINKEDIN_ACCESS_TOKEN=<your_linkedin_token>
VITE_API_URL=<backend_api_url>
```

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use environment-specific configurations
- [ ] Enable CORS for production domain only
- [ ] Set up MongoDB Atlas or production database
- [ ] Configure social media API credentials
- [ ] Set up error logging and monitoring
- [ ] Enable HTTPS
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting
- [ ] Set up automated backups

---

## Development Workflow

### Running Locally

```bash
# Backend
cd server
npm install
npm start

# Frontend (in another terminal)
cd client
npm install
npm run dev
```

### Adding New Features

1. **Define Model** - Create/update schema in `server/models/`
2. **Create Service** - Add business logic in `server/services/`
3. **Create Controller** - Add request handler in `server/controllers/`
4. **Create Routes** - Add API endpoints in `server/routes/`
5. **Create Store** - Add state management in `client/src/stores/`
6. **Create Components** - Build UI in `client/src/components/`
7. **Create Pages** - Build pages in `client/src/pages/`

### Code Organization Principles

- **Single Responsibility** - Each module has one clear purpose
- **Separation of Concerns** - Models, Controllers, Views are separate
- **Reusability** - Services and components are reusable
- **Modularity** - Easy to add/remove features
- **Testability** - Each layer can be tested independently

---

## Future Enhancements

1. **Image Recognition** - Use computer vision to match images with captions
2. **Advanced Analytics** - Detailed engagement metrics and trends
3. **Multi-language Support** - Generate captions in multiple languages
4. **Content Calendar** - Visual calendar for scheduled posts
5. **Team Collaboration** - Multiple users managing same account
6. **A/B Testing** - Test different caption variations
7. **Mobile App** - React Native version
8. **Chrome Extension** - Browser extension for quick posting
9. **Webhook Integration** - Real-time engagement updates
10. **Custom AI Models** - Fine-tuned models for specific niches

---

## Troubleshooting

### Common Issues

**Issue:** MongoDB connection fails
- **Solution:** Check MONGODB_URI in .env, ensure MongoDB is running

**Issue:** OpenAI API errors
- **Solution:** Verify OPENAI_API_KEY is valid, check API quota

**Issue:** Social media posting fails
- **Solution:** Verify access tokens are valid, check API permissions

**Issue:** Images not uploading
- **Solution:** Check file size limit, verify upload directory permissions

---

## Support & Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api/)
- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/shared/api-reference/api-reference)

---

**Last Updated:** October 2025
**Version:** 1.0.0
