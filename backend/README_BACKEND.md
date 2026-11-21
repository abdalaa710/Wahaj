# WAHAJ — Official Scientific Backend API (FastAPI + SQLite)

**Platform:** WAHAJ (وهّاج) — Understanding Fire in Microgravity  
**Dataset Baseline:** NASA Physical Sciences Informatics (PSI) Handoff v0.1 (Phase 4.1.1 Verified Snapshot v1.2)  
**Database File:** `wahaj_official.db` (SQLite 3)

---

## 🚀 How to Run the Server (طريقة التشغيل)

### Option 1: Double Click (بنقرة زر)
Double click `RUN_BACKEND.bat` on your Desktop.

### Option 2: Terminal / Command Prompt
```bash
cd "c:\Flame_in_Freefall_Data\backend"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 🌐 Interactive Swagger API Documentation
Once the server is running, open your browser at:  
👉 **http://127.0.0.1:8000/docs**

---

## 📡 API Endpoints Reference

### 1. Platform Information
- `GET /` : Server status, platform version, and live dataset counts.

### 2. NASA Investigations
- `GET /api/investigations` : Retrieve all 7 curated NASA flight investigations (FLEX, BASS-II, SAFFIRE-I, SAFFIRE-II, SAME-R, ACME CFI-G, SPICE) with run counts.
- `GET /api/investigations/{psi_id}` : Full investigation details, registered source files (SHA-256), and sample runs.

### 3. Flight Experimental Runs & Outcomes
- `GET /api/runs` : 58 audited flight experimental runs joined 1:1 with measured physical outcomes (burn duration, burning rate, extinction diameter, flame spread rate, toxic CO emissions).

### 4. Scientific Analytical Views
- `GET /api/analytics/droplets` : FLEX (PSI-69) Droplet combustion, burning rates, and extinction limits.
- `GET /api/analytics/solids` : BASS-II (PSI-25) & SAFFIRE (PSI-98, 99) Solid flammability, airflow velocities, and toxic CO emissions.
- `GET /api/analytics/cool-flames` : ACME CFI-G (PSI-159) Cool flame observations, temperatures, and extinction modes.

### 5. Scientific Audit & Data Lineage (Zero Silently Dropped Records)
- `GET /api/audit/rejected` : 11 audited rejected records with diagnostic violation stages and logs.
- `GET /api/audit/sources` : 43 registered source files with cryptographic SHA-256 hashes.

### 6. Spacecraft Safety & Simulation
- `GET /api/safety/materials` : Flammability safety rankings for Nomex, Silicone, SIBAL, and PMMA under microgravity vs 1-g.
- `POST /api/simulation/predict` : Predicts flame geometry (spherical vs buoyant), spread rate, temperature, and soot level based on fuel, gravity, airflow, and O₂.

### 7. AI Scientific Assistant
- `POST /api/ai/research-assistant` : Evidence-backed answers citing specific NASA PSI publications and datasets.
