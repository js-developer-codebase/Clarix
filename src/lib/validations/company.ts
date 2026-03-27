import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  slug: z.string().min(2, "Slug required"),
  industry: z.enum([
    "TECHNOLOGY",
    "FINANCE",
    "HEALTHCARE",
    "ECOMMERCE",
    "MANUFACTURING",
    "EDUCATION",
    "RETAIL",
    "OTHER",
  ]),
  gstin: z.string().optional(),
  plan: z.enum(["STARTER", "GROWTH", "ENTERPRISE"]).default("STARTER"),
  maxUsers: z.number().int().min(1).default(10),
  maxSubs: z.number().int().min(1).default(50),
});

export const createCompanySchema = companySchema.extend({
  adminName: z.string().min(2, "Admin name required"),
  adminEmail: z.string().email("Invalid admin email"),
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
