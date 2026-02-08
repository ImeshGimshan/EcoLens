# 🌿 EcoLens - Heritage Guardian

![EcoLens Logo](public/logo.svg)

**EcoLens** is an AI-powered mobile-first web application designed to help preserve and protect cultural heritage sites. Using advanced computer vision and artificial intelligence, EcoLens enables users to scan, analyze, and report on the condition of heritage sites in real-time.

## ✨ Features

- 🔍 **AI-Powered Site Analysis** - Scan heritage sites using your device camera with AI-driven condition assessment
- 🗺️ **Interactive Map** - Explore nearby heritage sites with real-time location tracking
- 📊 **Detailed Reports** - Generate comprehensive condition reports with photo documentation
- 🏆 **Gamification & Achievements** - Earn points, unlock achievements, and climb the leaderboard
- 🔥 **Streak System** - Build daily scanning streaks for bonus rewards
- 👤 **User Profiles** - Track your contributions and progress
- 🛡️ **Admin Dashboard** - Manage reports and oversee heritage site monitoring
- 📱 **Mobile-First Design** - Optimized for mobile devices with PWA capabilities

## 🚀 Tech Stack

- **Framework:** Next.js 15 (React 19, App Router, Turbopack)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Maps:** Leaflet, React-Leaflet
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google Sign-In)
- **Storage:** Cloudinary (Image uploads)
- **AI/Vision:** OpenAI GPT-4 Vision, Google Gemini, Ollama
- **Language:** TypeScript
- **Icons:** Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

You'll also need accounts for:
- Firebase (Authentication & Firestore)
- Cloudinary (Image storage)
- OpenAI API or Google Gemini API (AI analysis)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ecolens.git
cd ecolens
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----

# Cloudinary (Image Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# AI Vision Providers
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OLLAMA_BASE_URL=http://localhost:11434

# Optional: Default AI Provider (openai, gemini, or ollama)
DEFAULT_VISION_PROVIDER=gemini
```

### 4. Firebase Setup

#### Configure Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Enable Google Sign-In
4. Enable **Firestore Database** → Start in production mode
5. Set up Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User stats
    match /userStats/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reports
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Admins collection
    match /admins/{adminId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Achievements
    match /achievements/{achievementId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

#### Download Firebase Admin SDK:

1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Use the values in your `.env.local` file

### 5. Initialize Admin Emails

After setup, initialize admin emails in Firestore:

**Option 1: Use the API endpoint**
```bash
npm run dev
curl -X POST http://localhost:3000/api/admin/init
```

**Option 2: Open the HTML file**
- Open `init-admins.html` in your browser
- Click the "Initialize Admin Emails" button

### 6. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
ecolens/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin pages (login, reports)
│   ├── api/                 # API routes
│   │   ├── admin/          # Admin management
│   │   ├── analyze/        # AI analysis endpoint
│   │   ├── places/         # Places/heritage sites
│   │   └── reports/        # Report management
│   ├── leaderboard/        # Leaderboard page
│   ├── login/              # Login page
│   ├── map/                # Map view
│   ├── reports/            # User reports
│   ├── scan/               # Camera scan page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── AnalysisResultOverlay.tsx
│   ├── AppHeader.tsx
│   ├── BottomNav.tsx
│   ├── MobileFrame.tsx
│   └── ...
├── contexts/               # React contexts
│   └── AuthContext.tsx    # Authentication context
├── hooks/                  # Custom React hooks
│   └── useAchievements.ts
├── lib/                    # Utility libraries
│   ├── achievements/      # Achievement system
│   ├── admin/            # Admin utilities
│   ├── ai/               # AI vision providers
│   ├── cloudinary.ts     # Image upload
│   ├── firebase.ts       # Firebase client
│   └── firebase-admin.ts # Firebase admin
├── public/                # Static assets
│   └── logo.svg
├── .env.local            # Environment variables (create this)
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎮 Usage

### For Users:

1. **Sign In** - Use Google authentication to sign in
2. **Grant Permissions** - Allow location and camera access
3. **Scan Sites** - Visit heritage sites and use the scan feature
4. **View Results** - Get AI-powered condition assessments
5. **Earn Rewards** - Complete achievements and climb the leaderboard
6. **Track Progress** - View your scanning history and statistics

### For Admins:

1. **Admin Login** - Visit `/admin/login` and sign in with admin email
2. **Review Reports** - Access all user-submitted reports
3. **Moderate Content** - Approve or reject scan reports
4. **Monitor Activity** - Track overall platform usage

## 🔑 API Endpoints

### Public Endpoints
- `POST /api/analyze` - Analyze heritage site image
- `GET /api/places/nearby` - Get nearby heritage sites
- `GET /api/health` - Health check

### Authenticated Endpoints
- `GET /api/reports` - Get all reports (admin only)
- `GET /api/reports/[id]` - Get specific report
- `GET /api/reports/user` - Get user's reports
- `POST /api/reports` - Create new report

### Admin Endpoints
- `POST /api/admin/init` - Initialize default admins
- `GET /api/admin/manage` - List all admins
- `POST /api/admin/manage` - Add/remove admins

## 🎯 Achievement System

EcoLens includes a comprehensive gamification system with:

- **Points System** - Earn points for scans, reports, and streaks
- **Levels** - Progress through levels as you earn more points
- **Achievements** - Unlock achievements across multiple categories
- **Streaks** - Build daily scanning streaks for bonus rewards
- **Leaderboard** - Compete with other heritage guardians

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel settings
4. Deploy!

### Build for Production

```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenStreetMap for location data
- Firebase for backend services
- Cloudinary for image hosting
- OpenAI & Google for AI capabilities

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🔗 Links

- [Live Demo](https://63e9-220-247-221-156.ngrok-free.app/)
- [Documentation](https://github.com/yourusername/ecolens/wiki)
- [Report Bug](https://github.com/yourusername/ecolens/issues)
- [Request Feature](https://github.com/yourusername/ecolens/issues)

---

Made with 💚 by the EcoLens Team
