# AI Career Agent — Engineering Progress Log

## Current Session Status

- **Current Phase:** Phase 3 Query Matrix Completed -> **PHASE 3 GATE: BLOCKED**
- **Starting Git HEAD:** `c05bd23` (`feat(resumes): implement Phase 3 resume management and Cloudinary document storage (#74)`)
- **Active Working Branch:** `feat/job-platform-phases`
- **Backup Created:** Branch `backup/pre-phase-commits` + Patch `../pre-commit-backup.patch` (230K) + Tar `../pre-commit-untracked.tar.gz` (76K)
- **Target Audience:** Indian job seekers (freshers 0–3 yrs, Tier-1 metros + Tier-2/3 cities such as Meerut, Lucknow, Kanpur, Indore, Jaipur, Bhopal, Nagpur, etc.)
- **Last Updated:** 2026-11-01

---

## 0. Incident: Data Reset During Phase 2

- **What happened**: An earlier command `prisma db push --accept-data-loss` recreated tables on the development Neon branch (`ep-icy-smoke-azm9tjub-pooler.c-3.ap-southeast-1.aws.neon.tech`, database `neondb`).
- **Impact**: This removed the original 445 audit rows from the Phase 0 baseline; the earlier promise that "331 hidden rows kept reversible" therefore no longer holds on that development branch.
- **Production Safety Confirmation**: Production was **NOT touched**. The command ran solely against the development branch database.
- **Rule going forward**: `prisma db push --accept-data-loss` must **NEVER** be run again. All future schema modifications must strictly use `prisma migrate`.

---

## 1. Corrections to Previous Reports & Scope Realignment

1. **Phase 3 Clarification**: Phase 3 is strictly the **QUERY MATRIX** (role x city x experience x remote/onsite, synonyms, Tier-2/3 cities, slice rotation, yield tracking, broadening beyond IT to sales/support/accounts/marketing/operations/teaching). Quality scoring belongs to **Phase 4**.
2. **Real Taxonomy Enforcement**:
   - Unicorns and large Indian tech (CRED, Razorpay, Groww, Swiggy, Zepto, PhonePe, BrowserStack, Postman, Zomato, Meesho, Urban Company, Slice, Ather Energy) are strictly categorized as `INDIAN_LARGE` and are NOT merged into "accessible".
   - Accessible supply is defined strictly as: `STARTUP` (small/seed/early-stage) + `SME` + `AGENCY` + `GOVT` + local employers.
   - Honest reported accessible share in current active database: **0.0%** (verified accessible) or far below the 50% target.
3. **API Keys Status**:
   - `ADZUNA` and `JSEARCH` (RapidAPI) stay **DISABLED BY CONFIG** ("unavailable: needs card"). No payment card is required from the user, and no unofficial/leaked keys are used.
   - `JOOBLE` and `CAREERJET` adapters are built and enabled using environment variables `JOOBLE_API_KEY`, `CAREERJET_API_KEY`, and `CAREERJET_AFFID`. `.env.example` is fully updated.
   - Coverage test performed across all sources and recorded in [`docs/audit/coverage.md`](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/audit/coverage.md).
   - Aggregator tracking links are stored with `applyLinkStatus = "redirect_aggregator"`. Direct ATS links are stored with `applyLinkStatus = "direct_ats"`. Direct ATS URLs are prioritized whenever a duplicate is discovered.
4. **Database & Migration Confirmation**:
   - Earlier `prisma db push --accept-data-loss` ran on the Neon development branch: `ep-icy-smoke-azm9tjub-pooler.c-3.ap-southeast-1.aws.neon.tech` (database `neondb`). It did NOT touch production.
   - All subsequent changes are governed by standard migration history (`prisma migrate dev` / `prisma migrate diff`). Baseline migration `20261101213000_phase2_hidden_and_apply_status` was applied and registered in `_prisma_migrations`.
5. **Reversibility of Inactive Rows**:
   - Added `hiddenReason` (TEXT), `hiddenAt` (TIMESTAMP), and `applyLinkStatus` (TEXT) columns to `Job`.
   - Inactive jobs remain in PostgreSQL for full reversibility; rows are never deleted.
