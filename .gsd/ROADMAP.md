# ROADMAP.md

> **Current Phase**: Phase 1
> **Milestone**: v1.0 — Demo-Ready Deployment

## Must-Haves (from SPEC)
- [/] Persistent auth via Supabase
- [ ] Frontend ↔ Backend integration (all pages)
- [ ] AI Advisor with Gemini
- [ ] Deployable URL

## Phases

### Phase 1: Foundation — Supabase Auth + Data Persistence
**Status**: 🔵 In Progress
**Objective**: Replace in-memory Map() storage with Supabase for auth (register/login). Seed demo data. Ensure server survives restarts.
**Requirements**: REQ-01, REQ-02

### Phase 2: Wire Frontend to Backend
**Status**: ⬜ Not Started
**Objective**: Connect Dashboard, Timeline, ConsentPage, ConnectSources, and TrustScore pages to real backend API endpoints. Add missing backend routes (timeline CRUD). Replace all hardcoded/mock data with API calls.
**Requirements**: REQ-03

### Phase 3: AI Advisor with Gemini
**Status**: ⬜ Not Started
**Objective**: Integrate Google Gemini into the Python AI service for real chat and proactive insights. Wire frontend AIAdvisor.jsx to backend, backend to AI service.
**Requirements**: REQ-04

### Phase 4: Deploy + Polish
**Status**: ⬜ Not Started
**Objective**: Deploy all 3 services (frontend to Vercel/Netlify, backend to Render, AI service to Render). Fix any deployment-specific issues. Final smoke test.
**Requirements**: REQ-05
