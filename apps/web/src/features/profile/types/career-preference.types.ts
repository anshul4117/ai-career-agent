/** Career Preferences Module — Type Definitions */

import type { WorkPreference } from "./profile.types";
import type { EmploymentType } from "./experience.types";

export interface CareerPreference {
  id: string;
  preferredRole: string;
  employmentType: EmploymentType;
  preferredLocation: string;
  workMode: WorkPreference;
  expectedSalary: string; // e.g. "18,00,000"
  currency: string; // e.g. "INR", "USD"
  noticePeriod: string; // e.g. "30 days", "Immediate"
  openToWork: boolean;
  visaSponsorshipRequired: boolean;
  relocationWillingness: boolean;
  preferredIndustry: string; // e.g. "Fintech, Edtech, SaaS"
  preferredCompanySize: string; // e.g. "11-50 employees", "1000+ employees"
  preferredShift: string; // e.g. "Day Shift", "Flexible"
  createdAt: string;
  updatedAt: string;
}