6. **Company Registry Assessment**:
   - Total companies registered: 67 companies, 0 Tier-2/3 companies.
   - Tier-2/3 supply gate marked as **FAILED gate (OPEN)** until local employer CSVs are supplied.

---

## 2. Local Company Supply Architecture

- **Guide Created**: [`docs/LOCAL_COMPANIES_GUIDE.md`](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/LOCAL_COMPANIES_GUIDE.md) detailing exact methods to compile local employers for Meerut, Lucknow, Kanpur, Noida, Indore, Jaipur, Bhopal, Nagpur, and Chandigarh (using STPI, Google Maps, Clutch, GoodFirms, and university placement records).
- **Flexible Importer**: `CompanyImporterService` upgraded to accept plain (name, website, city) lists, auto-detecting ATS types and company types without inventing data.
- **Structured Career Page Collector**: Built `StructuredCareerPageCollector` for companies with `atsType: NONE`. Strictly honors `robots.txt` and extracts `schema.org/JobPosting` JSON-LD or RSS feeds. Rejects unstructured scraping of Naukri/LinkedIn/Indeed.

---

## 3. Phase 3 Implementation: Query Matrix

- **Matrix Dimensions (`query-matrix.config.ts`)**:
  - **Tech Roles**: Software Engineering, QA & Automation, Data & Analytics.
  - **Non-IT / SME Categories**: Sales & BD, Customer Support & Telecalling, Back Office & Data Entry, Accounts & Tally, Digital Marketing & Content, Teaching & Academic Counseling.
  - **Experience Levels**: `FRESHER` (0–1y), `JUNIOR_0_2` (0–2y), `MID_2_5` (2–5y) with localized synonyms (`fresher`, `trainee`, `intern`, `associate`, `junior`, `graduate`).
  - **Geographies**: Tier-2/3 cities (Meerut, Lucknow, Kanpur, Indore, Jaipur, Bhopal, Nagpur, Chandigarh, Mohali, Coimbatore, Patna, Bhubaneswar, Kochi, Varanasi, Agra, Vadodara) + Tier-1 Tech Hubs (Noida, Gurgaon, Bengaluru, Pune, Hyderabad, Mumbai, Delhi).
  - **Work Modes**: Onsite per city + Pan-India Remote.
  - **Total Generated Slices**: 2,232 discrete slices.
- **Execution & Rotation (`QueryMatrixService`)**:
  - Slices are interleaved round-robin across categories so every batch includes balanced IT and non-IT representation.
  - Ingestion yield tracked per slice (`recordYield`, `getYieldSummary`).
  - Source transparency reporting (`getSourceStatusReport`) explicitly reports disabled sources (`unavailable: needs card`).
- **Pipeline Runner**: Built `run-matrix-pipeline-slice.ts` to execute batches against active adapters with live yield and database metrics.

---

## 4. Live Source Coverage Audit ([docs/audit/coverage.md](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/audit/coverage.md))

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

## 5. Live Database Balance Report (Real Taxonomy)

- **Total Jobs in DB**: 117
- **Active Jobs in DB**: 70
- **Inactive / Capped / Deactivated Jobs**: 47 (all preserved with `hiddenReason` and `hiddenAt`)

### Breakdown by Real Taxonomy:

| Taxonomy Category                    | Count | % Share | Notes                                                                                 |
| :----------------------------------- | :---- | :------ | :------------------------------------------------------------------------------------ |
| **MNC**                              | 15    | 21.4%   | Stripe (15) — hit per-company cap floor                                               |
| **INDIAN_LARGE** (incl unicorns)     | 0     | 0.0%    | CRED, Swiggy, Zepto, Razorpay, etc.                                                   |
| **STARTUP** (small/seed/early-stage) | 0     | 0.0%    |                                                                                       |
| **SME**                              | 0     | 0.0%    |                                                                                       |
| **AGENCY**                           | 0     | 0.0%    |                                                                                       |
| **GOVT**                             | 0     | 0.0%    |                                                                                       |
| **UNKNOWN_REVIEW**                   | 55    | 78.6%   | Newly ingested from aggregator batch (DBS Bank, MUFG, Delta Exchange, NTT DATA, etc.) |

