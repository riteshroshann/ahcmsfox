# Topology & Migrations

Deploying a sovereign state machine requires exact orchestration. The system spans multiple providers, executing a unified topology.

## Infrastructure Topology

1. **Vercel**: Edge-caches the Next.js static payloads and streams Server Components.
2. **Supabase (AWS / Fly.io)**: Hosts the PostgreSQL transactional core and the Deno Edge Isolates (`discord-bot`, `notify-staff`).
3. **Railway / Persistent Compute**: Hosts the Python solvers (`solver.py` and `tune.py`). These cannot execute in Deno Edge due to their reliance on C++ bindings (OR-Tools) and multi-minute CPU execution constraints.
4. **Discord / Twilio APIs**: Act as peripheral I/O boundaries.

## The Database Migration Strategy

We do not use ORM-based migrations (e.g., Prisma). The system is too dependent on low-level PostgreSQL features (Triggers, `pg_net`, `pgcrypto`) that ORMs fail to represent elegantly. We manage state transitions via raw SQL migrations.

### Schema Initialization
Migration `00001_ahcms_v2_schema.sql` establishes the mathematical boundaries:
- Instantiates ENUMs for strict typing.
- Defines core tables (`HOSTEL`, `ROOM`, `STUDENT_PROFILE`, `COMPLAINT`).
- Enforces relational cascades.

### Trigger Hooks
Migration `00003_webhook_and_users.sql` establishes the asynchronous event bus:
```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```
This migration is critical. Without `pg_net`, the database is blind and cannot communicate over the network. The trigger `trg_notify_staff` is established here to fire the POST request upon `COMPLAINT` insertion.

## Local Setup for Open Source Contributors

To spin up the matrix locally:

1. **Initialize the Database**:
   ```bash
   npx supabase start
   npx supabase migration up
   ```

2. **Deploy the Edge Layer**:
   ```bash
   npx supabase functions deploy discord-bot --no-verify-jwt
   npx supabase functions deploy notify-staff --no-verify-jwt
   ```
   *Note: `--no-verify-jwt` is mandatory. The Discord bot verifies payloads cryptographically via Ed25519, not via PostgREST JWTs.*

3. **Populate the State**:
   Execute the `seed_200_students.mjs` script to flood the local database with heavily randomized student nodes, enabling the allocation solver to simulate high-entropy assignments.
