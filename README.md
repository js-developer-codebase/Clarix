# Clarix SaaS - Enterprise Subscription Intelligence

Clarix is a high-performance SaaS platform built for multi-tenant subscription monitoring and cost optimization. It provides granular visibility into software spend across an entire organization.

## 🚀 Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) (Native Driver)
- **Auth**: [Next-Auth (Auth.js) v5](https://authjs.dev/)
- **UI**: [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏗 Architecture Overview

The system uses a **Native MongoDB driver** approach for maximum performance and flexible schema management, bypassing the overhead of traditional ORMs. It features a robust multi-tenant architecture with strict role-based access control (RBAC).

### Key Modules:
- **Super Admin Dashboard**: Global tenant management, platform-wide analytics, and infrastructure governance.
- **Company Admin Dashboard**: User seat management, department spend tracking, and license optimization.
- **Renewal Alert Engine**: Automated cron jobs for monitoring upcoming software renewals and cost spikes.

## 🛠 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd clarix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Copy `.env.example` to `.env` and provide your MongoDB connection string.

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Start development**:
   ```bash
   npm run dev
   ```

## 🔐 Credentials (Default Seed)

- **Super Admin**: `admin@clarix.in` / `Admin@1234`
- **Standard Admin**: `aman@infospark.in` / `Aman@1234`

## 📄 License

Proprietary License - (c) 2026 Clarix SaaS. All Rights Reserved.