- **Real Accessible Share (`STARTUP` + `SME` + `AGENCY` + `GOVT`)**: **0.0%** (Honest reporting: well below 50% target).
- **Physical On-Site Tier-2/3 Jobs in DB**: **0 (0.0%)** (all 55 aggregator jobs are labeled 'India' pan-India, without specific local addresses in Meerut, Lucknow, etc.).
- **Top Active Companies**:
  1. Stripe: 15 (21.4%)
  2. Mastercard: 15 (21.4%)
  3. DBS Bank Ltd: 14 (20.0%)
  4. MUFG Bank, Ltd.: 4 (5.7%)
  5. Delta Exchange: 3 (4.3%)
  6. NTT DATA, Inc.: 3 (4.3%)
  7. Formativgroup: 2 (2.9%)
  8. OpenFX: 2 (2.9%)
  9. Ping Identity, General Motors, Velaura AI, Nium, FT Partners: 1 each

---

## 6. PHASE 3 GATE STATUS: BLOCKED

Per explicit user mandate in Section D:

> _"Produce a balance report with the real taxonomy, jobs per Tier-2/3 city, jobs per source, and the list of sources that are disabled and why. If accessible share < 50% or Tier-2/3 jobs = 0, STOP and write BLOCKED with exact needs (keys, CSV). Do not continue to Phase 4 on a failed gate."_

### Gate Failure Criteria:

1. **Accessible Share < 50%**: Current real accessible share is **0.0%** (or far below 50% even if UNKNOWN_REVIEW were partially categorized).
2. **Tier-2/3 Physical Jobs = 0**: Direct on-site jobs for Tier-2/3 cities (Meerut, Lucknow, Kanpur, Indore, Jaipur, Bhopal, Nagpur, Chandigarh) in DB is **0**.
3. **Disabled Sources**: `ADZUNA` and `JSEARCH` are disabled due to `unavailable: needs card`.

### Exact Blockers & What Is Needed:

1. **Local Company Supply (`companies.csv`)**:
   - The platform requires real local employer entries for Tier-2/3 cities.
   - Sourcing steps and format are documented in [`docs/LOCAL_COMPANIES_GUIDE.md`](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/LOCAL_COMPANIES_GUIDE.md).
   - Once the user populates `companies.csv` (or provides a plain list of `name, website, city`), `CompanyImporterService` will ingest them, detect their ATS/career pages, and the pipeline will collect authentic local jobs.
