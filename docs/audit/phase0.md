# Phase 0 Baseline Audit Report

**Date:** 2026-11-01  
**Environment:** Neon PostgreSQL (Live Baseline)  
**Total Ingested Jobs:** 445  
**Active Jobs in DB:** 424  
**Spam Jobs:** 0  
**Anomaly Jobs:** 3

---

## 1. Company Distribution & Concentration Bias

- **Coinbase**: 188 jobs (44.34%)
- **Stripe**: 164 jobs (38.68%)
- **Top 2 MNC Concentration**: **83.02%** (352 / 424 jobs)
- **Top Indian Companies**:
  - CRED: 17 jobs (4.01%)
  - Swiggy: 3 jobs (0.71%)
  - BrowserStack: 3 jobs (0.71%)
  - Lemon.io: 3 jobs (0.71%)
  - Razorpay: 2 jobs (0.47%)
  - Postman: 2 jobs (0.47%)
  - Slice: 2 jobs (0.47%)
  - Urban Company: 2 jobs (0.47%)
  - Zepto: 2 jobs (0.47%)
  - PhonePe: 2 jobs (0.47%)
  - Groww: 2 jobs (0.47%)
  - Remaining 17 startups: 1 job each (0.24%)

---

## 2. Location Distribution & Foreign Remote Leakage

- **Remote - USA / US-Remote**: 165 jobs (38.9%)
- **Bengaluru / Bangalore**: 87 jobs (20.5%)
- **Remote - India**: 10 jobs (2.4%)
- **Gurgaon / Delhi**: 14 jobs (3.3%)
- **Mumbai / Pune**: 8 jobs (1.9%)
- **Global Foreign (Canada, UK, Singapore, Worldwide)**: 34 jobs (8.0%)
- **Tier-2 / Tier-3 Cities** _(Meerut, Lucknow, Kanpur, Indore, Jaipur, Bhopal, etc.)_: **0 jobs (0.0%)**
- **Unspecified / Generic Remote**: 106 jobs (25.0%)

---

## 3. Experience Level Distribution

- **Fresher / Intern (0–1 yr)**: 22 jobs (5.2%)
- **Junior (1–3 yrs)**: 27 jobs (6.4%)
- **Mid-Level (3–5 yrs)**: 65 jobs (15.3%)
- **Senior (5+ yrs)**: 70 jobs (16.5%)
- **Unstated / General**: 240 jobs (56.6%)

---

## 4. Root Causes of Imbalance

1. **Uncapped ATS Harvesting**: `AtsJobProvider` pulled entire public Greenhouse job boards for Coinbase and Stripe without per-company caps.
2. **Naive Location Filter**: The string check accepted `"Remote"`, causing US-based remote roles (`Remote - USA`, `US-Remote`) to be ingested as valid jobs.
3. **Empty Aggregators**: Adzuna and JSearch yielded 0 jobs due to missing API keys or unconfigured environment variables.
4. **Zero Tier-2/3 Querying**: No query matrix or city rotation existed to query Tier-2/3 Indian cities.
5. **No Serving Diversity**: Search sorting was `{ isIndiaJob: desc }, { qualityScore: desc }, { postedAt: desc }` without per-company or per-type re-ranking.
