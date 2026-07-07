# Changelog

All notable changes to the AI Career Agent platform will be documented in this file.

## [1.7.0] - 2026-07-07

### Added
- **Decoupled Alerts & Notifications Architecture**: Separated Job Alerts (rule configuration engine) from the Notification Center feed.
- **Job Alerts Upgrades**: Added "Duplicate Alert" handler, active/paused status badges, and last/next scheduled scan time metadata to rules cards.
- **Unified Notification Center**: Pre-seeded inbox notifications spanning Job Alerts, Application Updates, Resume Parsing, Resume Tailoring, AI Matches, and Cover Letter generations.
- **Notification Inbox Filtering**: Added filtering by read/unread statuses and Category tabs, plus view contextual buttons routing to matched detail locations.
- **Alert Scanner Simulation**: Connected the `createAlert` Zustand flow to trigger a mock matching engine cycle that posts new matches to the notifications feed after 3 seconds.

## [1.6.0] - 2026-07-07

### Added
- **Saved Jobs Dashboard**: Complete saved jobs tracker showing matching rating score, salary limit, locations, relative save date, and custom sorting options (Recently Saved, Company, Job Title, Date Posted) with optimistic unsaving logic.
- **Job Alerts Scanning**: LocalStorage CRUD scheduler supporting daily/weekly/instant alerts matching keywords, remote, salary thresholds, and experience criteria, with toggle switches.
- **Advanced Search & Filtering**: Instant collapsible filter criteria including skills tag additions, match score slider, easy apply toggles, and date posted age.
- **Search Query History**: Memory of recent searches, saved filters naming, and popular terms pills.
- **Responsive Drawer & FAB**: Sticky desktop filter sidebar collapsing to a slide-over panel on mobile/tablet screens triggered by a floating action button.
- **Scroll Restoration**: Persist search filters and vertical scroll coordinates in sessionStorage to restore states on backward navigation.

## [1.5.0] - 2026-06-30

### Added
- **Edit Profile Page**: Route `/profile/edit` hosting independent personal, contact, career, and preferences inline edit cards with save/cancel controls.
- **Complete Profile Onboarding Wizard**: Route `/complete-profile` featuring an 8-step wizard navigation, mandatory vs optional step filters, progress indicators, and draft-saving capabilities.
- **Avatar Management**: Crop support ready component supporting image type/size validation and remove actions.
- **Searchable Languages Options**: 15+ standard language selects and native toggle controls.
- **Preferred Currency Select**: Added expected salary currency selection and rendering configurations.
- **Dirty Forms confirmation checks**: Browser beforeunload and navigation confirmation alerts preventing loss of unsaved form edits.
- **Score Rating Category tags**: "Excellent", "Good", and "Needs Attention" categorization tags on Profile Review page.
- **Review jump-scroll shortcuts**: Anchor links allowing immediate navigation to specific candidate profile review rows.

## [1.4.0] - 2026-06-29

### Added
- **Certifications Module**: Full CRUD operations, credential verification redirect links, and card previews.
- **Languages Module**: Proficiencies tracking for speaking, writing, and reading.
- **Social Links Module**: Dynamic platform selectors, link validation, and copy-to-clipboard buttons.
- **Career Preferences Module**: Notice period, preferred shifts, company size, and visa sponsorship settings.
- **Profile Review Page**: Route `/profile/review` displaying full checklist parameters and missing properties audits.
- **Profile Completion Engine**: Dynamic calculator tracking completion levels across 10 sub-sections.