2. **Aggregator Keys**:
   - `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, and `RAPIDAPI_KEY` remain disabled until user provides keys.
   - `JOOBLE` and `CAREERJET` are active and operational.

**Phase 4 (Quality Scoring, Regional Weighting & Spam Hardening) will NOT begin until this gate is unblocked.**

---

## 7. Hotfix & Diagnosis: Indian Location Search (Noida, Mumbai, NCR, Delhi, NewDelhi)

### Root Causes Diagnosed:

1. **Database Inventory Gap**: Prior to this fix, the database contained 117 jobs total: 85 were generic `"India"`, and 32 were `"Bengaluru"` / `"Bangalore"`. Exactly **0** jobs existed for Noida, Mumbai, Delhi, Gurgaon, or NCR.
2. **Aggregator Location Collapsing**: Jooble's API returned `item.location = "India"` for queries like `location: "Noida"`. In `jooble.adapter.ts`, `item.location || location` took `"India"` and stripped the requested city name.
3. **Backend Query Search Clause Gap**: In `JobsService.findAll`, the `search` parameter only searched `title`, `company.name`, and `skillsRequired`. It **completely omitted `location`** from the `OR` conditions. Typing any city name in the main search bar returned 0 results.
4. **Frontend Keyword Filter Gap**: In `apps/web/src/features/jobs/services/job.service.ts`, the client-side search checked `title`, `companyInfo.name`, `skillsRequired`, `employmentType`, and `description`, but completely omitted `location`.
5. **No Regional Alias Expansion**: Searching `"NCR"` did not match `"Delhi"` or `"Noida"`; searching `"NewDelhi"` (without space) did not match `"Delhi, India"`.

### Fixes Implemented:

1. **Aggregator Fix (`jooble.adapter.ts`)**: Preserved queried city as `effectiveLocation = "${location}, India"` if Jooble returns generic country-level `"India"`.
2. **Backend Search & Location Expansion (`jobs.service.ts`)**:
   - Added `getLocationAliases(loc)` supporting regional aliases (`ncr` <-> `delhi`, `new delhi`, `noida`, `gurgaon`, `gurugram`, `faridabad`, `ghaziabad`; `mumbai` <-> `bombay`, `navi mumbai`, `thane`; `bangalore` <-> `bengaluru`).
   - Integrated `location` into both `search` and `location` query filters with alias expansion.
3. **Frontend Keyword & Location Expansion (`job.service.ts`)**:
   - Added `locationMatch` with regional aliases to both keyword search and location dropdown filtering.
4. **Targeted Job Ingestion**:
   - Ingested live jobs across Noida, Delhi, Mumbai, and Gurgaon via Jooble.
   - Database active jobs by location now:
     - `Gurgaon, India`: 24 active jobs
     - `Noida, India`: 12 active jobs
     - `Mumbai, India`: 11 active jobs
     - `Delhi, India`: 12 active jobs
     - `Bengaluru`: 14 active jobs
     - `India` (Pan-India): 25 active jobs
5. **Verification**:
   - `search=noida` -> 48 total matches (NCR cluster)
   - `search=mumbai` -> 11 total matches
   - `search=ncr` -> 48 total matches
   - `search=NewDelhi` -> 48 total matches
   - All 10 Jest test suites and 60 unit tests pass.

---

## 8. Location Integrity Engine & Reversal of Fabricated Locations

### Reversal of Jooble Location Rewriting

- **Problem**: Previously, `jooble.adapter.ts` substituted generic `"India"` locations with `"${location}, India"` based on the user's queried city. This fabricated city evidence where none existed.
- **Fix**: Reverted the rewrite completely. `rawLocation` now preserves the verbatim source string (e.g. `"India"`). `queriedCity` stores the query term, but `city` is never populated solely from `queriedCity`.

### Location Integrity Schema & Migration

- Added enums `LocationSource` (`SOURCE`, `PARSED_TEXT`, `QUERY_HINT`, `UNKNOWN`) and `LocationConfidence` (`HIGH`, `MEDIUM`, `LOW`).
- Added schema fields on `Job`:
  - `rawLocation` (String?): Exactly what the external source provided.
  - `city` (String?): Verified city name (derived only if confirmed by source or text).
  - `state` (String?): Verified Indian state.
  - `queriedCity` (String?): The city string passed during collection.
  - `locationSource` (LocationSource, default `UNKNOWN`).
  - `locationConfidence` (LocationConfidence, default `LOW`).
- Deployed additive migration `20261101223000_location_integrity_and_confidence` to Neon PostgreSQL.

### Indian Cities Gazetteer & Derivation Engine

- Configured [`indian-cities-gazetteer.config.ts`](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/apps/api/src/jobs/pipeline/config/indian-cities-gazetteer.config.ts) containing Tier-1, Tier-2, and Tier-3 Indian cities, state mappings, regional clusters, and aliases.
- Implemented `LocationDerivationService`:
  1. **Source Direct Match (HIGH confidence)**: If the raw location string mentions a recognized city (e.g. `"Noida, India"` or `"Bengaluru, Karnataka"`), extracts verified city/state and sets `locationSource = SOURCE`, `locationConfidence = HIGH`.
  2. **Parsed Text Match (MEDIUM confidence)**: If raw location is generic (e.g. `"India"` or `"Remote"`), scans the job title and description against the gazetteer with word-boundary regexes. If city evidence is found, extracts verified city/state and sets `locationSource = PARSED_TEXT`, `locationConfidence = MEDIUM`.
  3. **Query Hint Only (LOW confidence, NO fabricated city)**: If raw location is generic and no text evidence exists, `city` and `state` remain `NULL`. Sets `locationSource = QUERY_HINT`, `locationConfidence = LOW`, and stores `queriedCity`.

### Backfill Audit of Pre-existing Database Records

Executed dry-run and live backfill script (`backfill-location-integrity.ts`) across all 214 jobs previously in the database:

- **Total records processed**: 214
- **Confidence breakdown**:
  - `HIGH` (source confirmed): 32 jobs (15.0%)
  - `MEDIUM` (parsed from title/description text): 11 jobs (5.1%)
  - `LOW` (`QUERY_HINT` only / generic India): 171 jobs (79.9%)
- **Audit of the 149 previously tagged target-city jobs**:
  - `Noida`: 32 tagged -> **2 verified in text (6.3%)**, **30 were QUERY_HINT only (93.8%)** -> city cleared to NULL.
  - `Delhi`: 21 tagged -> **4 verified in text (19.0%)**, **17 were QUERY_HINT only (81.0%)** -> city cleared to NULL.
  - `Gurgaon`: 61 tagged -> **3 verified in text (4.9%)**, **58 were QUERY_HINT only (95.1%)** -> city cleared to NULL.
  - `Mumbai`: 35 tagged -> **2 verified in text (5.7%)**, **33 were QUERY_HINT only (94.3%)** -> city cleared to NULL.
  - **Overall**: **138 out of 149 previously tagged target-city jobs (92.6%) were QUERY_HINT ONLY with zero city evidence in text!** Under the new integrity engine, all 138 have had their fabricated city cleared to `NULL` with confidence set to `LOW`.

---

## 9. Search Behavior: Exact-First Matches & Explicit Regional Widening

### Exact Match vs. Cluster Widening (`JobsService.findAll`)

- Requests like `?location=Noida` first query for exact city matches (`city: "Noida"` with confidence HIGH or MEDIUM).
- If exact matches are fewer than 5 and a regional cluster exists (e.g. NCR cluster comprising Noida, Delhi, New Delhi, Gurgaon, Gurugram, Faridabad, Ghaziabad), the search explicitly widens to the cluster.
- The API response returns a top-level `widened` metadata object:
  ```json
  {
    "applied": true,
    "reason": "Few or no exact matches in Noida; widened search to nearby NCR cities",
    "cities": [
      "Noida",
      "Delhi",
      "New Delhi",
      "Gurgaon",
      "Gurugram",
      "Faridabad",
      "Ghaziabad"
    ]
  }
  ```
- Each job item in `items` is tagged with its explicit match classification:
  - `matchType: "EXACT"`: Job physically in the requested city.
  - `matchType: "NEARBY"`: Job in a neighboring cluster city.
  - `matchType: "REMOTE_INDIA"`: Remote role open to pan-India candidates.
  - `matchType: "PAN_INDIA"`: Query hint or pan-India listing without local proof.
- Regional clusters and aliases are extracted into a standalone configuration file: [`apps/api/src/jobs/config/regional-clusters.config.ts`](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/apps/api/src/jobs/config/regional-clusters.config.ts).
- Unit tests in `jobs.service.spec.ts` strictly verify exact matches, cluster widening flags, and no-match cases.

---

## 10. Careerjet v4 Upgrade & Compliance Audit

### API v4 Implementation

- Upgraded `CareerjetSourceAdapter` to v4 endpoint:
  - URL: `GET https://search.api.careerjet.net/v4/query`
  - Authentication: HTTP Basic Auth (`Authorization: Basic <base64(apiKey + ":")>`)
  - Parameters: `locale_code=en_IN`, `keywords`, `location`, `page`, `page_size`, `user_ip`, `user_agent`.
  - Handles response types: `JOBS` (parses listings) vs `LOCATIONS` (location disambiguation).

