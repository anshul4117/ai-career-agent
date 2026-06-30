/** Certifications Module — Type Definitions */

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string | null; // YYYY-MM-DD, null if neverExpires is true
  credentialId: string | null;
  credentialUrl: string | null;
  neverExpires: boolean;
  createdAt: string;
  updatedAt: string;
}
