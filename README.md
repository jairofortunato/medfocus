# Med Estudo Focado 🏥📚

A Brazilian medical exam study platform focused on **ENARE 2023** (Exame Nacional de Revalidação de Diplomas Médicos) preparation. Study smarter with multiple-choice questions, AI-generated explanations, Pomodoro timer, and progress tracking.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-4.5-orange?style=flat-square)

## ✨ Features

- **96 ENARE 2023 Questions** with complete explanations
- **AI-Generated Explanations** powered by GPT-4o
- **Pomodoro Timer** (25 minutes) for focused study sessions
- **Progress Tracking** with real-time statistics
- **Statistics by Medical Specialty** (Cardiologia, APS, Obstetrícia, etc.)
- **Glassmorphism UI** with smooth animations
- **Answer Locking** - review your mistakes
- **LocalStorage Persistence** - pick up where you left off

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for question processing only)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd medestudofocado

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| AI | OpenAI GPT-4o |
| Data Processing | Python + pdfplumber |

## 📁 Project Structure

```
medestudofocado/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ExamApp.tsx        # Main app wrapper
│   ├── exam/              # Question components
│   ├── header/            # Header components
│   ├── timer/             # Timer components
│   └── statistics/        # Statistics components
├── lib/                   # Utilities
│   ├── types.ts           # TypeScript types
│   ├── exam-store.ts      # Zustand store
│   └── utils.ts           # Helper functions
├── data/                  # Question data
│   └── questions.json     # ENARE 2023 questions
├── medpassei/             # Data processing
│   └── pdf_to_json.py     # PDF extractor
└── public/                # Static assets
    └── background.png     # Background image
```

## 🎨 Design System

The app uses a custom **glassmorphism** design with:

- **Frosted glass cards** with backdrop blur
- **Gradient accents** (pink → purple)
- **Floating background blobs** with smooth animations
- **Responsive layout** optimized for mobile and desktop

## 🧠 How It Works

### State Management

Uses **Zustand** with localStorage persistence:

```typescript
// Global state
- questions: Question[]
- currentQuestionIndex: number
- userAnswers: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>
- timer: { timeRemaining: number, isRunning: boolean }
- currentTab: 'timer' | 'stats'

// Computed values
- getCorrectCount()
- getAnsweredCount()
- getProgressPercentage()
- getTagStatistics()
```

### Answer Locking

Once you select an answer, it's **locked** - you can't change it. This encourages thoughtful answers and lets you review your mistakes with the AI explanation.

### Pomodoro Timer

25-minute focused study sessions with:
- Start/Pause/Reset controls
- Visual pulse animation when running
- Alert at 0:00 to remind you to take a break

### Statistics by Tag

Questions are grouped by medical specialty:
- **Total**: Total questions with this tag
- **Respondidas**: How many you've answered
- **Acertos**: Your accuracy percentage
- Color-coded: 🟢 Green (≥70%) | 🟡 Amber (≥50%) | 🔴 Red (<50%)

## 📊 Data Processing

### Extract Questions from PDF

```bash
python medpassei/pdf_to_json.py
```

Processes `medpassei/ENARE 2023.pdf` and extracts:
- Question numbers
- Medical specialty tags
- Question text
- Answer options (A-E)
- Correct answers

### Generate AI Explanations

```bash
# Set your OpenAI API key
echo "OPENAI_API_KEY=sk-..." > .env

# Generate explanations
python generate_explanations.py
```

Uses GPT-4o to generate detailed explanations for each question, including:
- Why the correct answer is right
- Why other options are wrong
- Key medical concepts

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Lint code
```

### Environment Variables

Create a `.env` file for Python scripts:

```env
OPENAI_API_KEY=sk-your-key-here
```

Next.js doesn't require environment variables for normal operation.

## 📱 Responsive Design

The app is fully responsive:

- **Desktop**: Full-width layout with large cards
- **Mobile**: Optimized touch targets, stacked navigation
- **Tablet**: Adaptive layout

## 🧪 Testing Checklist

- [ ] Question navigation (prev/next/dropdown)
- [ ] Answer selection locks correctly
- [ ] Visual feedback (green/red)
- [ ] Explanations display inline
- [ ] Progress bar updates
- [ ] Timer start/pause/reset
- [ ] Tab switching (Timer ↔ Statistics)
- [ ] Statistics calculate correctly
- [ ] LocalStorage persistence
- [ ] Responsive on mobile

## 📝 Migration Notes

This project was **migrated from vanilla JavaScript to Next.js + TypeScript** on 2026-02-24.

**Before**: Vanilla JS + Node.js HTTP server
**After**: Next.js 14 + TypeScript + Tailwind + Zustand

**Why migrate?**
- ✅ Type safety with TypeScript
- ✅ Modern React with hooks
- ✅ Better state management (Zustand)
- ✅ Maintainable styling (Tailwind)
- ✅ Optimized performance (Next.js)
- ✅ Better developer experience

The legacy vanilla JS implementation is preserved in `/legacy` folder.

## 📄 License

This project is for educational purposes - ENARE exam preparation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for Brazilian medical students preparing for ENARE**
