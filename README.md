# Hunar.AI - AI Hiring Assistant & Voice Sourcing Co-Pilot

A production-grade recruitment and talent screening web platform powered by **Hunar.AI Voice AI Agents**, **Google Gemini LLM Job Sourcing Engine**, **People Search (Apollo/PDL Schema)**, and **1000-Staff Attendance Operations System Design**.

Built as an end-to-end assignment for the selection process at **Hunar.AI** by **Ritesh Vishwakarma**.

---

## 🌟 Key Features

### 1. 🎙️ AI Hiring Assistant (Voice AI Studio)
- **Live Hunar Gateway Integration**: Fetches active Voice AI agents (`Roy`, `Neha`, `Priya`) from Hunar's neural engine (`/external/v1/agents/`).
- **One-Click Outbound Calling**: Dispatches outbound screening phone calls to candidates with dynamic custom data (`candidate_name`, `company_name`, `candidate_memory`, `role_title`, `job_title`).
- **Real-Time Telemetry & Live Polling**: Tracks call states (`INITIATED` → `RINGING` → `IN_PROGRESS` → `COMPLETED`) every 2 seconds without manual refresh.
- **Waveform & Audio Playback**: Displays live conversation waveform during calls and streams cloud audio recordings upon completion.

### 2. 🔍 People Search & JD Sourcing Engine (Google Gemini 2.5 Flash)
- **Intelligent JD Parsing**: Uses **Google Gemini 2.5 Flash** (with NLP rule-based fallback) to extract role title, seniority, min experience years, required skills, and candidate persona from raw text.
- **People Search Candidate Matching**: Matches candidates using industry-standard talent schemas (Apollo / People Data Labs / Proxycurl), ranking candidates with match scores and fit rationales.
- **One-Click AI Reachout**: Recruiter can immediately trigger Voice AI screening to any candidate profile directly from the search results, with live call status tracking on the candidate card.

### 3. 📊 Candidate Responses CRM Dashboard
- **Consolidated Recruiter Pipeline**: Tracks all outbound reachouts, completed calls, total airtime, and qualification conversion rates.
- **Silent Real-Time Sync**: Background auto-syncs every 3 seconds to reflect call completions and answers without disrupting the UI.
- **Screening Extraction**: Automatically parses candidate responses:
  - Call Summary & Disinterest / Interest reason
  - Current CTC & Expected CTC
  - Notice Period & Joining Timeline
  - Interview Availability & Openness to Relocation
- **Full Audio Recording Vault**: Direct playback of call audio recordings for recruiter audit.

### 4. 🏢 1000-Staff Attendance Architecture (Part 3 Case Study)
- **No-Smartphone System Design**: Solves attendance tracking for 1,000 staff across 100 remote sites daily using only basic feature phones (Nokia 105, JioPhone, landlines).
- **Three Architectural Pillars**:
  1. *Toll-Free Voice AI Agent (Hunar)*: Multi-lingual IVR with voice biometrics and employee PIN verification.
  2. *Telecom Cell-Tower Triangulation (LBS)*: Carrier-level location verification ensuring physical presence on site.
  3. *LLM Anomaly Engine*: Flags proxy check-ins and auto-triggers reminder calls for missed clock-ins.
- **Interactive Simulator**: Live simulator to test check-in calls from remote warehouse locations.

---

## 🏗️ System Architecture & Data Sources

```
[ Recruiter Web App (React 19 + Tailwind v3) ]
       │                         │
       │ (REST / Real-time Sync) │
       ▼                         ▼
[ Express.js + TypeScript Backend API (Port 5000) ]
       ├── Gemini 2.5 Flash (JD Parsing & Skill Extraction)
       ├── People Search Engine (Apollo / PDL Candidate Matching)
       ├── MongoDB & Redis (Call Records & State Persistence)
       └── Hunar Voice AI Gateway (api.voice.hunar.ai)
             │
             ├── Outbound Telephony (Plivo / Twilio Carrier)
             ├── Neural Speech Recognition (ASR)
             ├── Conversational LLM Engine
             └── Cloud Audio Storage & Structured Result Webhooks
```

### 📊 Real APIs vs. Simulated Schemas Breakdown

To ensure full transparency on how data flows across the platform:

| Component | Status / Integration Type | Implementation Details |
|---|---|---|
| **Hunar Voice AI Agents** | 🟢 **100% Real API** | Live calls to `https://api.voice.hunar.ai/external/v1/agents/`. Pulls real active agents (`Roy`, `Neha`, `Priya`). |
| **Outbound Calling Telephony** | 🟢 **100% Real API** | Live outbound telephone calls dispatched to candidate mobile numbers via Hunar Gateway. |
| **Audio Recordings & Telemetry** | 🟢 **100% Real API** | Cloud audio recordings (`recording_url`) and live statuses streamed directly from Hunar AWS S3 / Plivo storage. |
| **Conversation Answers Extraction** | 🟢 **100% Real API** | Structured screening answers (Summary, Expected CTC, Notice period, Relocation) parsed by Hunar Voice AI. |
| **Job Description Parsing** | 🟢 **100% Real API** | Uses **Google Gemini 2.5 Flash** REST API to extract skills and criteria, with a resilient rule-engine fallback. |
| **People Search Candidate Pool** | 🟡 **Schema-accurate Mock Pool** | Real Apollo.io / PDL APIs require paid enterprise subscriptions ($500+/mo). Modeled on standard Apollo/PDL JSON schema with 6 realistic candidate profiles (top candidate: Ritesh Vishwakarma). |
| **1000-Staff Attendance System** | 🟡 **System Design Simulator** | Assignment Part 3 is a theoretical architectural case study. Features an interactive simulator mimicking the proposed IVR check-ins. |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v3, Lucide React, Axios, React Router v7.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB), Redis, dotenvx.
- **AI & Voice Services**:
  - **Hunar.AI Voice AI Engine**: Outbound speech agents, telemetry, call results.
  - **Google Gemini 2.5 Flash**: Automated JD understanding & skill extraction.

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

# Copy .env.example to .env and verify variables:
# HUNAR_API_KEY=your_hunar_api_key
# GEMINI_API_KEY=your_gemini_api_key
cp .env.example .env

# Run development server with TypeScript & nodemon
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Run Vite dev server
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck & service status |
| `GET` | `/api/agents` | List active Hunar Voice AI agents |
| `GET` | `/api/agents/:id` | Get specific agent details |
| `POST` | `/api/calls/trigger` | Dispatch outbound Voice AI call |
| `POST` | `/api/calls/bulk` | Dispatch batch outbound calls |
| `GET` | `/api/calls/:id` | Get real-time call status, recording, and answers |
| `GET` | `/api/calls` | List call history with filters |
| `POST` | `/api/sourcing/parse-jd` | Parse raw JD using Gemini 2.5 Flash |
| `POST` | `/api/sourcing/search` | Search candidates matching skills & role |
| `POST` | `/api/sourcing/reachout` | Trigger one-click Voice AI call to candidate |

---

## 👤 Author

**Ritesh Vishwakarma**  
- Candidate for **Hunar.AI**
- Mobile: `+91 9329586707`
- GitHub: [github.com/riteshvish02/hunarAi](https://github.com/riteshvish02/hunarAi)

