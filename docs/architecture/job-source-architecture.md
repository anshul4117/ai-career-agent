# Job Discovery: External Source Adapter Architecture

## 1. Purpose
Define the integration interfaces and normalization policies for third-party job feed providers. This specification ensures new platforms (e.g. LinkedIn, Greenhouse) can be integrated without modifying the client application code.

---

## 2. Ingestion Flow

```
+------------+       +-------------+       +---------------+
| Wellfound  |       | YCombinator |       | Company Pages |
|  JSON API  |       |   RSS Feed  |       | HTML Scraper  |
+------------+       +-------------+       +---------------+
      |                     |                      |
      +----------v----------+----------------------+
                 |
                 v
+----------------------------------------------------------+
|                 JobProviderAdapter Interface             |
|                 + parse(rawPayload: string)              |
|                 + fetchActiveListings()                  |
+----------------------------------------------------------+
                 |
                 v
+----------------------------------------------------------+
|                  Normalized Job Schema                   |
| (title, companyName, salaryRange, location, skillsRequired) |
+----------------------------------------------------------+
```

---

## 3. Interfaces Definition (TypeScript Specification)

```typescript
export interface RawJobPayload {
  provider: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface JobProviderAdapter {
  providerName: string;
  
  /**
   * Fetches raw listings from the source endpoint
   */
  fetchActiveListings(queryParameters: Record<string, any>): Promise<RawJobPayload[]>;

  /**
   * Translates provider-specific JSON/XML configurations into standard structures
   */
  normalize(payload: RawJobPayload): NormalizedJob;
}
```

---

## 4. Normalization Rules

- **Salary Standardisation**: Convert range expressions (e.g. "90k - 120k", "150000 USD") into minSalary, maxSalary, and currency code (ISO 4217).
- **Location Categorisation**: Parse strings into `city`, `country`, and remote flags (`remote`, `hybrid`, `onsite`).
- **Skills Tagging**: Convert unstructured text mentions into an array of low-cased tech tags matching the global profile taxonomy.

---

## 5. Ingestion Target Specs

- **Wellfound (AngelList)**: Focus on startup equity parameters, tech tags, and funding round contexts.
- **Y Combinator Jobs**: Normalize cohort categories (e.g. W24), funding size, and direct apply urls.
- **Greenhouse / Lever**: Parse API standard corporate configurations, job descriptions, and structured apply forms.

---

## 6. Edge Cases
- **Missing Vital Fields**: Ingesting a job without a company logo or location. Resolved by setting location to "Remote" and falling back to a company initials logo placeholder.
- **Varying Text Formats**: HTML markup in Greenhouse descriptions vs plain text in Wellfound. Normalizer must strip scripts and sanitize HTML into clean formatting.
