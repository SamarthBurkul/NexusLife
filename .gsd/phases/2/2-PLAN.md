---
phase: 2
plan: 2
wave: 1
---

# Plan 2.1: Wire Frontend Details + AI Advisor

## Objective
Wire the remaining frontend pages and connect the Gemini AI API so that the entire product is functional with real database values instead of mock data.

## Context
- Phase 1 successfully connected the Supabase db and resolved the ID mismatches between the frontend mock state and the backend DB.
- Task 2.0 (Urgent Consent Bug) was completely fixed via `consentEngine.js` rewrite and updating `ConsentPage.jsx`.

## Tasks

<task type="auto">
  <name>Task 2.1: Dashboard Wiring</name>
  <files>frontend/src/pages/Dashboard.jsx</files>
  <action>
    Fetch from:
    - GET /api/trustscore
    - GET /api/consent/requests
    - GET /api/sources
    Replace the hardcoded `78/100`, `3` active consents, and `4` connected sources with data from these endpoints.
  </action>
  <verify>Load Dashboard — metrics match the seeded demo data.</verify>
</task>

<task type="auto">
  <name>Task 2.2: Timeline CRUD Implementation</name>
  <files>
    backend/src/routes/timeline.routes.js
    backend/server.js
    frontend/src/pages/Timeline.jsx
  </files>
  <action>
    1. Create `timeline.routes.js`:
       - GET /api/timeline/events (fetch from `life_events` where user_id = req.user.id)
       - POST /api/timeline/events (insert new record)
    2. Register route in `server.js` or `app.js` (under /api/timeline)
    3. Update `Timeline.jsx` to fetch using a new `timelineService.js` (or via `api.js` directly) on mount instead of hardcoded data.
  </action>
  <verify>Load Timeline page — shows the 3 seeded events instead of mock events.</verify>
</task>

<task type="auto">
  <name>Task 2.3: AI Advisor Gemini Integration</name>
  <files>
    ai-service/app/services/lifeAdvisor.py
  </files>
  <action>
    1. Wire Gemini: use `google.generativeai` with `gemini-2.0-flash-exp` model.
    2. Read `GOOGLE_API_KEY` from `.env`.
    3. Make `generate_insights` request 5 json insights based on user Profile scores. 
    4. Implement `chat` logic to append user history and get responses natively.
    5. Handle fallbacks cleanly.
  </action>
  <verify>Use the AI chat interface on frontend — receives a cohesive AI response instead of the mocked payload.</verify>
</task>

<task type="auto">
  <name>Task 2.4: DataCards Profile Preview</name>
  <files>frontend/src/pages/DataCards.jsx</files>
  <action>
    - Fetch `/api/user/profile` (or decode from auth JWT) to replace the `••••••` masked fields with real user profile data (name, email, etc). 
  </action>
  <verify>Checking DataCards displays 'Arjun Sharma' for the seeded demo user name.</verify>
</task>

## Success Criteria
- [ ] Dashboard displays true request counts and real DB metrics.
- [ ] Timeline fetches from API. Adding new event posts to DB.
- [ ] Asking a question in AI Advisor yields a LLM generation via Gemini.
- [ ] DataCards shows the real logged-in user name.