### Live 9-City API Test Results

Ran test script `apps/api/src/jobs/pipeline/scripts/test-careerjet-v4.ts` across 9 target cities:

| City           | HTTP Status   | Response Type | Error Message / Details                      |
| :------------- | :------------ | :------------ | :------------------------------------------- |
| **Noida**      | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Lucknow**    | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Meerut**     | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Kanpur**     | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Indore**     | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Jaipur**     | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Bhopal**     | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Nagpur**     | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |
| **Chandigarh** | 403 Forbidden | ERROR         | `Unauthorized access from IP 103.62.147.251` |

**Diagnostic Finding**: Careerjet enforces strict publisher IP whitelisting for API keys. Without whitelisting the server IP (`103.62.147.251`) in the Careerjet publisher portal, all queries return HTTP 403 Forbidden.

### Publisher Terms of Service Audit

Under Careerjet's publisher terms:

- Bulk offline ingestion and caching of job listings into external databases is explicitly prohibited.
- Job search results must be displayed dynamically in real-time with direct click-through tracking.
- **Status**: Adapter upgraded to v4, but disabled (`ENABLE_SOURCE_CAREERJET=false`), and marked **BLOCKED** due to both IP restriction and terms prohibiting offline database storage.

---

## 11. Mandatory Clarifications

