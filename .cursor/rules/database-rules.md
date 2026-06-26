# Database Rules

> **Scope:** Prisma schema, migrations, queries  
> **Last updated:** 2025-06-25

## Database

| Concern | Technology |
| ------- | ---------- |
| Database | PostgreSQL |
| ORM | Prisma |

---

## Design Principles

1. Normalize important data
2. Avoid unnecessary duplication
3. Keep relationships explicit
4. Design for scalability
5. Prefer relational design

---

## Primary Keys

Every table must use UUID.

**Example:**

```prisma
id String @id @default(uuid())
```

Never use auto-increment IDs.

---

## Timestamps

Every table must include:

- `createdAt`
- `updatedAt`

**Example:**

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

---

## Soft Delete

Use soft delete when data may need recovery.

**Fields:**

- `deletedAt`

Avoid permanent deletion unless necessary.

---

## Naming Conventions

### Tables

```
users
profiles
jobs
applications
```

Use plural table names.

### Columns

```
firstName
lastName
createdAt
```

Use camelCase.

---

## Relationship Rules

Always define explicit relations.

**Example:**

```
User → Profile
Company → Jobs
Job → Applications
```

Avoid ambiguous relationships.

---

## Index Rules

Add indexes for:

- Email
- Foreign keys
- Search fields
- Frequently queried columns

**Examples:**

```
users.email
jobs.postedAt
applications.userId
```

---

## Unique Constraints

Use unique constraints where appropriate.

**Examples:**

```
users.email
companies.website
```

---

## Enum Rules

Use enums for:

- Application status
- Employment type
- Job status
- Auth provider

Avoid storing enum values as free text.

---

## JSON Usage

Avoid JSON columns unless absolutely necessary.

Prefer relational tables.

| Approach | Verdict |
| -------- | ------- |
| `skills` table | Good |
| `skills` JSON blob | Bad |

---

## Migration Rules

Every schema change must:

1. Create migration
2. Review migration
3. Update `docs/database.md`

Never modify production schema manually.

---

## Prisma Rules

**Use:**

- Prisma Client

Never write raw SQL unless required.

Use Prisma relations and transactions.

---

## Performance Rules

**Avoid:**

- N+1 queries
- Unindexed lookups
- Large joins without indexes

Optimize frequently used queries.

---

## Data Integrity Rules

Always enforce:

- Foreign keys
- Required fields
- Unique constraints

Protect data consistency.

---

## Audit Rules

Important records should store:

- `createdBy`
- `updatedBy`

when applicable.

---

## Backup Principles

Production databases must support:

- Backup
- Recovery
- Migration rollback

---

## Definition of Done

Database task is complete only when:

- Schema updated
- Migration created
- Relations verified
- Indexes added
- Constraints verified
- Documentation updated
