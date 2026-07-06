# Job Discovery: System Architecture Design

## 1. Purpose
Define the high-level system components, data flow boundaries, and modular layers for the Job Discovery module. This document outlines how job discovery connects search operations, external job ingestion, candidate profile metrics, and the optimization pipelines.

---

## 2. Architecture Diagram (ASCII)

```
       +-----------------------------------------------------+
       |                  React App UI Layer                 |
       |  (Search Bar, Filters panel, Card Grid, Job Detail) |
       +-----------------------------------------------------+
                                 |
                                 v
       +-----------------------------------------------------+
       |               Zustand Client Stores                 |
       |  (jobs.store, search.store, bookmark.store, etc.)   |
       +-----------------------------------------------------+
            |                    |                    |
            v                    v                    v
      +------------+       +------------+       +------------+
      |    Job     |       | Bookmark   |       | Recommend  |
      |  Service   |       |  Service   |       |  Service   |
      +------------+       +------------+       +------------+
            |                    |                    |
            +----------+---------+--------------------+
                       |
                       v
       +-----------------------------------------------------+
       |                Adapter Engine Layer                 |
       |     (Scrapers, External APIs, RSS Normalizers)      |
       +-----------------------------------------------------+
                       |
                       v
       +-----------------------------------------------------+
       |                 AI Engine Matcher                   |
       |     (Gemini/Claude Embeddings & Score Calculator)   |
       +-----------------------------------------------------+
```

---

## 3. Modular Responsibilities

1. **UI Layer**: Fully decoupled layout modules built on top of the Brutalist Design System. Handles responsive layout splits (Job List side-by-side with detail drawer on desktop, stacked on mobile).
2. **State Management**: Individual, single-responsibility stores coordinating query parameters, pagination, bookmark cache arrays, and loading spinners.
3. **Service Layer**: Business controllers executing data validation, client-side indexing, and mock service calls.
4. **Adapter Engine**: Unified ingestion layer translating raw feed response payloads (Wellfound JSON, Greenhouse XML) into normalized internal schemas.
5. **AI Engine**: Compares candidate profile skills against normalized requirements, calculating matching score metrics.

---

## 4. Best Practices
- **Strict Decoupling**: React UI controls should never communicate with scraper endpoints or downstream APIs directly. All actions pass through the Zustand store dispatchers.
- **Graceful Degradation**: If an external provider adapter fails, isolate it and fall back to cached database entries without disrupting search queries.
- **Fail Fast Ingestions**: Enforce a 5-second timeout on all provider network fetches during scraper runs.

---

## 5. Edge Cases
- **Duplicate Job Postings**: Multiple scrapers fetching the same job from different job boards (e.g. Greenhouse and Wellfound). Resolved by implementing hashing on title + normalized company name + location.
- **Stale Expiry Dates**: Listings where companies remove pages without updating the API. Resolved by verifying response headers and checking page live status.