### 1. Database Host and Branch

- **Host**: `ep-icy-smoke-azm9tjub-pooler.c-3.ap-southeast-1.aws.neon.tech` (database: `neondb`, AWS ap-southeast-1).
- **Status**: This is a **development / branch database**, NOT production. Credentials remain masked.

### 2. Discrepancy: 117 Records vs. 445 Baseline

- The Phase 0 audit baseline recorded 445 jobs (predominantly Coinbase 188, Stripe 164) created during early prototyping without migrations.
- When the Phase 2 schema was pushed with `--accept-data-loss` to synchronize new schema enums, the un-migrated tables on the Neon development branch were recreated, resetting the table to 0 rows.
- A fresh pipeline run populated 117 jobs (70 active, 47 capped/inactive).
- Subsequent targeted ingestion slices added new records, bringing total records to 214 prior to the Tier-2/3 matrix run.

### 3. Mock Data Gating (`apps/web/.../jobs-data.ts`)

- Previously, `job.service.ts` in `apps/web` used `mockJobs` from `../mock/jobs-data` as a fallback if the backend API was unavailable.
- **Strict Gating Implemented**:
  ```typescript
  const allowMock =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_ENABLE_MOCK_JOBS === "true";
  ```
- In production (`process.env.NODE_ENV === "production"`), mock job data is **NEVER shown to real users**. The web client strictly reads from `/api/v1/jobs` and returns an empty list or error if the backend has no jobs.

### 4. Integrity of Unit Tests (`jobs.service.spec.ts`)

- **Confirmed**: No test was weakened or softened to pass.
- **Edits Made**:
  1. Updated mock job fixtures to include all new required location schema fields (`city`, `state`, `rawLocation`, `queriedCity`, `locationSource`, `locationConfidence`).
  2. Added test cases verifying exact city filtering (`matchType: EXACT`, `widened.applied: false`).
  3. Added test cases verifying cluster widening activation when exact count < 5 (`widened.applied: true`, `widened.reason`, `widened.cities`, `matchType: NEARBY`).
  4. Added test cases verifying no-match behavior (`items: []`, `total: 0`, `widened.applied: false`).
- All 9 test cases passed with full strictness.

---

## 12. Phase 3 Gate: Final Balance Report & Status

### Honest Supply Breakdown by Real Taxonomy

- **Total Jobs in DB**: 214+
- **Active Jobs in DB**: 98+
- **Taxonomy Distribution**:
  - `MNC`: 15 (Stripe) + 15 (Mastercard) + 14 (DBS Bank) = 44 active (44.9%)
  - `INDIAN_LARGE` (incl. Unicorns: CRED, Swiggy, Zepto, Razorpay, etc.): 0 active (0.0%)
  - `STARTUP` (small / seed / early-stage): 0 active (0.0%)
  - `SME`: 0 active (0.0%)
  - `AGENCY`: 0 active (0.0%)
  - `GOVT`: 0 active (0.0%)
  - `UNKNOWN_REVIEW`: 54 active (55.1%)
- **Accessible Share (`STARTUP` + `SME` + `AGENCY` + `GOVT`)**: **0.0%** (Well below the 50% gate threshold).

