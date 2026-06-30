/** Profile Module — Zod Validation Schemas */

import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.enum(["male", "female", "non_binary", "prefer_not_to_say"]).nullable().optional(),
  nationality: z.string().max(50).nullable().optional(),
});

export const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required").max(20, "Phone number too long"),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional(),
  country: z.string().min(1, "Country is required").max(100),
});

export const careerInfoSchema = z.object({
  currentRole: z.string().min(1, "Current role is required").max(100),
  yearsOfExperience: z.number().min(0).max(50),
  preferredRole: z.string().min(1, "Preferred role is required").max(100),
  preferredLocation: z.string().min(1, "Preferred location is required").max(100),
  workPreference: z.enum(["remote", "hybrid", "onsite"]),
  headline: z.string().min(1, "Headline is required").max(200),
  summary: z.string().max(1000).optional(),
});

export const profileSchema = z.object({
  personal: personalInfoSchema,
  contact: contactInfoSchema,
  career: careerInfoSchema,
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;
export type CareerInfoFormValues = z.infer<typeof careerInfoSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
