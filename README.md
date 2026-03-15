# 🌐 NexusLife — Universal Digital Passport

A unified digital identity platform where users store verified records from education, healthcare, finance, and employment in one place. Users control exactly what data institutions can access and for how long.

## ✨ Features

- **Unified Digital Identity** — Store verified credentials across life domains
- **Consent-Based Data Sharing** — Approve/deny institution data requests with field-level control
- **Life Journey Timeline** — Visual milestones across education, jobs, health, and finance
- **Contextual Data Cards** — Generate verified mini-summaries for sharing
- **AI Life Advisor** — GPT-4/Gemini powered cross-domain insights
- **Cross-Domain Trust Score** — Dynamic score calculated from all life domains (0–100)

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, TailwindCSS, Framer Motion, Recharts, Zustand |
| Backend | Node.js, Express, Supabase (PostgreSQL), Redis, JWT, AES-256 |
| AI Service | Python FastAPI, LangChain, OpenAI/Gemini API, scikit-learn |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Redis (optional, for consent tokens)
- Supabase account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/SamarthBurkul/NexusLife.git
cd NexusLife
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env   # Edit with your values
npm run dev             # http://localhost:5173
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit with your Supabase keys
npm run dev             # http://localhost:5000
```

### 4. Setup AI Service
```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Edit with your API keys
uvicorn app.main:app --reload --port 8000
```

### 5. Run All Services (from root)
```bash
npm run dev
```

## 📁 Project Structure

```
NexusLife/
├── frontend/          # React 19 + Vite + TailwindCSS
├── backend/           # Node.js + Express + Supabase
├── ai-service/        # Python FastAPI + LangChain
├── docker-compose.yml
└── README.md
```

## 🎨 Design Theme
- Background: `#0A0D1F` (Dark Navy)
- Primary: `#00C9A7` (Teal)
- Secondary: `#7C6EF5` (Purple)
- Accent: `#FFB800` (Gold)

## 📄 License
MIT
