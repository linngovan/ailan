<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🚀 AI Language Assistant

An intelligent language learning assistant powered by Google Gemini, helping you with translations, grammar corrections, and word meanings.

## ✨ Features

- **📝 Translation & Checking**: Translate Vietnamese to English with multiple context-aware options
- **✏️ Grammar Correction**: Analyze and correct English grammar with detailed explanations
- **📚 Word Meaning Check**: Get comprehensive word definitions, pronunciations, and example sentences
- **💬 Interactive Follow-up Chat**: Ask follow-up questions about any result in real-time
- **🔊 Audio Pronunciation**: Hear both UK and US English pronunciations (Word Meaning feature)
- **🔒 Secure API Architecture**: API key protected with serverless proxy (never exposed to client)

## 📚 Documentation

- **[Security Guide](SECURITY.md)** - Learn about our security implementation
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step Vercel deployment instructions


## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI API**: Google Gemini 2.5 Flash
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js 16+
- A Gemini API key from [Google AI Studio](https://ai.studio)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

#### For Local Development

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environment**: Production, Preview, Development (select all)

**🔒 Security Note**: The API key is now securely stored on the server-side only. It will never be exposed to the client or visible in browser DevTools.

### 3. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

This generates an optimized production build in the `dist` folder.

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set the `GEMINI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

The serverless API will automatically handle all Gemini API calls securely.


## 🏗️ Project Structure

```
ailan/
├── components/              # React components
│   ├── common/             # Reusable UI components
│   ├── TranslateChecker.tsx
│   ├── GrammarCorrector.tsx
│   └── WordMeaningChecker.tsx
├── services/               # API integration
│   └── geminiService.ts
├── data/                   # Static data
│   └── wordlist.ts
├── hooks/                  # Custom React hooks
│   └── useChat.ts
├── App.tsx                 # Main application
├── types.ts               # TypeScript definitions
├── constants.ts           # Application constants
└── utils.ts              # Utility functions
```

## 🎯 Key Improvements

### Code Quality
- ✅ Centralized constants management (`constants.ts`)
- ✅ Custom hooks for logic reuse (`useChat.ts`)
- ✅ Comprehensive error handling with user-friendly messages
- ✅ API key validation on startup
- ✅ Better TypeScript type safety

### Performance
- ✅ Component memoization with `React.memo`
- ✅ Debounced input handling (200ms)
- ✅ Optimized state management
- ✅ Proper cleanup of event listeners and timeouts

### User Experience
- ✅ Real-time word suggestions with autocomplete
- ✅ Multiple translation options for different contexts
- ✅ Detailed grammar explanations in Vietnamese
- ✅ Comprehensive word definitions with example sentences
- ✅ Smooth loading states and error handling

## 📚 API Reference

### Translation Service
```typescript
translateAndCheck(vietnameseText: string): Promise<TranslateResult>
```
Translates Vietnamese text to English with context-specific options.

### Grammar Service
```typescript
correctGrammar(englishText: string): Promise<GrammarCorrectionResult>
```
Analyzes English sentences and provides corrections with explanations.

### Word Meaning Service
```typescript
getWordMeaning(englishWord: string): Promise<WordMeaningResult>
```
Provides comprehensive word definitions, pronunciations, and examples.

### Follow-up Chat Service
```typescript
askFollowUp(contextPrompt: string, chatHistory: ChatMessage[], newQuestion: string): Promise<string>
```
Enables interactive Q&A about any result.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

**linnv** - [GitHub](https://github.com/linngovan)

---

**View your app in AI Studio**: [https://ai.studio/apps/drive/1NBP4MkzefN6KK9YzNjV69sDomrv5JJe9](https://ai.studio/apps/drive/1NBP4MkzefN6KK9YzNjV69sDomrv5JJe9)
