# Profile Feature

## Status

Planned

## Roadmap Phase

Phase 2

---

## Objective

Create a complete candidate profile that powers job matching and AI recommendations.

---

## User Stories

- As a user, I want to create my profile.
- As a user, I want to add skills.
- As a user, I want to add education.
- As a user, I want to add experience.
- As a user, I want to add projects.

---

## Pages

| Route | Purpose |
| ----- | ------- |
| `/profile` | View profile dashboard |
| `/profile/edit` | Edit profile details |

---

## Sections

### Personal Information

- First Name
- Last Name
- Phone
- Location
- Headline
- Summary

### Career Preferences

- Preferred Role
- Preferred Location
- Employment Type

### Skills

- Add Skill
- Edit Skill
- Delete Skill

### Education

- Institution
- Degree
- Field of Study
- CGPA

### Experience

- Company
- Role
- Duration
- Description

### Projects

- Title
- Description
- GitHub URL
- Live URL

---

## APIs

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/profile` | Get current user profile |
| POST | `/profile` | Create profile |
| PUT | `/profile` | Update profile |
| DELETE | `/profile` | Delete profile |

**Sub-resource APIs** (see `docs/api-spec.md`):

- `GET/POST/PUT/DELETE /profile/skills`
- `GET/POST/PUT/DELETE /profile/education`
- `GET/POST/PUT/DELETE /profile/experience`
- `GET/POST/PUT/DELETE /profile/projects`

---

## Database Tables

- `profiles`
- `skills`
- `educations`
- `experiences`
- `projects`

---

## Acceptance Criteria

- Profile can be created
- Profile can be updated
- Skills can be managed
- Education can be managed
- Experience can be managed
- Projects can be managed

---

## Future Scope

- Certifications
- Languages
- Social Profiles
- Portfolio Integration
