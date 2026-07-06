# Job Discovery: Company Profile Architecture

## 1. Purpose
Define the company entity metadata structures, active hiring statuses, and relationship mapping definitions for corporate entities.

---

## 2. Entity Diagram (ASCII)

```
        +----------------------------------------------+
        |                Company Profile               |
        +----------------------------------------------+
        | - id: string                                 |
        | - name: string                               |
        | - logoUrl: string | null                     |
        | - website: string                            |
        | - industry: string                           |
        | - companySize: string                        |
        | - headquarters: string                       |
        | - techStack: string[]                        |
        | - hiringStatus: "active" | "paused"          |
        +----------------------------------------------+
                               |
                               | 1
                               |
                               v N
        +----------------------------------------------+
        |                 Active Jobs                  |
        +----------------------------------------------+
```

---

## 3. Data Structure Definition

- **Tech Stack Profiling**: Array of languages and frameworks used in production (e.g. `["React", "Node.js", "AWS"]`). Used to recommend jobs based on matches between company tech stacks and user skillsets.
- **Hiring Status**: Enum indicating whether recruitment is actively open or temporarily paused.
- **Funding Context**: Voluntary detail showing funding stage (Seed, Series A, Bootstrapped, Public) to help candidates filter positions by company scale and stability.

---

## 4. Best Practices
- **Referential Integrity**: Never embed job listings directly inside the company profile document. Map them using foreign key relationships (`companyId` on job records).
- **Logo Optimization**: Cache company logos locally or resize them to a standard size (e.g., $128 \times 128$ pixels) to optimize listing page load speeds.

---

## 5. Edge Cases
- **Acquisitions & Rebranding**: If a company rebrands (e.g. Twitter $\rightarrow$ X), update the `companyId` aliases so historic job records remain linked to the correct profile.
- **Unknown Tech Stacks**: If tech stack details are missing, construct a parsed list by extracting keywords from active job descriptions.
