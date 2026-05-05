# System Architecture

The architecture of AHCMS is designed around a unified, immutable source of truth (PostgreSQL) interacting with transient, stateless compute nodes. 

## The Headless Execution Pipeline

Traditional architectures tightly couple the frontend UI to the backend logic. AHCMS decouples human interaction from state mutation by treating all clients (Next.js web UI, Discord Bot) as interchangeable peripheral interfaces.

### Discord Interaction Webhooks

Discord interactions operate on a Push model. When a user executes `/report`, Discord sends an HTTP POST request to our Edge Function. 

Discord enforces a hard 3.0-second timeout. To satisfy this, the Edge Function is deployed on Deno Deploy.
1. **Cryptographic Verification**: Every payload must be verified using Ed25519 signatures. The function computes the signature over `timestamp + body` and drops unauthorized requests in `O(1)` time.
2. **JWT Bypass**: Because the request originates from Discord (not an authenticated frontend client), we bypass PostgREST's row-level security (RLS) by instantiating the Supabase client with the `SERVICE_ROLE_KEY`.

### Asynchronous Event Bus (PostgreSQL Triggers)

Instead of the API layer orchestrating downstream effects (which risks partial failures if the API crashes mid-execution), AHCMS uses the database itself as an event bus.

When a record is inserted into the `complaint` table, a PostgreSQL `AFTER INSERT` trigger fires.

```sql
CREATE TRIGGER trg_notify_staff
AFTER INSERT ON complaint
FOR EACH ROW
EXECUTE FUNCTION notify_staff_webhook();
```

This trigger utilizes the `pg_net` extension to emit an asynchronous HTTP POST request to a secondary Edge Function (`notify-staff`). By pushing this to the database layer, we guarantee that a downstream notification is *only* attempted if the state mutation has definitively committed to the WAL (Write-Ahead Log).

### Worker Routing & Assignment

The `notify-staff` function acts as a dynamic router. It queries the database to find the intersection of:
1. Staff possessing the requisite `role` for the complaint category.
2. Staff operating in the matching `hostel_code`.
3. Staff with the minimum `active_tickets` (Load Balancing).

Once an optimal worker is found, the system mutates the ticket state to `assigned` and fans out notifications:
- A dedicated Discord Thread is instantiated.
- If `severity == 'Critical'`, a synchronous HTTP call to the Twilio API dispatches an SMS directly to the worker's cellular device, bridging the gap between cyberspace and the physical world.
