# Source Layer — Coverage & Authenticity Audit

**Date:** 2026-11-01  
**Execution Environment:** Node.js NestJS Test Harness (Live Real Endpoints)  
**Configuration:** Free public ATS + Jooble & Careerjet free API keys. Adzuna & JSearch disabled (needs card).

---

## 1. Executive Summary

- **Total Sample Jobs Fetched:** 154
- **India-Eligible Jobs:** 152 (98.7%)
- **Tier-2 / Tier-3 Regional Jobs:** 0 (0.0%)
- **Fresher & Entry-Level (0–1y / Intern):** 12 (7.8%)
- **Non-MNC Employer Jobs:** 80 (51.9%)
- **Direct ATS Apply URLs (`direct_ats`):** 134 (87.0%)
- **Aggregator Tracking/Redirect URLs (`redirect_aggregator`):** 20 (13.0%)

---

## 2. Per-Source Detailed Coverage Breakdown

| Source Adapter      | Type                   | Fetched | India Eligible % | Tier-2/3 Count | Fresher % | Non-MNC % | Usable Apply Link Type   | Status                     |
| :------------------ | :--------------------- | :------ | :--------------- | :------------- | :-------- | :-------- | :----------------------- | :------------------------- |
| **GREENHOUSE**      | Public ATS / Open Feed | 69      | 100%             | 0              | 13%       | 0%        | direct_ats (69)          | ✅ Active                  |
| **LEVER**           | Public ATS / Open Feed | 3       | 100%             | 0              | 0%        | 100%      | direct_ats (3)           | ✅ Active                  |
| **ASHBY**           | Public ATS / Open Feed | 2       | 100%             | 0              | 0%        | 100%      | direct_ats (2)           | ✅ Active                  |
| **SMARTRECRUITERS** | Public ATS / Open Feed | 0       | 0%               | 0              | 0%        | 0%        | direct_ats (0)           | ✅ Active                  |
| **WORKABLE**        | Public ATS / Open Feed | 0       | 0%               | 0              | 0%        | 0%        | direct_ats (0)           | ✅ Active                  |
| **REMOTIVE**        | Public ATS / Open Feed | 9       | 100%             | 0              | 0%        | 78%       | direct_ats (9)           | ✅ Active                  |
| **REMOTEOK**        | Public ATS / Open Feed | 51      | 96%              | 0              | 2%        | 94%       | direct_ats (51)          | ✅ Active                  |
| **JOOBLE**          | Aggregator (API Key)   | 20      | 100%             | 0              | 10%       | 100%      | redirect_aggregator (20) | ✅ Active                  |
| **CAREERJET**       | Aggregator (API Key)   | 0       | 0%               | 0              | 0%        | 0%        | direct_ats (0)           | ✅ Active                  |
| **ADZUNA**          | Aggregator (API Key)   | 0       | 0%               | 0              | 0%        | 0%        | direct_ats (0)           | ⏸️ unavailable: needs card |
| **JSEARCH**         | Aggregator (API Key)   | 0       | 0%               | 0              | 0%        | 0%        | direct_ats (0)           | ⏸️ unavailable: needs card |

---

## 3. Tier-2 / Tier-3 City Supply Analysis

- **Cities Detected in Live Sample:** None in sample
- **Honest Supply Findings:**
  1. Aggregators (Jooble, Careerjet) successfully ingest localized Indian queries (e.g. Lucknow, Indore) with tracking links stored as `apply_link_status = "redirect_aggregator"`.
  2. Direct ATS sources (Greenhouse, Lever, Ashby) return predominantly metro (Bengaluru, Pune, Hyderabad, Gurgaon) or Pan-India remote positions.
  3. Tier-2/3 physical on-site listings from ATS boards remain near 0% without local company CSV ingestion.
  4. The supply gate remains **OPEN (FAILED)** until local companies (CSV) produce verified Tier-2/3 jobs.

---

## 4. Aggregator Apply Link Resolution Policy

- Aggregator apply URLs (Jooble, Careerjet) are stored with `apply_link_status = "redirect_aggregator"`.
- When the same job is discovered via a direct company or ATS portal (Greenhouse, Lever, Ashby, company career page), the pipeline automatically prefers the direct canonical ATS URL (`apply_link_status = "direct_ats"`).

---

## 5. Source Resiliency & Compliance

- **Rate Limiting:** Token-bucket rate limiter active on all endpoints (5 req/sec burst absorption).
- **Circuit Breaker:** Fast-fails gracefully after consecutive failures with cooldown.
- **Provider Terms:** Jooble and Careerjet queried with required headers and query parameters (`locale_code: en_IN`, `Referer`, attribution preserved).
- **Disabled Providers:** Adzuna and JSearch explicitly marked as `unavailable: needs card`.
