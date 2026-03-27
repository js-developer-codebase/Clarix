import NextAuth, { DefaultSession } from "next-auth";
import { Role } from "./index";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      companyId?: string;
      department?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    companyId?: string;
    department?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    companyId?: string;
    department?: string;
  }
}
