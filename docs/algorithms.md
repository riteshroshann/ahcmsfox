# Algorithmic Foundations

The intelligence of AHCMS lies in its ability to autonomously resolve NP-hard optimization problems and tune its own operational parameters over time. We focus on two primary engines: the **Room Allocator** and the **Complaint Tuning Algorithm**.

---

## Room Allocation as a Constraint Satisfaction Problem

Allocating $N$ students into $M$ rooms is fundamentally a multidimensional knapsack problem. Greedy assignments yield localized sub-optima, resulting in highly variable student satisfaction. 

We formalize this using Google OR-Tools (CP-SAT), converting human preferences into a strict mathematical tensor.

### The Objective Function: Max-Min Fairness

Rather than maximizing the *total* satisfaction (which could leave a subset of students severely dissatisfied while others are ecstatic), we optimize for **Max-Min Fairness**. The solver is instructed to maximize the satisfaction of the *least satisfied* student.

Let $S_i$ be the satisfaction score of student $i$. The objective is to maximize $Z$, subject to:
$$ S_i \geq Z \quad \forall i \in \{1, \dots, N\} $$

### Envy-Freeness up to 1 Item (EF1)

A core tenet of algorithmic fairness is Envy-Freeness. We implement a relaxed constraint, EF1, proving that no student will envy another student's assignment by more than the marginal utility of a single feature (e.g., room capacity or noise level).

Satisfaction $S_i$ is computed as the dot product of the student's preference vector $\vec{P_i}$ and the assigned room's feature vector $\vec{R_j}$, combined with a peer compatibility bonus $C(i, k)$ for roommates:

$$ S_i = (\vec{P_i} \cdot \vec{R_j}) + \sum_{k \in \text{Room}_j, k \neq i} C(i, k) $$

The CP-SAT solver explores the discrete search space, utilizing boolean decision variables $X_{i,j} \in \{0, 1\}$ (where $X_{i,j} = 1$ if student $i$ is assigned to room $j$). The system guarantees global constraint satisfaction (e.g., room capacities are not exceeded) while mathematically proving the absence of localized bias.

---

## Evolutionary Tuning of Complaint Severity

When a student files a complaint, human emotion injects high variance into the "severity" classification. The system must cut through this noise to prioritize mathematically.

### The Priority Function

The absolute priority $P(t)$ of a ticket at time $t$ is a weighted linear combination:

$$ P(t) = w_1 \cdot \text{Severity} + w_2 \cdot \log(1 + \text{Age}(t)) + w_3 \cdot \max(0, \text{SLA\_Proximity}) + w_4 \cdot \frac{1}{1 + \text{Worker\_Distance}} $$

### The Genetic Algorithm (GA)

The weights $\vec{W} = [w_1, w_2, w_3, w_4]$ dictate the system's operational focus. Instead of hardcoding these, we deploy a Genetic Algorithm to evolve them based on historical operational data.

1. **Population Initialization**: We initialize a population of $K$ candidate weight vectors.
2. **Fitness Evaluation**: We simulate historical ticket resolution sequences using each candidate vector. The fitness function $F(\vec{W})$ penalizes SLA breaches and worker context-switching.
3. **Crossover & Mutation**: The top-performing vectors are spliced together. A mutation rate $\mu = 0.05$ injects random noise to escape local minima in the fitness landscape.
4. **Convergence**: After generations of simulation, the optimal weight vector is extracted and injected into the live production database, tuning the system's response dynamics autonomously.
