# Vahan - AI-Augmented Meeting Dashboard

A comprehensive meeting intelligence platform that automatically captures, analyzes, and organizes meeting transcripts with AI-powered insights. Built with a beautiful glassmorphic design using React, TypeScript, and Google Gemini AI.

![Vahan Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)

## ✨ Features

### 🤖 AI-Powered Analysis
- **Automatic Meeting Summarization**: Google Gemini AI generates concise summaries from transcripts
- **Action Item Extraction**: Automatically identifies and lists action items from meetings
- **Intelligent Q&A**: Ask questions about your meetings and get contextual answers
- **Smart Title Generation**: AI creates descriptive titles for uploaded transcripts

### 📊 Meeting Management
- **All Meetings View**: Clean table interface with date, time, team, and description
- **Team Organization**: Color-coded team classification (Engineering, Marketing, Sales, Design)
- **Meeting Details**: Full transcript view with AI-generated insights
- **Upload Interface**: Drag & drop transcript files (.txt, .doc, .docx)

### 👥 Team Collaboration
- **Team-Based Organization**: Meetings categorized by department/team
- **User Authentication**: Secure Replit OAuth integration
- **Multi-User Support**: Individual user sessions and preferences

### 🏗️ Admin Panel
- **Knowledge Base Management**: Upload company FAQ documents
- **Document Organization**: Centralized document storage and retrieval
- **File Type Support**: PDF, TXT, DOCX document uploads

### 🎨 Design System
- **Glassmorphic UI**: Modern Apple-inspired liquid glass aesthetic
- **Color Scheme**: White and orange complementary design
- **Responsive Layout**: Works seamlessly across desktop and mobile
- **Smooth Animations**: Polished user interactions with transitions

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Radix UI + shadcn/ui** for accessible components
- **Tailwind CSS** for styling with glassmorphic effects

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Multer** for file upload handling
- **Passport.js** with OpenID Connect for authentication

### AI & Services
- **Google Gemini AI** (gemini-2.5-flash) for text analysis
- **Neon PostgreSQL** for serverless database
- **Replit OAuth** for user authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key
- Replit environment (for OAuth)

### Environment Variables
```env
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
SESSION_SECRET=your_session_secret
REPLIT_DOMAINS=your_replit_domain
REPL_ID=your_repl_id
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vahan-dashboard.git
   cd vahan-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5000`
   - Sign in with Replit OAuth

## 📁 Project Structure

```
vahan-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── index.css       # Global styles
├── server/                 # Express backend
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data access layer
│   ├── gemini.ts          # AI integration
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate OAuth login
- `GET /api/logout` - Logout user

### Meetings
- `GET /api/meetings` - List all meetings
- `GET /api/meetings/:id` - Get meeting details
- `POST /api/meetings/upload` - Upload transcript

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create new team

### AI Chat
- `GET /api/chat/sessions` - Get chat sessions
- `POST /api/chat/sessions` - Create chat session
- `POST /api/chat/sessions/:id/messages` - Send message

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `DELETE /api/documents/:id` - Delete document

## 🎯 Usage Guide

### Uploading Meetings
1. Navigate to "All Meetings" page
2. Click "browse files" or drag & drop transcript files
3. Select team (optional)
4. Click "Upload" to process with AI analysis

### AI Question Answering
1. Go to "AI Assistant" page
2. Ask questions about your meetings
3. Get contextual answers based on transcript content

### Managing Teams
1. Teams appear in the sidebar with color indicators
2. Click team names to filter meetings by team
3. Create new teams via API or admin interface

### Document Management
1. Access "Admin Panel" for document uploads
2. Upload company FAQs and reference materials
3. Documents are indexed for AI question answering

## 🔧 Configuration

### Database Schema
The application uses Drizzle ORM with the following main tables:
- `users` - User authentication data
- `teams` - Team organization
- `meetings` - Meeting records with transcripts and AI analysis
- `chat_sessions` - AI conversation sessions
- `chat_messages` - Individual chat messages
- `documents` - Uploaded knowledge base documents
- `sessions` - User session storage

### AI Configuration
Google Gemini AI handles:
- Meeting transcript summarization
- Action item extraction
- Title generation
- Contextual question answering

## 🚢 Deployment

### Replit Deployment
This project is optimized for Replit deployment:
1. Ensure all environment variables are set in Replit Secrets
2. The application automatically serves frontend and backend on the same port
3. PostgreSQL database should be provisioned through Replit

### Production Considerations
- Set `NODE_ENV=production`
- Use secure session secrets
- Enable HTTPS for production domains
- Configure proper CORS settings
- Set up error monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent text analysis
- Replit for hosting and authentication infrastructure
- Radix UI and shadcn/ui for beautiful, accessible components
- The React and TypeScript communities for excellent tooling

---

**Built with ❤️ for better meeting intelligence**