def compute_gini(values: list[float]) -> float:
    if not values or len(values) < 2:
        return 0.0
    sorted_v = sorted(values)
    n = len(sorted_v)
    total = sum(sorted_v)
    if total == 0:
        return 0.0
    numerator = sum((2 * (i + 1) - n - 1) * v for i, v in enumerate(sorted_v))
    return numerator / (n * total)


def compute_iau_score(satisfactions: list[float]) -> float:
    """IAU = 1.0 - |gini|, where 1.0 = perfectly equal."""
    return 1.0 - abs(compute_gini(satisfactions))


def check_ef1(satisfactions: list[int], removable_value: int = 15) -> tuple[int, list[tuple[int, int]]]:
    """Returns (violation_count, [(envious_idx, envied_idx), ...])."""
    violations = []
    for i in range(len(satisfactions)):
        for k in range(len(satisfactions)):
            if i == k:
                continue
            if satisfactions[i] < satisfactions[k] - removable_value:
                violations.append((i, k))
    return len(violations), violations


def compute_group_disparity(groups: dict[str, list[float]]) -> dict[str, float]:
    """Average satisfaction per group — for detecting systematic bias."""
    return {g: sum(v) / len(v) if v else 0.0 for g, v in groups.items()}


def max_min_stats(satisfactions: list[float]) -> dict[str, float]:
    if not satisfactions:
        return {"min": 0, "max": 0, "range": 0, "mean": 0}
    return {
        "min": min(satisfactions),
        "max": max(satisfactions),
        "range": max(satisfactions) - min(satisfactions),
        "mean": sum(satisfactions) / len(satisfactions),
    }
