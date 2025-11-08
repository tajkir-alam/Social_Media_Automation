# AI-SMART: AI Social Media Automation & Review Tool

An intelligent, full-stack MERN application that automates social media content creation and posting. AI-SMART generates engaging captions with trending topics and hashtags, learns your preferences, and provides a review/approval dashboard for one-click posting to Facebook and LinkedIn.

## 🎯 Features

- **🤖 AI-Powered Caption Generation** - Automatically generates engaging captions using OpenAI
- **📈 Trending Topics Analysis** - Researches and integrates trending topics relevant to your niche
- **🏷️ Smart Hashtag Generation** - Creates relevant hashtags based on content and trends
- **📅 Automated Scheduling** - Daily automatic post generation at your preferred time
- **👤 User Profiling & Learning** - AI learns your preferences and niche over time
- **📸 Image Management** - Upload and automatically match images with captions
- **✅ Review & Approval Dashboard** - Simple interface to review and approve posts before posting
- **📱 Multi-Platform Posting** - One-click posting to Facebook and LinkedIn simultaneously
- **📊 Analytics & Engagement Tracking** - Monitor post performance and engagement metrics
- **🔐 Secure Authentication** - JWT-based authentication with password hashing
- **🎨 Modular Architecture** - Clean MVC structure for easy maintenance and extension

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **OpenAI API** - AI caption generation
- **node-cron** - Task scheduling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **CSS** - Styling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- OpenAI API key
- Facebook Graph API credentials
- LinkedIn API credentials

## 🔧 Installation

### 1. Clone and Setup

```bash
cd ai-smart
npm install
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Frontend Setup

```bash
cd client
npm install
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-smart

# JWT
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# Facebook API
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_token

# LinkedIn API
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Frontend
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Mode

```bash
# Build frontend
cd client
npm run build

# Start backend with production environment
NODE_ENV=production npm start
```

## 📚 Project Structure

```
ai-smart/
├── server/                    # Backend application
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Analytics.js
│   ├── controllers/          # Request handlers
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── imageController.js
│   ├── services/             # Business logic
│   │   ├── aiService.js
│   │   ├── trendingService.js
│   │   ├── socialMediaService.js
│   │   ├── imageService.js
│   │   └── schedulerService.js
│   ├── routes/               # API endpoints
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── images.js
│   ├── middleware/           # Express middleware
│   │   └── auth.js
│   ├── config/               # Configuration
│   │   └── database.js
│   └── server.js             # Entry point
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand stores
│   │   ├── services/         # API utilities
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # Global styles
│   │   └── App.jsx           # Root component
│   └── public/               # Static assets
├── uploads/                  # Uploaded images
├── MVC_ARCHITECTURE.md       # Detailed architecture documentation
└── README.md                 # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/onboarding/complete` - Complete onboarding
- `POST /api/users/social-media/connect` - Connect social media account
- `GET /api/users/profiling/questions` - Get profiling questions
- `POST /api/users/profiling/answers` - Save profiling answers

### Posts
- `POST /api/posts` - Generate new post
- `GET /api/posts` - Get user's posts
- `GET /api/posts/:postId` - Get single post
- `PUT /api/posts/:postId` - Update post draft
- `POST /api/posts/:postId/approve` - Approve and post to social media
- `DELETE /api/posts/:postId` - Delete post
- `GET /api/posts/analytics/all` - Get analytics

### Images
- `POST /api/images` - Upload image
- `GET /api/images` - Get all images
- `GET /api/images/:filename/metadata` - Get image metadata
- `DELETE /api/images/:filename` - Delete image
- `GET /api/images/:filename/resize` - Resize image

## 📖 Usage Guide

