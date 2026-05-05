from pydantic import BaseModel

class SolveRequest(BaseModel):
    hostel_code: str
    alpha: float = 1.0
    beta: float = 0.5
    gamma: float = 0.3
    supabase_url: str
    supabase_key: str

class AllocationResult(BaseModel):
    student_id: str
    room_id: str
    satisfaction: int

class SolveResponse(BaseModel):
    run_id: str
    hostel_code: str
    status: str
    allocations_made: int
    objective_value: float
    ef1_violations: int
    min_satisfaction: int
    allocations: list[AllocationResult]
