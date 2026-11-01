# Setup Guide: Job Collection API Keys

This guide explains how to configure API source adapters for the AI Career Agent job collection pipeline.

## Active & Free Providers

### 1. Direct ATS Adapters (No Keys Required)

The direct ATS adapters query publicly accessible, official employer career feeds. No API keys or authentication required:

- **Greenhouse** (`boards-api.greenhouse.io`)
- **Lever** (`api.lever.co/v0/postings`)
- **Ashby** (`api.ashbyhq.com/posting-api`)
- **SmartRecruiters** (`api.smartrecruiters.com/v1/companies`)
- **Workable** (`apply.workable.com/api/v1/widget/accounts`)
- **Remotive & RemoteOK** (Open remote feeds)

Enable in `.env`:

```bash
ENABLE_SOURCE_GREENHOUSE=true
ENABLE_SOURCE_LEVER=true
ENABLE_SOURCE_ASHBY=true
ENABLE_SOURCE_SMARTRECRUITERS=true
ENABLE_SOURCE_WORKABLE=true
ENABLE_SOURCE_REMOTIVE=true
ENABLE_SOURCE_REMOTEOK=true
```

---

### 2. Jooble API (Free Key)

Jooble provides an XML/JSON job search API for developers:

1. Register for free at: `https://jooble.org/api/about`
2. Add your key to `apps/api/.env`:
   ```bash
   ENABLE_SOURCE_JOOBLE=true
   JOOBLE_API_KEY=<insert-free-key-from-jooble>
   ```

_(Note: Locations returned by Jooble are stored in `rawLocation` and subject to gazetteer derivation to ensure location integrity)._

---

### 3. Careerjet v4 (Publisher Account)

Careerjet requires an active publisher account:

1. Register at: `https://www.careerjet.net/partners/`
2. Note that Careerjet enforces **IP whitelisting** on their API servers. Requests from un-whitelisted IPs will return HTTP 403 Forbidden.
3. Careerjet's publisher terms prohibit offline database caching/storage of listings. Therefore, `ENABLE_SOURCE_CAREERJET` is set to `false` by default.
   ```bash
   ENABLE_SOURCE_CAREERJET=false
   CAREERJET_API_KEY=<insert-api-key>
   CAREERJET_AFFID=<insert-affid>
   ```

---

### 4. Adzuna & JSearch (RapidAPI) — Card Required

Both providers require a credit card during registration and are disabled by default (`unavailable: needs card`):

```bash
ENABLE_SOURCE_ADZUNA=false
ENABLE_SOURCE_JSEARCH=false
```

When keys become available:

```bash
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
RAPIDAPI_KEY=your_rapidapi_key
```
