# Relational State & Integrity

The PostgreSQL database acts as the immutable ledger for the entire sovereign system. We enforce strict data integrity at the lowest possible layer, ensuring that no client (UI, Bot, or API) can corrupt the state machine.

## Strict Typing & Enums

Stringly-typed data leads to runtime panics. We define explicit PostgreSQL `ENUM` types for all state fields:

```sql
CREATE TYPE complaint_cat AS ENUM ('Plumbing','Electricity','WiFi','Cleanliness','Carpentry','Pest','Structural','Other');
CREATE TYPE severity_enum AS ENUM ('Low','Medium','High','Critical');
CREATE TYPE ticket_status AS ENUM ('open','assigned','in_progress','pending_review','resolved','closed','escalated');
```

By enforcing this in the schema, the database intrinsically rejects malformed payloads from peripheral clients.

## Generated Columns & Mathematical Guarantees

We eliminate application-layer computation for deterministic values. The `priority_score` is defined as a `GENERATED ALWAYS AS STORED` column. It is computed at the C-level within PostgreSQL during the `INSERT` or `UPDATE` phase:

```sql
priority_score FLOAT GENERATED ALWAYS AS (
  CASE severity
    WHEN 'Critical' THEN 100.0
    WHEN 'High'     THEN 70.0
    WHEN 'Medium'   THEN 40.0
    WHEN 'Low'      THEN 10.0
  END
) STORED
```

This guarantees that every client querying the database receives the exact same score, without duplicating business logic across Python, TypeScript, and SQL codebases.

## Asynchronous PostgREST Considerations

Supabase layers PostgREST over PostgreSQL to provide an automatic RESTful API. A critical engineering subtlety arises in case-sensitivity.

PostgreSQL internally folds unquoted identifiers to lowercase. Therefore, a table defined as:
```sql
CREATE TABLE COMPLAINT (...)
```
is stored in the system catalog as `complaint`.

However, the PostgREST translation layer evaluates API requests with strict case-sensitivity. Queries like `.from("COMPLAINT")` will silently fail to match the catalog, returning 0 rows or throwing `invalid input syntax`. AHCMS strictly standardizes all API queries to lowercase to align directly with the underlying PostgreSQL catalog, preventing abstraction leaks.

## Referential Cascades

The system maintains absolute graph integrity. A `STUDENT_PROFILE` is inextricably linked to the `auth.users` UUID. 
```sql
student_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
```
If a user is purged from the authentication tenant, the cascade aggressively propagates down the graph, deleting the profile, which subsequently orphans or resolves their active complaints, ensuring the database never holds mathematically impossible state representations.
