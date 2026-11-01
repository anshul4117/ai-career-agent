# Guide: Building Local Company Registry for Tier-2/3 Indian Cities

This guide provides practical instructions for sourcing, verifying, and preparing local and regional employer records for the AI Career Agent platform.

---

## 1. Target Tier-2/3 Clusters

| City                                | State                 | Primary Tech & Industrial Hubs                                        | Typical Employer Segments                                                       |
| :---------------------------------- | :-------------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Meerut**                          | Uttar Pradesh         | Delhi-Meerut Expressway Corridor, Partapur Industrial Area, Mohkampur | Local IT services, digital agencies, industrial automation, education           |
| **Lucknow**                         | Uttar Pradesh         | Gomti Nagar Extension, IT City (Sultanpur Rd), Vibhuti Khand          | Software services, fintech, healthtech, BPO/KPO, e-gov contractors              |
| **Kanpur**                          | Uttar Pradesh         | Panki Industrial Area, Fazalganj, IIT Kanpur Research Park / C3i      | Engineering consultancies, software boutiques, logistics tech, edtech           |
| **Noida / Greater Noida**           | Uttar Pradesh         | Sector 62, 63, 125, 132, 142, Knowledge Park (Greater Noida)          | Scaleups, mid-sized IT, BPOs, industrial software, SMEs                         |
| **Indore**                          | Madhya Pradesh        | Super Corridor, Crystal IT Park, Vijay Nagar, Pithampur               | Product startups, SaaS, IT services, cloud operations, fintech                  |
| **Jaipur**                          | Rajasthan             | Mahindra World City (SEZ), Malviya Nagar, Mansarovar, Sitapura        | E-commerce enablers, SaaS, IT services, design studios, analytics               |
| **Bhopal**                          | Madhya Pradesh        | MP Nagar, Mandideep, BHEL ancillary clusters                          | Software development, municipal IT contractors, manufacturing IT                |
| **Nagpur**                          | Maharashtra           | MIHAN SEZ, IT Park Gayatri Nagar, Hingna MIDC                         | Engineering centers, health IT, aviation software, regional offices             |
| **Chandigarh / Mohali / Panchkula** | Punjab / Haryana / UT | IT Park (Kishangarh), Mohali Phase 8/8B/9 (QuarkCity, Bestech)        | Product startups, digital marketing agencies, mobile app boutiques, remote tech |

---

## 2. Where to Source Real Local Employers (Free & Legal)

1. **STPI (Software Technology Parks of India) Directory**:
   - Visit STPI centers for UP (Noida/Lucknow/Kanpur/Meerut), MP (Indore/Bhopal), and Punjab/Haryana.
   - STPI publishes registered export-oriented units (EOUs) with verified corporate names and domains.
2. **Google Maps Business Search**:
   - Search queries:
     - `IT company in Meerut`
     - `software development company in Lucknow`
     - `digital marketing agency in Indore`
     - `technology services in Jaipur`
   - Check official websites linked directly on Google Business Profiles to avoid fly-by-night operators.
3. **Clutch.co & GoodFirms**:
   - Filter: Location = `Lucknow`, `Indore`, `Jaipur`, `Chandigarh`, etc.
   - Rating: 4.0+ with verified client reviews.
   - Extract company name, official website URL, and verified employee size band.
4. **Local University Placement Brochures**:
   - Review recruiters listed by AKTU (Lucknow/Kanpur/Meerut), DAVV/SGSITS (Indore), MNIT (Jaipur), PEC/Panjab University (Chandigarh), VNIT (Nagpur).
   - These companies actively recruit freshers (0–1 years).

---

## 3. CSV File Format & Specification

The platform supports both a minimal 3-column format and the full 8-column schema:

### Minimal 3-Column Format (Auto-Detection Mode)

```csv
name,website,city
Webkul Software,https://webkul.com,Noida
DigiMantra Labs,https://digimantra.com,Mohali
Appinventiv,https://appinventiv.com,Noida
```

- The importer will automatically:
  1. Extract and normalize the domain.
  2. Inspect the website / career page for ATS platforms (Greenhouse, Lever, Ashby, Workable, etc.).
  3. Validate public endpoints.
  4. Classify companyType (or tag as `UNKNOWN_REVIEW` for manual verification).

### Full 8-Column Format

```csv
name,website,careerUrl,city,state,companyType,sizeBand,notes
Webkul Software,https://webkul.com,https://webkul.com/careers,Noida,Uttar Pradesh,SME,201-1000,E-commerce extensions and ERP products
Systango,https://www.systango.com,https://www.systango.com/careers,Indore,Madhya Pradesh,SME,201-1000,Web3 and enterprise custom software
Walkover,https://walkover.in,https://walkover.in/careers,Indore,Madhya Pradesh,STARTUP,51-200,SaaS product company (MSG91, Giddh)
```

---

## 4. How to Import

### Via Admin CLI (Dry-Run First)

```bash
# 1. Test parse and ATS detection without database changes
npx ts-node src/jobs/pipeline/scripts/import-companies.ts --file=../../docs/templates/companies.csv --dry-run

# 2. Live import
npx ts-node src/jobs/pipeline/scripts/import-companies.ts --file=/path/to/tier2_companies.csv
```

### Via Admin API Endpoint

```http
POST /jobs/admin/companies/import
Authorization: Bearer <ADMIN_JWT_OR_KEY>
Content-Type: application/json

{
  "dryRun": true,
  "csvContent": "name,website,city\nSystango,https://www.systango.com,Indore"
}
```

---

## 5. Rules & Safeguards

1. **No Fake Companies or Guessed Slugs**: Never guess ATS slugs (e.g., don't invent `lever.co/random`). Let the detector verify the endpoint live.
2. **No Web Scraping of Naukri/LinkedIn/Indeed**: Only ingest from direct employer career pages or authorized aggregator feeds (Jooble/Careerjet) using valid keys.
3. **Structured Data Only for Non-ATS Employers**: If an employer does not use a third-party ATS (`atsType = NONE`), the system only indexes jobs if their career page provides structured `schema.org/JobPosting` JSON-LD or a valid RSS feed, strictly respecting `robots.txt`.
