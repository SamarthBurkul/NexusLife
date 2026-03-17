# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
NexusLife is a Unified Digital Passport — a single platform where Indian citizens store verified records from education, health, finance, and employment; control who can access their data via a field-level consent engine; and receive AI-powered life insights. The target is a demo-ready deployed version for hackathon evaluation.

## Goals
1. Persistent data via Supabase — users, profiles, events, consents survive restarts
2. Frontend ↔ Backend integration — all pages fetch real data from backend APIs
3. AI Advisor powered by Gemini — real chat and proactive insights
4. Deployable on Render/Railway with working demo link

## Non-Goals (Out of Scope)
- Real OAuth integration with DigiLocker/ABHA/AA APIs
- Production-grade security audit
- Mobile app
- Admin dashboard
- Real Aadhaar eKYC or OTP verification

## Users
Indian citizens who want a single dashboard aggregating their education, health, finance, and employment records with AI-powered insights.

## Constraints
- Deadline: March 18 2026 (TOMORROW)
- Stack: React+Vite, Node+Express, Python+FastAPI (already built)
- Database: Supabase (already provisioned at eumkelnpbuwigywcnevc.supabase.co)
- LLM: Google Gemini (API key available)
- Must not break existing UI — visual layer is 80% done

## Success Criteria
- [ ] Register + Login persists across server restarts (Supabase)
- [ ] Dashboard shows real trust score, pending consents, connected sources
- [ ] Consent approve/deny works end-to-end with real data
- [ ] Timeline shows real events and allows adding new ones
- [ ] AI Advisor returns Gemini-powered responses
- [ ] App deployable with working URL
