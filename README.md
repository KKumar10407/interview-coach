# Interview Coach

Heya! 👋

This is an AI powered mock for technical interviews with structured rubric-based feedback instead of generic “nice work!” responses.

Live Demo: [https://interview-coach-ecru.vercel.app/]

Note: the backend runs on a free-tier host that can take 30–60 seconds to respond on the very first request after being idle. Subsequent requests are fast. An UptimeRobot is used to keep the backend active every 5 minutes but do be patient in case if the questions don’t generate immediately.



## What does it do?

The coach will allow you to pick a topic and difficulty level before generating a realistic interview question via the Gemini API. You can also choose for your session to be timed (Count Up, Count Down, or no timer and after you submit the question, your answer is scored on both a correctness and communication scale of 10. Specific, actional feedback is also provided rather than just stating if your answer is valid or not.

Every session is saved! You’ll be able to view your past questions, answers, and feedback by going to session history in the home page.

**TEMPORARY ADJUSTMENT: Until auth factor is implemented, sessions begun by any user will be added to the database, which means your sessions will not be the only sessions present in history.**

## Tech stack

**Backend:** Flask, SQLAlchemy, PostgreSQL, Gemini API (`google-genai`) with Pydantic-validated structured output, Gunicorn

**Frontend:** Next.js (App Router), React, Tailwind CSS

**Infrastructure:** Render (backend + Postgres), Vercel (frontend), UptimeRobot




