# WAHAJ (وهّاج) — Understanding Fire in Microgravity

**WAHAJ (وهّاج)** is a scientific platform developed for the **NASA Space Apps Challenge**. It provides research-grade tools to explore, analyze, and simulate combustion kinetics and flame dynamics in the microgravity environment of space.

---

## Key Features

1. **Investigation Explorer**: Browse 7 curated NASA Physical Sciences Informatics (PSI) flight investigations (FLEX, SAFFIRE-I, SAFFIRE-II, BASS-II, ACME CFI-G, SPICE, SAME-R).
2. **Interactive Research Dashboard**: Analyze real experimental data across fuel types, oxygen concentrations, and gravity levels.
3. **Multi-Criteria Comparison & Ranking**: Compare investigations using radar charts and evaluate spacecraft materials by custom safety weights.
4. **AI-Powered NL2SQL Chatbot**: A two-stage Natural Language to SQL retrieval system querying official SQLite records and synthesizing verified, grounded answers.
5. **Bilingual Support & Dark Mode**: Seamless Arabic and English interfaces with orbital theme switching.

---

## System Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend API**: FastAPI, Uvicorn, SQLite3, Groq / LLM Integration.
- **Database**: NASA PSI combustion records (investigations, measured physical outcomes, cryptographic source files).

---

## Quickstart Guide

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env
# Add your GROQ_API_KEY inside backend/.env
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
Backend API docs available at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend web application runs at: `http://localhost:5173/`

---

## Data Provenance & Lineage
All data is curated from authentic NASA Physical Sciences Informatics (PSI) flight records, including verified SHA-256 source files.
