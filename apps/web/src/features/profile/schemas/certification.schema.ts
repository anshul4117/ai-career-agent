/** Certifications Module — Zod Validation Schemas */

import { z } from "zod";

export const certificationSchema = z
  .object({
    name: z
      .string()
      .min(1, "Certification name is required")
      .max(150, "Name must be under 150 characters")
      .trim(),
    issuingOrganization: z
      .string()
      .min(1, "Issuing organization is required")
      .max(150, "Organization name must be under 150 characters")
      .trim(),
    issueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Issue date must be in YYYY-MM-DD format"),
    expiryDate: z
      .preprocess((val) => (val === "" ? null : val), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be in YYYY-MM-DD format").nullable().optional()),
    credentialId: z
      .preprocess((val) => (val === "" ? null : val), z.string().max(100).nullable().optional()),
    credentialUrl: z
      .preprocess(
        (val) => (val === "" ? null : val),
        z.string().url("Invalid credential URL format").nullable().optional()
      ),
    neverExpires: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.neverExpires) return true;
      if (!data.expiryDate) return false;
      return new Date(data.issueDate) <= new Date(data.expiryDate);
    },
    {
      message: "Expiry date must be after the issue date",
      path: ["expiryDate"],
    }
  );

export type CertificationFormValues = z.infer<typeof certificationSchema>;
