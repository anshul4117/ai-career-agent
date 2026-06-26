# AI Career Agent — Master Tasks

## Legend

- [ ] Not Started
- [/] In Progress
- [x] Completed
- [-] Blocked

---

## Phase 0 — Foundation

### Project Setup

- [x] Create Monorepo Structure
- [x] Create Documentation Structure
- [x] Create Cursor Rules
- [x] Create PRD
- [x] Create Architecture Document
- [x] Create Database Design
- [x] Create Roadmap

---

## Phase 1 — Authentication

### Backend

- [ ] Create NestJS Application
- [ ] Configure Environment Variables
- [ ] Configure PostgreSQL Connection
- [ ] Configure Prisma

#### User Module

- [ ] Create User Entity
- [ ] Create User Repository
- [ ] Create User Service
- [ ] Create User Controller

#### Auth Module

- [ ] Create Auth Module
- [ ] Create Registration API
- [ ] Create Login API
- [ ] Create Logout API
- [ ] Create Refresh Token API

#### JWT

- [ ] Configure JWT Access Tokens
- [ ] Configure JWT Refresh Tokens
- [ ] Create Auth Guards

#### OAuth

- [ ] Google OAuth Setup
- [ ] Google Login API

#### Validation

- [ ] Request Validation
- [ ] Error Handling

### Frontend

#### Authentication Pages

- [ ] Login Page
- [ ] Register Page
- [ ] Forgot Password Page
- [ ] Verify Email Page

#### State Management

- [ ] Auth Store
- [ ] Auth Hooks

#### API Integration

- [ ] Login API Integration
- [ ] Register API Integration
- [ ] Logout API Integration

---

## Phase 2 — Candidate Profile

### Backend

#### Profile Module

- [ ] Create Profile Entity
- [ ] Create Profile Service
- [ ] Create Profile Controller

#### Skills

- [ ] Create Skills Entity
- [ ] Create Skills CRUD APIs

#### Education

- [ ] Create Education Entity
- [ ] Create Education CRUD APIs

#### Experience

- [ ] Create Experience Entity
- [ ] Create Experience CRUD APIs

#### Projects

- [ ] Create Projects Entity
- [ ] Create Projects CRUD APIs

### Frontend

#### Profile Pages

- [ ] Profile Dashboard
- [ ] Edit Profile Page

#### Skills UI

- [ ] Skills Form
- [ ] Skills List

#### Education UI

- [ ] Education Form
- [ ] Education List

#### Experience UI

- [ ] Experience Form
- [ ] Experience List

#### Projects UI

- [ ] Projects Form
- [ ] Projects List

---

## Phase 3 — Resume Management

### Backend

- [ ] Resume Module
- [ ] Resume Upload API
- [ ] Resume Download API
- [ ] Resume Delete API

#### Storage

- [ ] Configure AWS S3
- [ ] Resume Upload Service

### Frontend

- [ ] Resume Upload Page
- [ ] Resume List Page
- [ ] Resume Details Page

---

## Phase 4 — Resume Parsing

### Backend

#### OpenAI Integration

- [ ] Create OpenAI Service

#### Resume Parser Agent

- [ ] Extract Skills
- [ ] Extract Education
- [ ] Extract Experience
- [ ] Extract Projects

#### Queue Processing

- [ ] Resume Processing Queue

### Frontend

- [ ] Resume Parsing Results Page
- [ ] Review Parsed Data UI

---

## Phase 5 — Job Discovery

### Backend

#### Companies Module

- [ ] Create Company Entity
- [ ] Company CRUD

#### Job Sources Module

- [ ] Create Job Source Entity

#### Jobs Module

- [ ] Create Job Entity
- [ ] Create Job Service
- [ ] Create Job Controller

### Integrations

#### Wellfound

- [ ] Job Collection Service

#### YC Jobs

- [ ] Job Collection Service

#### Internshala

- [ ] Job Collection Service

#### Company Career Pages

- [ ] Career Page Collector

### Frontend

- [ ] Jobs Listing Page
- [ ] Job Detail Page
- [ ] Search Filters

---

## Phase 6 — Job Quality Engine

### Backend

#### Deduplication

- [ ] Duplicate Detection Logic

#### Freshness Engine

- [ ] Freshness Score

#### Trust Engine

- [ ] Trust Score

#### Quality Engine

- [ ] Overall Quality Score

#### Scheduler

- [ ] Quality Recalculation Job

### Frontend

- [ ] Display Quality Score
- [ ] Display Trust Score
- [ ] Display Freshness Score

---

## Phase 7 — AI Job Matching

### Backend

#### Match Agent

- [ ] Match Service
- [ ] Match Calculation

#### Skill Gap Analysis

- [ ] Missing Skills Logic
- [ ] Recommendations Logic

### Frontend

- [ ] Match Breakdown Card
- [ ] Missing Skills UI
- [ ] Recommendations UI

---

## Phase 8 — Application Tracker

### Backend

- [ ] Applications Module
- [ ] Save Job API
- [ ] Apply API
- [ ] Update Status API

### Frontend

- [ ] Applications Dashboard
- [ ] Saved Jobs Page
- [ ] Application Timeline

---

## Phase 9 — Resume Optimization

### Backend

#### Resume Optimizer Agent

- [ ] ATS Optimization
- [ ] Keyword Suggestions
- [ ] Resume Improvement Suggestions

### Frontend

- [ ] Resume Optimization Page
- [ ] Optimization Results UI

---

## Phase 10 — Cover Letter Generator

### Backend

#### Cover Letter Agent

- [ ] Generate Cover Letter
- [ ] Save Cover Letter

### Frontend

- [ ] Cover Letter Generator Page
- [ ] Cover Letter Preview

---

## Infrastructure

### Redis

- [ ] Redis Setup
- [ ] Cache Service

### BullMQ

- [ ] Queue Setup
- [ ] Worker Setup

### Monitoring

- [ ] Error Logging
- [ ] Request Logging

---

## Testing

### Backend

- [ ] Unit Tests
- [ ] Integration Tests

### Frontend

- [ ] Component Tests
- [ ] E2E Tests

---

## MVP Completion Checklist

- [ ] Authentication Complete
- [ ] Candidate Profile Complete
- [ ] Resume Management Complete
- [ ] Resume Parsing Complete
- [ ] Job Discovery Complete
- [ ] Job Quality Engine Complete
- [ ] AI Job Matching Complete
- [ ] Application Tracker Complete
- [ ] Resume Optimization Complete
- [ ] Cover Letter Generator Complete

---

## Post-MVP (Not Now)

- [ ] Auto Apply Agent
- [ ] Browser Automation
- [ ] Referral Finder
- [ ] Recruiter Discovery
- [ ] Salary Intelligence
- [ ] Interview Preparation Agent
- [ ] AI Career Coach

These tasks must remain locked until MVP is released.
