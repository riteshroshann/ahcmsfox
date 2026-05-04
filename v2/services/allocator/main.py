import uuid
from fastapi import FastAPI, HTTPException, Header
from supabase import create_client
from models import SolveRequest, SolveResponse, AllocationResult
from solver import solve_allocation
import os

app = FastAPI(title="AHCMS Allocator", version="1.0.0")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/solve", response_model=SolveResponse)
def solve(req: SolveRequest, x_api_key: str = Header(default="")):
    expected_key = os.getenv("API_KEY", "")
    if expected_key and x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    sb = create_client(req.supabase_url, req.supabase_key)

    students_res = sb.table("STUDENT_PROFILE").select("student_id, gender, noise_pref, sleep_pref, hostel_code").eq("hostel_code", req.hostel_code).is_("deleted_at", "null").execute()
    rooms_res = sb.table("ROOM").select("room_id, room_code, capacity, current_occupancy, noise_level, features, status").eq("hostel_code", req.hostel_code).eq("status", "available").execute()

    students = students_res.data or []
    rooms = rooms_res.data or []

    # filter students who already have active allocations
    alloc_res = sb.table("ALLOCATION").select("student_id").eq("status", "active").execute()
    allocated_ids = {a["student_id"] for a in (alloc_res.data or [])}
    unallocated = [s for s in students if s["student_id"] not in allocated_ids]

    # check peer preferences from pending booking requests
    booking_res = sb.table("ROOM_BOOKING_REQUEST").select("student_id, peer_ids").eq("status", "pending").execute()
    peer_map = {b["student_id"]: b.get("peer_ids") or [] for b in (booking_res.data or [])}
    for s in unallocated:
        s["peer_ids"] = peer_map.get(s["student_id"], [])

    if not unallocated:
        raise HTTPException(status_code=400, detail="No unallocated students in this hostel")

    result = solve_allocation(unallocated, rooms, req.alpha, req.beta, req.gamma)

    if not result["feasible"]:
        raise HTTPException(status_code=422, detail="No feasible allocation found — check room capacity")

    run_id = str(uuid.uuid4())

    sb.table("SOLVER_RUN").insert({
        "run_id": run_id,
        "hostel_code": req.hostel_code,
        "status": "completed",
        "student_count": len(unallocated),
        "room_count": len(rooms),
        "feasible": True,
        "objective_value": result["objective"],
        "alpha": req.alpha,
        "beta": req.beta,
        "gamma": req.gamma,
        "ef1_violations": result["ef1_violations"],
        "min_satisfaction": result["min_sat"],
    }).execute()

    for a in result["assignments"]:
        sb.table("ALLOCATION").insert({
            "student_id": a["student_id"],
            "room_id": a["room_id"],
            "start_date": "2025-08-01",
            "end_date": "2026-05-31",
            "status": "active",
            "solver_run_id": run_id,
            "satisfaction": a["satisfaction"],
        }).execute()

    return SolveResponse(
        run_id=run_id,
        hostel_code=req.hostel_code,
        status="completed",
        allocations_made=len(result["assignments"]),
        objective_value=result["objective"],
        ef1_violations=result["ef1_violations"],
        min_satisfaction=result["min_sat"],
        allocations=[AllocationResult(**a) for a in result["assignments"]],
    )
