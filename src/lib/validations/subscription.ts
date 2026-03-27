import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(2, "Tool name is required"),
  vendor: z.string().min(2, "Vendor is required"),
  category: z.enum([
    "PRODUCTIVITY", "MARKETING", "FINANCE", "ENGINEERING", "HR", "CRM", "DEVTOOLS", "COMMUNICATION", "OTHER"
  ]),
  department: z.string().min(2, "Department is required"),
  monthlyCostINR: z.number().min(0),
  licenses: z.number().int().min(1),
  activeUsers: z.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "INACTIVE", "CANCELLED", "EXPIRED"]).default("ACTIVE"),
  renewalDate: z.date(),
  billingCycle: z.enum(["MONTHLY", "ANNUAL", "QUARTERLY"]).default("ANNUAL"),
  ownerId: z.string().min(1, "Owner is required"),
  contractUrl: z.string().url("Invalid contract URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});
