# AI Career Agent — API Specification

## Base URL

```
/api/v1
```

All endpoints are prefixed with the base URL unless otherwise noted.

**Authentication:** Protected endpoints require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <accessToken>
```

---

## Authentication

### Register

```
POST /auth/register
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account created successfully"
}
```

---

### Login

```
POST /auth/login
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {}
}
```

---

### Refresh Token

```
POST /auth/refresh
```

**Auth:** Public (requires valid refresh token)

**Request:**

```json
{
  "refreshToken": "..."
}
```

**Response:**

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### Logout

```
POST /auth/logout
```

**Auth:** Required

**Request:**

```json
{
  "refreshToken": "..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Profile

### Get Profile

```
GET /profile
```

**Auth:** Required

---

### Create Profile

```
POST /profile
```

**Auth:** Required

---

### Update Profile

```
PUT /profile
```

**Auth:** Required

---

## Skills

```
GET    /profile/skills
POST   /profile/skills
PUT    /profile/skills/:id
DELETE /profile/skills/:id
```

**Auth:** Required

---

## Education

```
GET    /profile/education
POST   /profile/education
PUT    /profile/education/:id
DELETE /profile/education/:id
```

**Auth:** Required

---

## Experience

```
GET    /profile/experience
POST   /profile/experience
PUT    /profile/experience/:id
DELETE /profile/experience/:id
```

**Auth:** Required

---

## Projects

```
GET    /profile/projects
POST   /profile/projects
PUT    /profile/projects/:id
DELETE /profile/projects/:id
```

**Auth:** Required

---

## Resume

### Upload Resume

```
POST /resumes/upload
```

**Auth:** Required

**Content-Type:** `multipart/form-data`

---

### Get Resumes

```
GET /resumes
```

**Auth:** Required

---

### Get Resume

```
GET /resumes/:id
```

**Auth:** Required

---

### Delete Resume

```
DELETE /resumes/:id
```

**Auth:** Required

---

## Resume Parsing

### Parse Resume

```
POST /resumes/:id/parse
```

**Auth:** Required

Queues AI parsing for the specified resume.

---

### Get Parsed Data

```
GET /resumes/:id/parsed
```

**Auth:** Required

---

## Jobs

### Get Jobs

```
GET /jobs
```

**Auth:** Required

**Query Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `page` | number | Page number |
| `limit` | number | Results per page |
| `keyword` | string | Search keyword |
| `location` | string | Job location filter |
| `employmentType` | string | Employment type filter |

---

### Get Job Details

```
GET /jobs/:id
```

**Auth:** Required

---

### Search Jobs

```
GET /jobs/search
```

**Auth:** Required

---

## Job Matching

### Generate Match

```
POST /jobs/:id/match
```

**Auth:** Required

Triggers AI match calculation for the authenticated user and specified job.

---

### Get Match Result

```
GET /jobs/:id/match
```

**Auth:** Required

**Response:**

```json
{
  "matchPercentage": 85,
  "matchingSkills": [],
  "missingSkills": [],
  "recommendations": []
}
```

---

## Applications

### Save Job

```
POST /applications/save
```

**Auth:** Required

---

### Apply Job

```
POST /applications
```

**Auth:** Required

---

### Get Applications

```
GET /applications
```

**Auth:** Required

---

### Update Status

```
PATCH /applications/:id/status
```

**Auth:** Required

---

## Resume Optimization

```
POST /resume-optimizer
```

**Auth:** Required

---

## Cover Letter

### Generate Cover Letter

```
POST /cover-letters/generate
```

**Auth:** Required

---

### Get Cover Letters

```
GET /cover-letters
```

**Auth:** Required

---

### Get Cover Letter

```
GET /cover-letters/:id
```

**Auth:** Required

---

### Delete Cover Letter

```
DELETE /cover-letters/:id
```

**Auth:** Required

---

## Endpoint Summary

| Method | Endpoint | Auth |
| ------ | -------- | ---- |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public |
| POST | `/auth/logout` | Required |
| GET | `/profile` | Required |
| POST | `/profile` | Required |
| PUT | `/profile` | Required |
| GET | `/profile/skills` | Required |
| POST | `/profile/skills` | Required |
| PUT | `/profile/skills/:id` | Required |
| DELETE | `/profile/skills/:id` | Required |
| GET | `/profile/education` | Required |
| POST | `/profile/education` | Required |
| PUT | `/profile/education/:id` | Required |
| DELETE | `/profile/education/:id` | Required |
| GET | `/profile/experience` | Required |
| POST | `/profile/experience` | Required |
| PUT | `/profile/experience/:id` | Required |
| DELETE | `/profile/experience/:id` | Required |
| GET | `/profile/projects` | Required |
| POST | `/profile/projects` | Required |
| PUT | `/profile/projects/:id` | Required |
| DELETE | `/profile/projects/:id` | Required |
| POST | `/resumes/upload` | Required |
| GET | `/resumes` | Required |
| GET | `/resumes/:id` | Required |
| DELETE | `/resumes/:id` | Required |
| POST | `/resumes/:id/parse` | Required |
| GET | `/resumes/:id/parsed` | Required |
| GET | `/jobs` | Required |
| GET | `/jobs/:id` | Required |
| GET | `/jobs/search` | Required |
| POST | `/jobs/:id/match` | Required |
| GET | `/jobs/:id/match` | Required |
| POST | `/applications/save` | Required |
| POST | `/applications` | Required |
| GET | `/applications` | Required |
| PATCH | `/applications/:id/status` | Required |
| POST | `/resume-optimizer` | Required |
| POST | `/cover-letters/generate` | Required |
| GET | `/cover-letters` | Required |
| GET | `/cover-letters/:id` | Required |
| DELETE | `/cover-letters/:id` | Required |
