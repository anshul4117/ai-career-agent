# Job Discovery: Search & Apply Workflow

## 1. Purpose
Plan and design the complete user navigation flows through the Job Discovery portal, starting from search keyword entry up to submitting applications and tracking status changes.

---

## 2. Ingestion & Search Flowchart

```
 [User Dashboard] ---> Click "Jobs" ---> [Job Search Landing]
                                                |
                                                v
 [Result List Grid] <--- Apply Filters <--- Type Search Keyword
        |
        +---> Click Job Card ---> [Right Column Details Pane]
                                            |
                                            +---> [Save / Bookmark Collection]
                                            +---> [Trigger AI Fit Scoring]
                                            +---> [Optimize Resume / Cover Letter]
                                            +---> [Click Apply Link]
                                                        |
                                                        v
                                            [Application Tracker Logged]
```

---

## 3. Core Stages

### Stage A: Discovery & Filter
- The user inputs keywords (e.g. "React Developer") and locations (e.g. "Remote").
- `search.store` filters local lists and queries remote services, updating indices.
- Filters refine results by Salary limits, Experience metrics, and Remote classification.

### Stage B: Details & Engagement
- Selecting a card updates `activeJob` state, loading details dynamically in the right drawer without causing page reload layout shifts.
- On-screen metrics showcase the matching score percentage (e.g. "93% Profile Match").

### Stage C: Application Sync
- Clicking "Apply" opens a popup suggesting:
  - **Optimize Resume**: Forwards user to `ResumeBuilder` pre-filled with matching keywords.
  - **Cover Letter**: Forwards to `CoverLettersPage` prefilled with company name and job title.
- Tracks the click, updating the job record status to `applied`, and creates a new entry in `applications.store` for follow-ups.

---

## 4. Best Practices
- **No Layout Shifts**: Maintain fixed size bounds on details cards to avoid content jumping on tablet and mobile viewports.
- **History Logs**: Silently cache recent searches (limit to 10 entries) and recently viewed jobs (limit to 20 entries) inside localStorage.

---

## 5. Edge Cases
- **External Redirect Failures**: If `externalApplyUrl` is broken, prompt the user with a fallback option to report the listing or search for alternative links.
- **Expired Matches**: If the user opens an expired matching job from their bookmarks, display a clear warning banner with recommendations for similar active roles.
