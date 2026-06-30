/** Profile Module — Type Definitions */

export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say";
export type WorkPreference = "remote" | "hybrid" | "onsite";
export type AvailabilityStatus = "actively_looking" | "open_to_offers" | "not_looking";

export interface ProfileAvatar {
  url: string | null;
  initials: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  nationality: string | null;
}

export interface ContactInfo {
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
}

export interface CareerInfo {
  currentRole: string;
  yearsOfExperience: number;
  preferredRole: string;
  preferredLocation: string;
  workPreference: WorkPreference;
  headline: string;
  summary: string;
}

export interface ProfileStats {
  skillsCount: number;
  experienceCount: number;
  projectsCount: number;
  educationCount: number;
}

export interface ProfileCompletionSection {
  id: string;
  label: string;
  completed: boolean;
}

export interface ProfileCompletion {
  percentage: number;
  sections: ProfileCompletionSection[];
}

export interface Profile {
  id: string;
  userId: string;
  avatar: ProfileAvatar;
  personal: PersonalInfo;
  contact: ContactInfo;
  career: CareerInfo;
  stats: ProfileStats;
  completion: ProfileCompletion;
  availability: AvailabilityStatus;
  createdAt: string;
  updatedAt: string;
}
