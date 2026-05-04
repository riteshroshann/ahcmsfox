from ortools.sat.python import cp_model

def solve_allocation(students: list[dict], rooms: list[dict], alpha: float, beta: float, gamma: float) -> dict:
    model = cp_model.CpModel()
    n_students = len(students)
    n_rooms = len(rooms)

    if n_students == 0 or n_rooms == 0:
        return {"feasible": False, "assignments": [], "objective": 0, "ef1_violations": 0, "min_sat": 0}

    x = {}
    for i in range(n_students):
        for j in range(n_rooms):
            x[i, j] = model.new_bool_var(f"x_{i}_{j}")

    # each student assigned to exactly one room
    for i in range(n_students):
        model.add(sum(x[i, j] for j in range(n_rooms)) == 1)

    # room capacity
    for j in range(n_rooms):
        cap = rooms[j]["capacity"] - rooms[j]["current_occupancy"]
        model.add(sum(x[i, j] for i in range(n_students)) <= max(cap, 0))

    # gender segregation — students of different genders can't share room
    for j in range(n_rooms):
        males = [i for i in range(n_students) if students[i]["gender"] == "M"]
        females = [i for i in range(n_students) if students[i]["gender"] == "F"]
        if males and females:
            has_male = model.new_bool_var(f"male_in_{j}")
            has_female = model.new_bool_var(f"female_in_{j}")
            model.add_max_equality(has_male, [x[i, j] for i in males] if males else [model.new_constant(0)])
            model.add_max_equality(has_female, [x[i, j] for i in females] if females else [model.new_constant(0)])
            model.add(has_male + has_female <= 1)

    sat_scores = {}
    for i in range(n_students):
        for j in range(n_rooms):
            sat_scores[i, j] = _compute_satisfaction(students[i], rooms[j])

    # satisfaction terms scaled to int
    SCALE = 100
    sat_vars = {}
    for i in range(n_students):
        sat_vars[i] = model.new_int_var(0, SCALE, f"sat_{i}")
        model.add(sat_vars[i] == sum(sat_scores[i, j] * x[i, j] for j in range(n_rooms)))

    # z_min for max-min fairness
    z_min = model.new_int_var(0, SCALE, "z_min")
    for i in range(n_students):
        model.add(z_min <= sat_vars[i])

    total_sat = sum(sat_vars[i] for i in range(n_students))

    # peer bonus
    peer_bonus = 0
    peer_map = {}
    for i, s in enumerate(students):
        if s.get("peer_ids"):
            for pid in s["peer_ids"]:
                for k, s2 in enumerate(students):
                    if s2["student_id"] == pid and k != i:
                        peer_map.setdefault(i, []).append(k)

    peer_terms = []
    for i, peers in peer_map.items():
        for k in peers:
            for j in range(n_rooms):
                both = model.new_bool_var(f"peer_{i}_{k}_{j}")
                model.add_bool_and([x[i, j], x[k, j]]).only_enforce_if(both)
                model.add_bool_or([x[i, j].negated(), x[k, j].negated()]).only_enforce_if(both.negated())
                peer_terms.append(15 * both)

    # objective: maximize alpha*satisfaction + peer_bonus + gamma*z_min
    obj = int(alpha * SCALE) * total_sat + int(gamma * SCALE) * z_min
    if peer_terms:
        obj += SCALE * sum(peer_terms)

    model.maximize(obj)

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 30
    status = solver.solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return {"feasible": False, "assignments": [], "objective": 0, "ef1_violations": 0, "min_sat": 0}

    assignments = []
    sat_values = []
    for i in range(n_students):
        for j in range(n_rooms):
            if solver.value(x[i, j]):
                s_val = solver.value(sat_vars[i])
                assignments.append({
                    "student_id": students[i]["student_id"],
                    "room_id": rooms[j]["room_id"],
                    "satisfaction": s_val,
                })
                sat_values.append(s_val)

    ef1_violations = _count_ef1_violations(assignments, sat_values, students, rooms, sat_scores)

    return {
        "feasible": True,
        "assignments": assignments,
        "objective": solver.objective_value / (SCALE * SCALE),
        "ef1_violations": ef1_violations,
        "min_sat": min(sat_values) if sat_values else 0,
    }


def _compute_satisfaction(student: dict, room: dict) -> int:
    base = 50
    noise_compat = max(0, 20 - abs(student.get("noise_pref", 3) - room.get("noise_level", 3)) * 8)
    feature_bonus = 0
    room_features = set(room.get("features") or [])
    if room_features:
        feature_bonus = min(10, len(room_features) * 3)
    return min(100, base + noise_compat + feature_bonus)


def _count_ef1_violations(assignments: list, sat_values: list, students: list, rooms: list, sat_scores: dict) -> int:
    """EF1: student i envies k if s_i < s_k even after removing k's best component (peer bonus = 15)."""
    violations = 0
    removable = 15
    for idx_i in range(len(assignments)):
        for idx_k in range(len(assignments)):
            if idx_i == idx_k:
                continue
            if sat_values[idx_i] < sat_values[idx_k] - removable:
                violations += 1
    return violations
