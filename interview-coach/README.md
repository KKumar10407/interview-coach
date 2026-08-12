# Interview Coach

AI-powered mock technical interviews with structured, rubric-based feedback
instead of generic "good job!" responses.

## What's here

- `backend/` — Flask + SQLAlchemy API. Generates interview questions and
  scores answers using Claude's structured outputs (Pydantic schema →
  guaranteed-shape JSON, not manually parsed text).
- `frontend/` — Next.js app. Pick a topic, answer a question, see scores.

This is a Day 1 skeleton, not a finished product. The whole point is you
have something running today, then you build the Week 2/3 features on top:
timed sessions, score-history dashboard, deploy.

## Setup (Windows / Git Bash)

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Git Bash on Windows uses this path, not venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and paste in your real Anthropic API key.

```bash
python run.py
```

Backend should now be running at `http://localhost:5000`. Test it:

```bash
curl http://localhost:5000/api/health
```

You should see `{"status": "ok"}`. If Flask installs into your global Python
instead of the venv again like it did with micro-blog, check that
`(venv)` actually appears in your prompt AND run `where python` (Git Bash)
to confirm the path points into `backend/venv/Scripts/python.exe` — not
`AppData/Local/Programs/Python`.

### 2. Frontend

Open a **second** terminal (keep the backend running in the first one):

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`.

### 3. Try it

1. Type a topic (e.g. "arrays and hashmaps") and hit "Start mock interview"
2. You'll be shown a real generated question
3. Type an answer, submit, and get back a real correctness score,
   communication score, and specific feedback — all from Claude's structured
   output, not free-text parsing

## Database note

This ships with SQLite by default (zero setup, one file, works
immediately). Swap `DATABASE_URL` in `.env` to a Postgres connection string
whenever you're ready to deploy — no code changes needed, SQLAlchemy
handles both.

## What to build next (see the Week 2/3 plan)

- [ ] Timer on the question (countdown + auto-submit)
- [ ] `GET /api/questions/<id>` route so refreshing the session page doesn't
      lose the question
- [ ] Session history page — list past sessions, chart scores over time
      (this is your "data visualization" resume checkbox)
- [ ] Deploy: frontend → Vercel, backend + Postgres → Render
- [ ] Write the real README with a GIF/screenshot before you call it done
