export type Role = "SUPER_ADMIN" | "COMPANY_ADMIN" | "USER";
export type Plan = "STARTER" | "GROWTH" | "ENTERPRISE";

export type SubscriptionCategory = 
  | "PRODUCTIVITY"
  | "MARKETING"
  | "FINANCE"
  | "ENGINEERING"
  | "HR"
  | "CRM"
  | "DEVTOOLS"
  | "COMMUNICATION"
  | "OTHER";

export type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED";
export type BillingCycle = "MONTHLY" | "ANNUAL" | "QUARTERLY";
export type SubscriptionAction = "KEEP" | "CANCEL" | "DOWNSIZE" | "CONSOLIDATE";

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string;
  plan: Plan;
  maxUsers: number;
  maxSubs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId?: string;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  name: string;
  vendor: string;
  category: SubscriptionCategory;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  monthlyCostINR: number;
  renewalDate: Date;
  licenses: number;
  activeUsers: number;
  action: SubscriptionAction;
  companyId: string;
  ownerId?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}
