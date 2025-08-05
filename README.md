<div align="center">

# 🏥 MediSafe Pro

**Secure • Intelligent • User-Friendly**

A modern, secure, and intelligent web application designed to revolutionize personal medical record management with cutting-edge AI technology.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Genkit](https://img.shields.io/badge/Genkit-1.14.1-blue?style=for-the-badge&logo=firebase)](https://firebase.google.com/docs/genkit)

[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Issues](https://img.shields.io/badge/Issues-welcome-red.svg?style=for-the-badge)](https://github.com/your-repository/medisafe-pro/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Tech Stack](#️-tech-stack)
- [📱 Screenshots](#-screenshots)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📁 Project Structure](#-project-structure)
- [🤖 AI Features](#-ai-features)
- [🔒 Security](#-security)
- [📱 Responsive Design](#-responsive-design)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- **📊 Dashboard Overview** - Centralized health statistics and recent medical records
- **📄 Secure Document Upload** - Upload and manage medical documents (PDF, Images, TXT, MD)
- **🔍 Smart Document Management** - Advanced filtering, search, and organization
- **🖨️ Printable Certificates** - Generate clean, shareable document views
- **☁️ Cloud Storage** - Free Google Sheets + Drive integration for secure document storage

### 🤖 AI-Powered Intelligence
- **🏷️ Auto-Tagging** - Automatic document classification (Lab Reports, Prescriptions, Invoices)
- **📝 Smart Summaries** - AI-generated concise document summaries
- **📖 Full Document Explanation** - Complex medical text breakdown into simple language
- **💬 Medical Assistant Chat** - Interactive AI chatbot for medical term explanations

### 📅 Health Management
- **⏰ Health Reminders** - Medication schedules, appointment tracking
- **📈 Health Analytics** - Visual health data representation
- **🔔 Smart Notifications** - Timely health-related alerts

### 🎨 User Experience
- **📱 Responsive Design** - Seamless experience across all devices
- **🌙 Dark/Light Mode** - Customizable interface themes
- **⚡ Fast Performance** - Optimized with Next.js and Turbopack
- **🔐 Secure Authentication** - Protected user data and privacy

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repository/medisafe-pro.git
cd medisafe-pro

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Add your API keys to .env.local

# Start development servers
npm run dev          # Next.js app (http://localhost:9002)
npm run genkit:dev   # AI server (separate terminal)
```

---

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)

### AI & Backend
![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=flat-square&logo=firebase)
![Genkit](https://img.shields.io/badge/Genkit-1.14.1-blue?style=flat-square&logo=firebase)
![Google AI](https://img.shields.io/badge/Google_AI-Gemini-blue?style=flat-square&logo=google)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-Database-green?style=flat-square&logo=google)
![Google Drive](https://img.shields.io/badge/Google_Drive-Storage-blue?style=flat-square&logo=google)

### UI Components
![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-Latest-black?style=flat-square)
![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-black?style=flat-square)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-Latest-gray?style=flat-square)

### Development Tools
![Turbopack](https://img.shields.io/badge/Turbopack-Latest-blue?style=flat-square)
![ESLint](https://img.shields.io/badge/ESLint-Latest-red?style=flat-square)
![PostCSS](https://img.shields.io/badge/PostCSS-Latest-green?style=flat-square)

---

## 📱 Screenshots

<div align="center">

![MediSafe Pro Dashboard](https://placehold.co/800x400/1f2937/ffffff?text=MediSafe+Pro+Dashboard)
*Modern dashboard with health statistics and document management*

![Document Upload](https://placehold.co/800x400/1f2937/ffffff?text=Secure+Document+Upload)
*Secure file upload with AI-powered analysis*

![AI Chat Assistant](https://placehold.co/800x400/1f2937/ffffff?text=AI+Medical+Assistant)
*Interactive AI chatbot for medical explanations*

</div>

---

## 🔧 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google AI API Key** (for Gemini integration)
- **Firebase Project** (for authentication and data storage)

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
    git clone https://github.com/your-repository/medisafe-pro.git
    cd medisafe-pro
    ```

2. **Install Dependencies**
   ```bash
    npm install
    ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   # Google AI Configuration
   GEMINI_API_KEY=your_google_ai_api_key_here
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

4. **Start Development Servers**

   **Terminal 1 - Next.js App:**
   ```bash
        npm run dev
        ```
   Access at: http://localhost:9002

   **Terminal 2 - AI Server:**
   ```bash
        npm run genkit:dev
        ```
   Access Genkit UI for AI flow inspection

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google AI API key for Gemini integration | ✅ |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public URL of your application | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |

### AI Configuration

The application uses Firebase Genkit for AI operations. Configure AI flows in:
- `src/ai/flows/` - AI flow definitions
- `src/ai/genkit.ts` - Genkit configuration
- `src/ai/dev.ts` - Development server setup

---

## 📁 Project Structure

```
medisafe-pro/
├── 📁 src/
│   ├── 📁 ai/                    # AI integration
│   │   ├── 📁 flows/            # Genkit AI flows
│   │   ├── genkit.ts            # Genkit configuration
│   │   └── dev.ts               # Development server
│   ├── 📁 app/                  # Next.js App Router
│   │   ├── 📁 certificate/      # Document certificates
│   │   ├── 📁 documents/        # Document management
│   │   ├── 📁 reminders/        # Health reminders
│   │   ├── 📁 settings/         # User settings
│   │   └── 📁 sharing/          # Document sharing
│   ├── 📁 components/           # React components
│   │   ├── 📁 ui/               # ShadCN UI components
│   │   └── *.tsx                # Custom components
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 lib/                  # Utilities and actions
│   └── 📁 types/                # TypeScript definitions
├── 📁 public/                   # Static assets
├── 📁 docs/                     # Documentation
└── 📄 Configuration files
```

---

## 🤖 AI Features

### Document Analysis
- **Auto-Tagging**: Automatically categorizes documents into medical types
- **Smart Summaries**: Generates concise, accurate document summaries
- **Full Explanation**: Breaks down complex medical terminology

### Medical Assistant
- **Term Explanation**: Provides simple explanations for medical terms
- **Interactive Chat**: Real-time AI-powered medical assistance
- **Context Awareness**: Understands document context for better responses

### AI Flows
- `auto-tag-document-type.ts` - Document classification
- `summarize-document.ts` - Document summarization
- `explain-document.ts` - Full document explanation
- `medical-term-explanation.ts` - Medical term breakdown
- `generate-doctor-questions.ts` - Doctor consultation preparation

---

## 🔒 Security

- **🔐 Secure Authentication** - Protected user sessions
- **📄 Encrypted Storage** - Secure document storage
- **🛡️ API Security** - Protected AI endpoints
- **🔒 Privacy Compliance** - HIPAA-aware data handling
- **🔐 Environment Variables** - Secure configuration management

---

## 📱 Responsive Design

- **🖥️ Desktop** - Full-featured dashboard experience
- **📱 Mobile** - Optimized touch interface
- **📱 Tablet** - Adaptive layout for medium screens
- **🌐 Progressive Web App** - Offline capabilities

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Conventional Commits** - Standardized commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made for better healthcare management**

[![GitHub stars](https://img.shields.io/github/stars/your-repository/medisafe-pro?style=social)](https://github.com/your-repository/medisafe-pro)
[![GitHub forks](https://img.shields.io/github/forks/your-repository/medisafe-pro?style=social)](https://github.com/your-repository/medisafe-pro)
[![GitHub issues](https://img.shields.io/github/issues/your-repository/medisafe-pro)](https://github.com/your-repository/medisafe-pro/issues)

</div>
