# Job Discovery: Web Scraper & Deduplication Architecture

## 1. Purpose
Define the web scraping workflows, HTML selectors, throttling rules, and deduplication pipelines required to ingest jobs from direct company career pages.

---

## 2. Ingestion & Deduplication Pipeline (ASCII)

```
 [Target Company Page] ---> Fetch HTML ---> [Sanitize & Extract Nodes]
                                                    |
                                                    v
 [Unique Identifier Check] <--- Compare Hashes <--- Normalize Payload
        |
        +---> Match Found: Skip Ingestion / Update Timestamp
        +---> Match Not Found: Ingest as New Job Entry
```

---

## 3. Crawling Policies & Throttling

To ensure ethical crawling and prevent IP blocks:
- **Respect Robots.txt**: Always parse and respect target server `robots.txt` exclusion zones.
- **Rate Limiting**: Enforce a minimum delay of 1.5 seconds between subsequent requests to the same domain.
- **Custom User-Agent**: Identify requests using a clear user-agent header (e.g. `User-Agent: AICareerAgentBot/1.0; (+https://aicareeragent.com/bot)`).

---

## 4. Deduplication Pipeline Logic

Deduplication prevents importing identical jobs from different sources. The deduplication hash is calculated using:
```typescript
const generateJobHash = (title: string, companyName: string, location: string): string => {
  const normalized = `${title.toLowerCase()}|${companyName.toLowerCase()}|${location.toLowerCase()}`
    .replace(/\s+/g, "");
  return createHash("sha256").update(normalized).digest("hex");
};
```
- If a hash match is found in the database, the system updates the `lastSeen` timestamp instead of creating a duplicate entry.

---

## 5. Edge Cases
- **Anti-Scraping Captchas**: Cloudflare verification screens. Resolved by utilizing official RSS/Atom XML feeds or public API endpoints (e.g. Greenhouse public API) rather than scraping raw HTML views.
- **Dynamic JS Rendering**: Sites requiring client-side JavaScript execution to display listings (e.g. React single-page apps). Resolved by using headless browsers (Playwright) or querying internal JSON API endpoints discovered during network audits.