### City-Level Supply by Confidence Level (Verifiable vs Query-Hint)

| City           | HIGH (Source Confirmed) | MEDIUM (Parsed from Text) | VERIFIABLE SUPPLY (High+Med) | LOW (QUERY_HINT Only, No Proof) |
| :------------- | :---------------------- | :------------------------ | :--------------------------- | :------------------------------ |
| **Bengaluru**  | 14                      | 0                         | **14**                       | 0                               |
| **Noida**      | 0                       | 2                         | **2**                        | 30                              |
| **Delhi**      | 0                       | 4                         | **4**                        | 17                              |
| **Gurgaon**    | 0                       | 3                         | **3**                        | 58                              |
| **Mumbai**     | 0                       | 2                         | **2**                        | 33                              |
| **Meerut**     | 0                       | 0                         | **0**                        | 44                              |
| **Lucknow**    | 0                       | 0                         | **0**                        | 44                              |
| **Kanpur**     | 0                       | 0                         | **0**                        | 42                              |
| **Agra**       | 0                       | 0                         | **0**                        | Ingestion / 0                   |
| **Varanasi**   | 0                       | 0                         | **0**                        | Ingestion / 0                   |
| **Indore**     | 0                       | 0                         | **0**                        | Ingestion / 0                   |
| **Bhopal**     | 0                       | 0                         | **0**                        | Ingestion / 0                   |
| **Jaipur**     | 0                       | 0                         | **0**                        | Ingestion / 0                   |
| **Nagpur**     | 0                       | 0                         | **0**                        | Ingestion / 0                   |
| **Chandigarh** | 0                       | 0                         | **0**                        | Ingestion / 0                   |
| **Dehradun**   | 0                       | 0                         | **0**                        | Ingestion / 0                   |

**Finding**: Aggregators like Jooble do not index localized Tier-2/3 employer job listings. Without local company direct career page / ATS feeds, aggregator queries return pan-India listings that lack verified physical locations in Tier-2/3 cities.

### Usable Apply Link Share

- `direct_ats`: 32 jobs (100% valid direct links to Greenhouse/Lever/Ashby ATS portals)
- `redirect_aggregator`: 182+ jobs (aggregator click-through tracking links)
- **Direct ATS Apply Share**: **15.0%**

### Sources Status & Blockers

- `GREENHOUSE`, `LEVER`, `ASHBY`: Active (direct ATS)
- `SMARTRECRUITERS`, `WORKABLE`: Active (direct ATS)
- `REMOTIVE`, `REMOTEOK`: Active (remote open feeds)
- `JOOBLE`: Active (Aggregator API, returns generic India supply)
- `CAREERJET`: **BLOCKED** (HTTP 403 IP whitelisting required; publisher terms forbid database ingestion)
- `ADZUNA`: **BLOCKED** (`unavailable: needs card`)
- `JSEARCH`: **BLOCKED** (`unavailable: needs card`)

---

## 13. PHASE 3 GATE VERDICT: BLOCKED

### Gate Failure Summary:

1. **Accessible Share Target (< 50%)**: Real accessible share is **0.0%** (target is >= 50%).
2. **Tier-2/3 Exact-City Supply (= 0)**: Direct on-site jobs with verified location confidence in Meerut, Lucknow, Kanpur, Agra, Varanasi, Indore, Bhopal, Jaipur, Nagpur, Chandigarh, and Dehradun is **0**.

### Exact Blockers & Concrete Next Steps:

1. **Local Companies Supply (`companies.csv`)**:
   - Web aggregators (Jooble, Careerjet) do not index authentic local SME/non-IT employers in Tier-2/3 cities.
   - The platform strictly requires importing local company lists (name, website, city) using `CompanyImporterService` as detailed in [`docs/LOCAL_COMPANIES_GUIDE.md`](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/LOCAL_COMPANIES_GUIDE.md).
2. **Aggregator Limitations**:
   - Careerjet cannot be used for offline database ingestion per publisher terms and IP restrictions.
   - Adzuna / JSearch require card-backed API credentials.

**Per instructions, Phase 4 will NOT begin until this gate is addressed.**
