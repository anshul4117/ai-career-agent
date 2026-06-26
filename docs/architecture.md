# AI Career Agent — System Architecture

## Overview

AI Career Agent is a monorepo-based web platform designed to help candidates discover high-quality job opportunities, optimize resumes, generate cover letters, and manage the complete application lifecycle.

The architecture prioritizes:

- Scalability
- Maintainability
- Modularity
- Developer Experience
- AI Integration
- Cost Efficiency

---

## Architecture Principles

### 1. Monorepo

The entire platform will exist in a single repository.

**Benefits:**

- Easier development
- Shared types
- Shared validation
- Better AI coding experience
- Simplified deployments

**Structure:**

```
ai-career-agent/
├── apps/
├── packages/
└── docs/
```

### 2. Modular Monolith

Version 1 will use a modular monolith architecture.

**Modules:**

- Authentication
- Users
- Profiles
- Jobs
- Applications
- Resumes
- Cover Letters
- AI

**Benefits:**

- Faster development
- Easier debugging
- Lower operational cost
- Easier deployment

Microservices are not required in Version 1.

---

## Technology Stack

### Frontend

| Concern | Technology |
| ------- | ---------- |
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui |
| State Management | Zustand |
| Forms | React Hook Form |
| Validation | Zod |

### Backend

| Concern | Technology |
| ------- | ---------- |
| Framework | NestJS |
| Language | TypeScript |
| API Style | REST API |
| Validation | Class Validator |
| Authentication | JWT |
| Authorization | Role-Based Access Control (Future) |

### Database

| Concern | Technology |
| ------- | ---------- |
| Database | PostgreSQL |
| ORM | Prisma |

**Reasons:**

- Strong relational support
- Type safety
- Excellent developer experience
- Scalable architecture

### Cache Layer

| Concern | Technology |
| ------- | ---------- |
| Technology | Redis |

**Responsibilities:**

- Session caching
- Job caching
- AI result caching
- Queue support

### Queue System

| Concern | Technology |
| ------- | ---------- |
| Technology | BullMQ |

**Responsibilities:**

- Resume processing
- Job crawling
- Email processing
- AI tasks

All long-running operations should be executed asynchronously.

### AI Layer

| Concern | Technology |
| ------- | ---------- |
| Provider | OpenAI |

**Responsibilities:**

- Resume Parsing
- Job Matching
- Resume Optimization
- Cover Letter Generation

AI should not be used for standard CRUD operations.

---

## Frontend Architecture

**Location:** `apps/web`

### Responsibilities

Frontend handles:

- User Interface
- Authentication Flows
- Dashboard
- Job Listings
- Profile Management
- Application Tracking

Business logic should remain in the backend.

### Frontend Folder Structure

```
apps/web/src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
└── providers/
```

### Feature-Based Design

Example:

```
features/jobs/
├── components/
├── hooks/
├── services/
└── types/
```

Every major feature should have its own feature module.

---

## Backend Architecture

**Location:** `apps/api`

### Responsibilities

Backend handles:

- Authentication
- Database Operations
- AI Processing
- Job Discovery
- Match Scoring
- Business Logic

### Backend Folder Structure

```
apps/api/src/
├── modules/
├── common/
├── config/
├── database/
├── integrations/
├── queues/
└── ai/
```

---

## Backend Modules

### Auth Module

**Responsibilities:**

- Registration
- Login
- JWT Authentication
- OAuth Providers

### Profile Module

**Responsibilities:**

- User Profiles
- Skills
- Education
- Experience

### Resume Module

**Responsibilities:**

- Resume Upload
- Resume Storage
- Resume Parsing

### Jobs Module

**Responsibilities:**

- Job Storage
- Job Search
- Job Filtering
- Job Scoring

### Applications Module

**Responsibilities:**

- Application Tracking
- Status Management

### Cover Letter Module

**Responsibilities:**

- Cover Letter Generation
- Cover Letter Storage

### AI Module

**Responsibilities:**

- AI Agent Management
- Prompt Execution
- AI Service Coordination

---

## AI Architecture

AI functionality will be isolated from business logic.

**Structure:**

```
ai/
├── agents/
├── prompts/
└── tools/
```

### AI Agents

#### Resume Parser Agent

**Responsibilities:**

- Resume Analysis
- Skill Extraction
- Experience Extraction

#### Job Match Agent

**Responsibilities:**

- Resume vs Job Comparison
- Match Scoring
- Gap Analysis

#### Resume Optimizer Agent

**Responsibilities:**

- ATS Improvements
- Keyword Optimization

#### Cover Letter Agent

**Responsibilities:**

- Personalized Cover Letter Creation

---

## Integrations Layer

```
integrations/
├── openai/
├── email/
├── storage/
└── job-sources/
```

**Purpose:**

- Isolate third-party services
- Prevent vendor lock-in
- Simplify testing

---

## Job Discovery Architecture

```
Job Sources
    ↓
Normalization
    ↓
Deduplication
    ↓
Quality Scoring
    ↓
Database Storage
    ↓
User Recommendations
```

### Job Sources

**Version 1:**

- Wellfound
- YC Jobs
- Internshala
- Company Career Pages

**Future:**

- LinkedIn
- Naukri
- Indeed

---

## Job Quality Engine

Every job should receive:

### Freshness Score

Measures posting recency.

### Trust Score

Measures company credibility.

### Relevance Score

Measures candidate-job alignment.

### Quality Score

Final ranking score. Formula may evolve over time.

---

## Storage Architecture

| Asset | Storage |
| ----- | ------- |
| Resume Storage | AWS S3 |
| Generated Files | AWS S3 |
| Future | Cloudflare R2 |

---

## Email Architecture

| Concern | Technology |
| ------- | ---------- |
| Provider | Resend |

**Use Cases:**

- Account Verification
- Password Reset
- Notifications
- Daily Job Alerts

---

## Security Architecture

### Authentication

- JWT Access Tokens
- JWT Refresh Tokens

### Validation

All inputs validated.

| Layer | Tool |
| ----- | ---- |
| Frontend | Zod |
| Backend | Class Validator |

### Security Rules

- Never trust frontend input.
- Validate every request.
- Sanitize uploaded files.
- Protect private user data.

---

## Deployment Architecture

| Component | Platform |
| --------- | -------- |
| Frontend | Vercel |
| Backend | Railway or Render |
| Database | Neon PostgreSQL |
| Cache | Redis Cloud |
| Storage | AWS S3 |

---

## Monitoring (Future)

**Potential Integrations:**

- Sentry
- Better Stack
- PostHog

---

## Future Scalability

**Potential future services:**

- Auto Apply Service
- Interview Agent
- Referral Engine
- Career Intelligence Engine

These services should remain independent modules until scaling demands microservices.

---

## Architecture Decision Summary

| Concern | Decision |
| ------- | -------- |
| Frontend | Next.js |
| Backend | NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache | Redis |
| Queue | BullMQ |
| AI | OpenAI |
| Storage | AWS S3 |
| Deployment | Vercel + Railway |
| Architecture Style | Modular Monolith |
| Repository Style | Monorepo |
