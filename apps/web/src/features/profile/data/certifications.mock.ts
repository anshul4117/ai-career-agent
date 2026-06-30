/** Certifications Module — Mock Data */

import type { Certification } from "../types/certification.types";

export const MOCK_CERTIFICATIONS: Certification[] = [
  {
    id: "cert_1",
    name: "AWS Certified Solutions Architect – Associate",
    issuingOrganization: "Amazon Web Services (AWS)",
    issueDate: "2025-03-10",
    expiryDate: "2028-03-10",
    credentialId: "AWS-ASA-9988",
    credentialUrl: "https://aws.amazon.com/verification",
    neverExpires: false,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "cert_2",
    name: "Meta Front-End Developer Professional Certificate",
    issuingOrganization: "Coursera / Meta",
    issueDate: "2024-02-15",
    expiryDate: null,
    credentialId: "META-FED-7722",
    credentialUrl: "https://coursera.org/verify/meta-front-end",
    neverExpires: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
];
