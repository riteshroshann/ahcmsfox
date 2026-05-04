"""
GA-based hyperparameter tuner for AHCMS complaint severity classifier.

This is an OFFLINE research script. Run it when you have >500 labeled complaints.
It tunes weights w1-w4 and severity thresholds for the priority scoring function:

  PriorityScore = w1*severity_score + w2*time_hours + w3*sla_breached - w4*block_distance

Usage:
  python tune.py --data complaints_labeled.json --output best_weights.json

Input JSON schema:
  [{"sev_raw": 3, "age_h": 5.2, "sla_flag": 1, "true_label": "High"}, ...]
"""

import random
import json
import argparse
from pathlib import Path

POPULATION_SIZE = 50
GENERATIONS     = 200
MUTATION_RATE   = 0.15
MUTATION_SIGMA  = 0.1
ELITISM_COUNT   = 10

SEVERITY_WEIGHTS = {"Critical": 4.0, "High": 2.0, "Medium": 1.0, "Low": 0.5}


def fitness(weights: list[float], labeled_data: list[dict]) -> float:
    w1, w2, w3, w4, tc, th = weights
    correct = sum_w = 0.0
    for item in labeled_data:
        score = (
            w1 * item["sev_raw"]
            + w2 * item["age_h"]
            + w3 * item["sla_flag"]
            - w4 * item.get("block_dist", 0)
        )
        if score > tc:
            predicted = "Critical"
        elif score > th:
            predicted = "High"
        elif score > 0:
            predicted = "Medium"
        else:
            predicted = "Low"

        sw = SEVERITY_WEIGHTS.get(item["true_label"], 1.0)
        if predicted == item["true_label"]:
            correct += sw
        sum_w += sw

    return correct / sum_w if sum_w > 0 else 0.0


def crossover(a: list[float], b: list[float]) -> list[float]:
    pt = random.randint(1, len(a) - 1)
    return a[:pt] + b[pt:]


def mutate(weights: list[float]) -> list[float]:
    return [
        w + random.gauss(0, MUTATION_SIGMA) if random.random() < MUTATION_RATE else w
        for w in weights
    ]


def evolve(labeled_data: list[dict]) -> list[float]:
    population = [
        [random.uniform(0, 100) for _ in range(6)]
        for _ in range(POPULATION_SIZE)
    ]

    for gen in range(GENERATIONS):
        scored = sorted(population, key=lambda w: -fitness(w, labeled_data))
        population = scored[:ELITISM_COUNT]

        while len(population) < POPULATION_SIZE:
            parents = random.sample(scored[:20], 2)
            child = mutate(crossover(parents[0], parents[1]))
            population.append(child)

        if gen % 20 == 0:
            best_f = fitness(scored[0], labeled_data)
            print(f"Gen {gen:3d}: best_fitness={best_f:.4f}  weights={[round(v,2) for v in scored[0]]}")

    return scored[0]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to labeled JSON data")
    parser.add_argument("--output", default="best_weights.json", help="Output path for best weights")
    args = parser.parse_args()

    labeled_data = json.loads(Path(args.data).read_text())
    print(f"Loaded {len(labeled_data)} labeled complaints. Starting GA...")

    best = evolve(labeled_data)
    w1, w2, w3, w4, tc, th = best
    result = {
        "w1_severity": round(w1, 4),
        "w2_time":     round(w2, 4),
        "w3_sla":      round(w3, 4),
        "w4_distance": round(w4, 4),
        "threshold_critical": round(tc, 4),
        "threshold_high":     round(th, 4),
        "final_fitness": round(fitness(best, labeled_data), 4),
    }

    Path(args.output).write_text(json.dumps(result, indent=2))
    print(f"\nBest weights saved to {args.output}:")
    print(json.dumps(result, indent=2))
    print("\nUpdate w1-w4 constants in discord-bot/index.ts accordingly.")


if __name__ == "__main__":
    main()
