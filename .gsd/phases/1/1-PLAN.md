---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Supabase Auth — Replace In-Memory Map with Database

## Objective
Replace the `new Map()` user storage in `auth.routes.js` with real Supabase queries so users persist across server restarts.

## Context
- .gsd/SPEC.md
- backend/src/config/db.js — already creates Supabase client
- backend/src/routes/auth.routes.js — currently uses `const users = new Map()`
- backend/database/schema.sql — already has users + user_profiles tables

## Tasks

<task type="auto">
  <name>Run schema.sql in Supabase</name>
  <files>backend/database/schema.sql</files>
  <action>
    Execute the schema.sql in the Supabase SQL editor to create all 7 tables.
    The user needs to run this manually in the Supabase dashboard.
    Provide the exact SQL to paste.
  </action>
  <verify>Supabase dashboard shows all 7 tables in the database</verify>
  <done>Tables users, user_profiles, connected_sources, life_events, consent_requests, consent_grants, data_cards, audit_logs exist in Supabase</done>
</task>

<task type="auto">
  <name>Replace Map() with Supabase in auth.routes.js</name>
  <files>backend/src/routes/auth.routes.js</files>
  <action>
    1. Remove `const users = new Map()`
    2. POST /register:
       - INSERT into users(email, phone, full_name, password_hash, aadhaar_hash)
       - INSERT into user_profiles(user_id) with default scores (0s)
       - Sign JWT with the Supabase-generated UUID
    3. POST /login:
       - SELECT * FROM users WHERE email = $email
       - Compare bcrypt hash
       - Return JWT on success
    4. Keep verify-otp as mock (any 6-digit code)
    - DO NOT change the JWT payload shape — AuthContext.jsx depends on it
    - Keep encryptData for aadhaar
  </action>
  <verify>
    curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"fullName":"Test","email":"test@test.com","password":"test123","phone":"9999999999"}'
    # Returns { success: true, token: "...", user: {...} }
    # Restart server, then:
    curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123"}'
    # Returns { success: true, token: "..." }
  </verify>
  <done>Register creates a row in Supabase users table. Login reads from Supabase. Data survives server restart.</done>
</task>

<task type="auto">
  <name>Seed demo user via Supabase SQL</name>
  <files>N/A — SQL to run in Supabase dashboard</files>
  <action>
    Provide an INSERT script the user pastes into Supabase SQL editor:
    - 1 user: demo@nexuslife.com / Demo@123 (bcrypt pre-hashed)
    - user_profile: trust_score=78, edu=22, fin=20, health=18, emp=18
    - 3 life_events for the demo user
    - 2 consent_requests (pending) for the demo user
  </action>
  <verify>Login as demo@nexuslife.com with password Demo@123 returns success</verify>
  <done>Demo user exists in Supabase with profile, events, and consent requests</done>
</task>

## Success Criteria
- [ ] Server starts without crash
- [ ] Register creates user in Supabase (verified via dashboard)
- [ ] Login returns JWT for existing user
- [ ] User survives server restart
- [ ] Demo user login works: demo@nexuslife.com / Demo@123
