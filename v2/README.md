# AHCMS v2 — Deployment Guide

## Prerequisites
- Supabase project (free tier works)
- Vercel account
- Discord Developer Portal app
- Railway or Fly.io account (for Python allocator)
- Twilio account (for Critical SMS alerts)

---

## 1. Supabase Setup

### Run migrations
```bash
# install supabase CLI
npm i -g supabase

# link to your project
supabase link --project-ref <your-project-ref>

# push schema + seed
supabase db push
```

Or paste `supabase/migrations/00001_ahcms_v2_schema.sql` then `00002_seed_data.sql` directly into the Supabase SQL editor.

### Create Database Webhook (for notify-staff)
Supabase Dashboard → Database → Webhooks → Create:
- Table: `COMPLAINT`
- Events: `INSERT`
- URL: `https://<your-project>.supabase.co/functions/v1/notify-staff`
- HTTP Method: POST

### Deploy Edge Functions
```bash
supabase functions deploy discord-bot
supabase functions deploy notify-staff
```

Set Edge Function secrets:
```bash
supabase secrets set DISCORD_PUBLIC_KEY=xxx
supabase secrets set DISCORD_BOT_TOKEN=xxx
supabase secrets set DISCORD_COMPLAINTS_CHANNEL_ID=xxx
supabase secrets set TWILIO_ACCOUNT_SID=xxx
supabase secrets set TWILIO_AUTH_TOKEN=xxx
supabase secrets set TWILIO_PHONE_NUMBER=xxx
```

### Set user roles via Supabase Auth
After a user signs up, set their role in `app_metadata`:
```sql
-- For admin
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"admin"')
WHERE email = 'warden@ahcms.edu.in';

-- For student
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"student"')
WHERE email = 'student@ahcms.edu.in';
```

---

## 2. Discord Bot Setup

1. Go to [discord.com/developers](https://discord.com/developers)
2. Create application → Bot → copy **Bot Token**
3. Copy **Application ID** and **Public Key**
4. Under OAuth2 → URL Generator: select `bot` + `applications.commands` scopes
5. Invite bot to your hostel server
6. Set `discord-bot` Edge Function URL as Interactions Endpoint URL in app settings

### Register slash commands
```bash
DISCORD_APP_ID=xxx DISCORD_BOT_TOKEN=xxx npx ts-node scripts/register-discord-commands.ts
```

### Link student Discord IDs
```sql
UPDATE STUDENT_PROFILE SET discord_id = '1234567890' WHERE roll_no = 'DL.BT.U4AID24001';
```

---

## 3. CP-SAT Allocator Service (Railway)

```bash
# from v2/services/allocator/
railway init
railway up
```

Or Fly.io:
```bash
fly launch --dockerfile Dockerfile
fly deploy
```

Copy the deployed URL → `ALLOCATOR_SERVICE_URL` env var.

Set `API_KEY` env var on the service for auth.

---

## 4. Vercel Deployment

```bash
cd v2
vercel --prod
```

Set all environment variables in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ALLOCATOR_SERVICE_URL
ALLOCATOR_SERVICE_API_KEY
ANTHROPIC_API_KEY
DISCORD_PUBLIC_KEY
DISCORD_BOT_TOKEN
DISCORD_APP_ID
DISCORD_COMPLAINTS_CHANNEL_ID
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
```

---

## 5. Local Development

```bash
cd v2
cp .env.example .env.local
# fill in .env.local with your Supabase keys

npm run dev
# → http://localhost:3000
```

---

## Architecture Summary

```
Browser → Next.js (Vercel)
              ↓
         Supabase (Postgres + RLS)
              ↓
    ┌─────────────────────────┐
    │  DB Webhook (INSERT)     │
    └──────────┬──────────────┘
               ↓
    notify-staff Edge Function
    ├── Routes to staff (min load)
    ├── Creates Discord thread
    └── Twilio SMS (Critical only)

Discord → /report /status /my-tickets
       → discord-bot Edge Function
       → Supabase INSERT COMPLAINT

Admin UI → /api/allocate
         → Python CP-SAT service (Railway)
         → solver.py: EF1 + Max-Min fair allocation
         → writes ALLOCATION rows back to Supabase
```

---

## Data Flow: Complaint Lifecycle

```
Student /report → COMPLAINT row created
              → notify-staff webhook fires
              → staff assigned (least-load routing)
              → Discord thread created
              → COMPLAINT_FAIRNESS_LOG entry
Admin resolves → status = resolved → staff.active_tickets decremented
Admin closes  → status = closed
Fairness view → v_complaint_fairness_summary aggregates SLA/equity metrics
```
