# Job Discovery: AI Recommendation Engine Design

## 1. Purpose
Plan and document the AI recommendation matching mechanics. This specification outlines how candidate profile details and resume text are analyzed against job requirements to calculate match score percentages.

---

## 2. Match Score Logic Diagram (ASCII)

```
 +--------------------+       +--------------------+
 | Candidate Profile  |       | Active Resume Text |
 |  (Skills, Exp)     |       |   (PDF parsing)    |
 +--------------------+       +--------------------+
           |                             |
           +--------------+--------------+
                          |
                          v
           +-----------------------------+
           |    Recommendation Engine    |
           |   (Weights Matrix Matching) |
           +-----------------------------+
                          ^
                          |
           +-----------------------------+
           |     Normalized Job Post     |
           |     (Required tech list)    |
           +-----------------------------+
                          |
                          v
           +-----------------------------+
           | Match Score Percentage Tag  |
           | (e.g. 91% Compatibility)   |
           +-----------------------------+
```

---

## 3. Weighted Engine Logic

The match score calculation relies on a weighted scoring matrix:

1. **Core Skills Match (Weight: 45%)**: Computes the intersection of the candidate's skills with the job's required skills.
2. **Experience Alignment (Weight: 25%)**: Compares the candidate's years of experience against the job's requirements.
3. **Role & Title Matching (Weight: 15%)**: Computes string similarity between the candidate's headline and the job title.
4. **Preference Fit (Weight: 15%)**: Evaluates compatibility with remote/hybrid preferences, location, and salary expectations.

---

## 4. Future LLM Ingestion Strategy
When moving from MVP mock algorithms to production LLM matches:
- Generate text embeddings (using OpenAI `text-embedding-3-small` or Google Gemini models) for both the candidate profile data and the target job description.
- Calculate cosine similarity scores between these embeddings to determine semantic compatibility.
- Feed the top 5 match results into a prompt (e.g. Claude 3.5 Sonnet) to generate personalized interview tips and application recommendations.

---

## 5. Edge Cases
- **Over-Optimization (Skill Stuffing)**: Candidates adding irrelevant skills to artificially inflate match scores. Resolved by weighting skills based on their presence and context in the candidate's work experience details.
- **Vague Job Descriptions**: Postings with minimal details (e.g., just "looking for a programmer"). Fall back to title-based matching and assign a lower matching confidence rating.
