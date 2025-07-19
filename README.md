# 👻 Ghost Note

**Anonymous Social Messaging Platform** - Connect with others through thoughtful, anonymous conversations.

🌐 **Live Demo**: [ghost-note.vercel.app](https://ghost-note.vercel.app/)

## ✨ Features

### 🔐 **Authentication & Security**
- **Secure User Registration** with email verification
- **OTP-based Password Reset** with 10-minute expiry
- **Last Login Tracking** for user analytics
- **Session Management** with NextAuth.js
- **Password Hashing** with bcrypt

### 💬 **Anonymous Messaging**
- **AI-Powered Message Suggestions** using Google Gemini
- **Anonymous Message Sending** to any user
- **Message Management** (view, delete messages)
- **Message Acceptance Toggle** (enable/disable receiving messages)
- **Real-time Message Updates**

### 🎨 **User Experience**
- **Modern UI/UX** with Tailwind CSS and shadcn/ui
- **Responsive Design** for all devices
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Form Validation** with Zod schemas

### 🤖 **AI Integration**
- **Smart Message Suggestions** that are engaging and conversation-worthy
- **Diverse Question Themes**: personal reflection, hypothetical scenarios, creativity
- **Context-Aware Prompts** for better message quality
- **Fallback System** when AI limits are exceeded

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with Credentials provider
- **AI**: Google Generative AI (Gemini 1.5 Pro)
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Vercel
- **Database**: MongoDB Atlas

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Google Cloud account (for Gemini AI)
- Gmail account (for email sending)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ghost-note
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file:
   ```env
   # Database
   MONGODB_URI=your_mongodb_atlas_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Email (Gmail)
   GHOST_NOTE_EMAIL=your_gmail@gmail.com
   GHOST_NOTE_PASS=your_gmail_app_password
   
   # AI (Google Gemini)
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to `MONGODB_URI` in `.env.local`

### Gmail Setup (for email sending)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the app password in `GHOST_NOTE_PASS`

### Google Gemini AI Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `GOOGLE_GENERATIVE_AI_API_KEY`

## 📱 Usage

### For Users
1. **Sign Up**: Create an account with email verification
2. **Get Your Link**: Copy your unique profile link from the dashboard
3. **Share**: Share your link with friends or on social media
4. **Receive Messages**: Get anonymous messages from others
5. **Manage**: View, delete, and control message acceptance

### For Senders
1. **Visit Profile**: Go to any user's Ghost Note profile
2. **Get Suggestions**: Click "Suggest Messages" for AI-generated ideas
3. **Send Message**: Write your own message or use a suggestion
4. **Stay Anonymous**: Your identity remains hidden

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 app directory
│   ├── (auth)/            # Authentication pages
│   ├── (app)/             # Protected app pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── context/              # React context providers
├── helpers/              # Utility functions
├── lib/                  # Database and utility functions
├── models/               # MongoDB schemas
├── schemas/              # Zod validation schemas
└── types/                # TypeScript type definitions
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Email Verification**: OTP-based account verification
- **Session Management**: Secure session handling
- **Input Validation**: Zod schema validation
- **Rate Limiting**: Built-in Next.js protection
- **CORS Protection**: Configured for production

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
GHOST_NOTE_EMAIL=your_production_email
GHOST_NOTE_PASS=your_production_email_password
GOOGLE_GENERATIVE_AI_API_KEY=your_production_ai_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **shadcn/ui** for beautiful UI components
- **Google Gemini** for AI-powered message suggestions
- **MongoDB** for reliable database storage
- **Vercel** for seamless deployment

## 📞 Support

- **Live Demo**: [ghost-note.vercel.app](https://ghost-note.vercel.app/)
- **Issues**: [GitHub Issues](https://github.com/your-username/ghost-note/issues)
- **Email**: [your-email@example.com](mailto:your-email@example.com)

---

**Made with ❤️ for anonymous conversations**
