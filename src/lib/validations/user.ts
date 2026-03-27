import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters").optional(),
  role: z.enum(["SUPER_ADMIN", "COMPANY_ADMIN", "USER"]).default("USER"),
  department: z.string().min(2, "Department is required"),
  isActive: z.boolean().default(true),
});

export const inviteUserSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
  department: true,
});
