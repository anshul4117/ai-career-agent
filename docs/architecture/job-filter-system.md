# Job Discovery: Search Filtering System

## 1. Purpose
Define the search filtering engine, parameter structure, and state synchronization policies for refining job listings.

---

## 2. Ingestion & Filtering Pipeline

```
 [Raw Job Collection] ---> [Filter Pipeline] ---> [Filtered Output]
                                  |
                                  +---> Match Remote Type?
                                  +---> Match Salary Threshold?
                                  +---> Match Years of Experience?
                                  +---> Match Skills Required?
```

---

## 3. Filter Parameters Configuration

- **Remote Type**: Enum supporting `"remote" | "hybrid" | "onsite"`.
- **Salary Threshold**: Minimum annual salary filter matching the user's currency selections.
- **Experience Requirement**: Filter by experience level (Entry, Mid, Senior, Lead).
- **Date Posted**: Filter by listing age (Last 24 Hours, Last Week, Last Month, Any Time) to surface fresh opportunities.
- **Advanced Criteria**:
  - *Skills*: Multi-select tags matching candidate expertise.
  - *Company & Industry*: Keyword search matching target entities and sectors.
  - *Easy Apply*: Flag to display roles that support immediate one-click applications.
  - *Match Score*: Minimum match rating threshold slider/dropdown.
- **History & Suggestions**:
  - *Recent Searches*: Log of the last 5 keywords queried by the user.
  - *Saved Searches*: Bookmark configurations of queries and active filters.
  - *Popular Searches*: System-wide trending job keywords.
- **Job Alerts Scanning**:
  - Alert scheduler matching custom criteria filters at Instant, Daily, or Weekly intervals.
 
---
 
## 4. Best Practices
- **Query State Sync**: Sync all active search filter selections directly to the browser URL search query parameters (e.g. `?remote=true&salary=100000`). This allows users to easily copy, bookmark, or share filtered search states.
- **Session Storage Persistence**: Serialize search filters, pagination, and sorting settings to `sessionStorage` via Zustand's persist engine to recover state on backward transitions.
- **Scroll Restoration**: Keep track of user scroll position on details transition to allow returning to the exact scroll depth on back navigation.
- **Dynamic Badges**: Expose active filter badges enabling instant removal with single click interactions.
- **Dynamic Counters**: Display remaining result count totals next to filter checkboxes in real-time.

---

## 5. Edge Cases
- **Non-Standard Experience Formats**: Postings requiring "3-5 years" vs "at least 5 years". The filter system maps these to standard experience levels based on the maximum year value (e.g., 5 years $\rightarrow$ Senior).
- **Hourly vs Annual Salaries**: Convert hourly contract rates (e.g., "$50/hr") into annual equivalent thresholds using standard full-time hours (2000 hours/year) for comparison.
