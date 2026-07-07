# Job Discovery: Bookmarking & Collections System

## 1. Purpose
Define the bookmarking architecture, custom collections structures, search histories, and synchronization flows.

---

## 2. Bookmarking Flow Diagram (ASCII)

```
 [User UI Card] ---> Toggle Save ---> [bookmark.store]
                                              |
                          +-------------------+------------------+
                          v                                      v
              [Update Local Cache Array]              [Trigger Async Database Sync]
                          |                                      |
                          +-------------------+------------------+
                                              |
                                              v
                                  [Categorized Collections]
                                  (e.g., "High Salary", "Go Roles")
```

---

## 3. Core Capabilities

- **Save / Unsave**: Instant, optimistic UI updates that update local state before confirming with the server.
- **Custom Collections**: Group saved jobs into custom categories (e.g. "React Jobs", "Wellfound Leads") to organize applications.
- **View History**: Maintain a list of the 20 most recently viewed jobs for quick navigation.
- **Saved Date & Sorting**:
  - Store a `savedAt` ISO timestamp when a job is bookmarked.
  - Support client-side sorting of saved jobs by:
    - *Recently Saved*: Descending by `savedAt` timestamp.
    - *Company*: Alphabetically by company name.
    - *Job Title*: Alphabetically by job title.
    - *Date Posted*: Descending by `postedDate` timestamp.

---

## 4. Best Practices
- **Optimistic Updates**: Always toggle bookmark states instantly in UI views, rolling back changes only if the network sync fails.
- **Offline Persistence**: Cache bookmarks inside localStorage so lists remain accessible during offline sessions.

---

## 5. Edge Cases
- **Simultaneous Deletes**: If a user unsaves a job on mobile while applying to it on desktop. Resolved by syncing actions with a timestamp-based last-write-wins policy.
- **Archived Postings**: Saved jobs that have been closed or removed by the employer. Retain these in collections but display an "Archived/Inactive" status badge.