### 1. Register & Login
```bash
# Register
POST /api/users/register
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}

# Login
POST /api/users/login
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

### 2. Complete Onboarding
```bash
POST /api/users/onboarding/complete
{
  "niche": "tech",
  "targetAudience": "software developers",
  "postingStyle": "professional",
  "niches": [
    {
      "name": "Artificial Intelligence",
      "description": "AI and machine learning topics",
      "keywords": ["AI", "ML", "deep learning"]
    }
  ]
}
```

### 3. Connect Social Media
```bash
POST /api/users/social-media/connect
{
  "platform": "facebook",
  "pageId": "123456789",
  "accessToken": "your_facebook_token"
}
```

### 4. Upload Images
```bash
POST /api/images
Content-Type: multipart/form-data
[image file]
```

### 5. Generate Post
```bash
POST /api/posts
# Returns a draft post with AI-generated caption
```

### 6. Review & Edit Post
```bash
PUT /api/posts/:postId
{
  "caption": "edited caption",
  "hashtags": ["#edited", "#hashtags"],
  "approvalNotes": "looks good"
}
```

### 7. Approve & Post
```bash
POST /api/posts/:postId/approve
# Posts to Facebook and LinkedIn simultaneously
```

## 🎯 Workflow

1. **User Registration** - Create account and set up profile
2. **Onboarding** - Define niche, target audience, and posting style
3. **Social Media Connection** - Connect Facebook and LinkedIn accounts
4. **Image Upload** - Upload images to the platform
5. **Enable Automation** - Turn on automatic daily post generation
6. **Review Dashboard** - Check generated posts daily
7. **Edit if Needed** - Modify captions and hashtags
8. **Approve & Post** - One-click posting to both platforms
9. **Analytics** - Monitor engagement and performance

## 🔄 Automated Daily Generation

Once automation is enabled:

1. **Daily Trigger** - At your preferred time (default: 9 AM)
2. **Research** - AI researches trending topics for your niche
3. **Generate** - AI creates engaging caption with hashtags
4. **Select Image** - Automatically matches image with caption
5. **Create Draft** - Post saved as draft in your dashboard
6. **Notify** - You receive notification to review

## 🤖 AI Learning

The AI learns from:

- **Your Niche** - Generates content relevant to your industry
- **Past Posts** - Analyzes what performed well
- **Engagement Data** - Learns from likes, comments, shares
- **Your Preferences** - Adapts to your posting style
- **Trending Topics** - Incorporates current trends

## 🔐 Security Features

- **Password Hashing** - bcryptjs with 10 salt rounds
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - All endpoints require valid token
- **Input Validation** - Server-side validation for all inputs
- **CORS** - Configured for secure cross-origin requests
- **Environment Variables** - Sensitive data in .env

## 📊 Database Models

### User
- Profile information
- Social media credentials
- Preferences and settings
- Past posts and engagement data
- Niche and audience information

### Post
- Generated caption
- Hashtags and trending topics
- Image reference
- Status (draft, approved, posted, failed)
- Social media IDs
- Engagement metrics

### Analytics
- Event tracking
- User actions
- Post performance
- Engagement data

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### OpenAI API Errors
- Verify API key is valid
- Check API quota and billing
- Ensure API key has correct permissions

### Social Media Posting Fails
- Verify access tokens are current
- Check API permissions
- Ensure page/profile IDs are correct

### Image Upload Issues
- Check file size (max 5MB)
- Verify file format (JPG, PNG, GIF, WebP)
- Ensure upload directory exists

## 📈 Performance Tips

- Use MongoDB indexes for faster queries
- Implement caching for trending topics
- Optimize image sizes before upload
- Use pagination for post lists
- Enable gzip compression on server

## 🚀 Deployment

### Heroku
```bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### AWS/DigitalOcean
- Use PM2 for process management
- Set up Nginx as reverse proxy
- Configure SSL/TLS certificates
- Set up automated backups

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@ai-smart.com
- Documentation: See MVC_ARCHITECTURE.md

## 🎉 Acknowledgments

- OpenAI for GPT API
- Facebook and LinkedIn for social media APIs
- MERN community for excellent tools and libraries

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Maintainer:** AI-SMART Team
