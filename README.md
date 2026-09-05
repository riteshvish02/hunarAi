# Hunar.AI - AI Hiring Assistant & Voice Sourcing Co-Pilot

A production-grade recruitment and talent screening web platform powered by **Hunar.AI Voice AI Agents**, **People Search Integration**, and **Attendance Operations System Design**.

Built as an end-to-end assignment for the selection process at **Hunar.AI**.

---

## 🌟 Key Features

### 1. 🎙️ AI Hiring Assistant (Voice AI Agents)
- **Live Hunar Voice Integration**: Seamlessly pulls active voice agents from Hunar's neural engine (`/external/v1/agents/`).
- **Outbound Voice Calling**: Recruiter can dispatch AI voice calls to candidate phone numbers with custom variables (`role_title`, `job_title`, `key_requirements`).
- **Real-Time Telemetry & Audio Playback**: Tracks call states (`INITIATED`, `RINGING`, `IN_PROGRESS`, `COMPLETED`), displays live waveforms, and plays AWS S3/Plivo audio recordings.
- **Conversation Extraction**: Auto-extracts candidate answers (Notice period, Current CTC, Expected CTC, Interview Availability, and Fit Summary).

### 2. 🔍 People Search & Reachout (In Progress - Feature 2)
- Match candidates based on pasted Job Descriptions (JD).
- Candidate screening scorecard and one-click Voice AI outreach.

### 3. 📊 Candidate Responses CRM (In Progress - Feature 3)
- Consolidated recruitment pipeline with audio sentiment analysis and qualification filters.

### 4. 🏢 1000-Staff Attendance Architecture (In Progress - Feature 4)
- Offline-first system design for tracking 1000 staff across 100 locations daily without smartphone apps.

---

## 🛠️ Tech Stack

- **Frontend**: React.js 19, Vite, Tailwind CSS v3, Lucide React, Axios, React Router v7.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB), Redis.
- **AI Infrastructure**: Hunar.AI Voice API (`https://api.voice.hunar.ai/external/v1/`).

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/riteshvish02/hunarAi.git
cd hunarAi
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy .env.example to .env and configure your HUNAR_API_KEY
cp .env.example .env

# Run development server
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.
