import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('DATABASE_URL is not defined in .env');
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db();

    // 1. Super Admin (Configurable via ENV)
    const defaultAdminEmail = process.env.DEFAULT_USER_EMAIL || 'admin@clarix.in';
    const defaultAdminPassword = process.env.DEFAULT_USER_PASSWORD || 'Admin@1234';
    const finalHashedPassword = await bcrypt.hash(defaultAdminPassword, 12);
    const amanPassword = await bcrypt.hash('Aman@1234', 12);
    const nehaPassword = await bcrypt.hash('Neha@1234', 12);

    // Upsert Super Admin
    await db.collection('users').updateOne(
      { email: defaultAdminEmail },
      {
        $set: {
          email: defaultAdminEmail,
          name: 'Platform Administrator',
          password: finalHashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    );

    // 2. Company 1: Infospark Technologies
    const infospark = await db.collection('companies').findOneAndUpdate(
      { slug: 'infospark' },
      {
        $set: {
          name: 'Infospark Technologies',
          slug: 'infospark',
          industry: 'Technology',
          plan: 'GROWTH',
          maxUsers: 100,
          maxSubs: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    const infosparkId = infospark._id || (await db.collection('companies').findOne({ slug: 'infospark' }))._id;

    const aman = await db.collection('users').findOneAndUpdate(
      { email: 'aman@infospark.in' },
      {
        $set: {
          email: 'aman@infospark.in',
          name: 'Aman Sharma',
          password: amanPassword,
          role: 'COMPANY_ADMIN',
          companyId: infosparkId,
          department: 'Engineering',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    const amanId = aman._id || (await db.collection('users').findOne({ email: 'aman@infospark.in' }))._id;

    const infosparkSubs = [
      { name: 'Zoho CRM', vendor: 'Zoho', category: 'CRM', department: 'Sales', monthlyCostINR: 12500, licenses: 40, activeUsers: 38, action: 'KEEP' },
      { name: 'Freshdesk', vendor: 'Freshworks', category: 'OTHER', department: 'Operations', monthlyCostINR: 8200, licenses: 25, activeUsers: 20, action: 'KEEP' },
      { name: 'Slack', vendor: 'Salesforce', category: 'COMMUNICATION', department: 'Engineering', monthlyCostINR: 18000, licenses: 80, activeUsers: 75, action: 'KEEP' },
      { name: 'Jira', vendor: 'Atlassian', category: 'DEVTOOLS', department: 'Engineering', monthlyCostINR: 14400, licenses: 60, activeUsers: 58, action: 'KEEP' },
      { name: 'Notion', vendor: 'Notion Labs', category: 'PRODUCTIVITY', department: 'Marketing', monthlyCostINR: 4800, licenses: 30, activeUsers: 8, action: 'CANCEL' },
      { name: 'Canva Pro', vendor: 'Canva', category: 'MARKETING', department: 'Marketing', monthlyCostINR: 3200, licenses: 20, activeUsers: 4, action: 'CANCEL' },
      { name: 'Trello', vendor: 'Atlassian', category: 'PRODUCTIVITY', department: 'Operations', monthlyCostINR: 2100, licenses: 25, activeUsers: 3, action: 'CONSOLIDATE' },
      { name: 'Zoom', vendor: 'Zoom Video', category: 'COMMUNICATION', department: 'HR', monthlyCostINR: 9600, licenses: 50, activeUsers: 18, action: 'DOWNSIZE' },
      { name: 'Darwinbox', vendor: 'Darwinbox', category: 'HR', department: 'HR', monthlyCostINR: 22000, licenses: 100, activeUsers: 96, action: 'KEEP' },
      { name: 'Figma', vendor: 'Figma', category: 'PRODUCTIVITY', department: 'Engineering', monthlyCostINR: 11200, licenses: 20, activeUsers: 19, action: 'KEEP' },
      { name: 'Postman', vendor: 'Postman', category: 'DEVTOOLS', department: 'Engineering', monthlyCostINR: 6400, licenses: 15, activeUsers: 14, action: 'KEEP' },
      { name: 'Clevertap', vendor: 'Clevertap', category: 'MARKETING', department: 'Marketing', monthlyCostINR: 28000, licenses: 8, activeUsers: 8, action: 'KEEP' },
      { name: 'Chargebee', vendor: 'Chargebee', category: 'FINANCE', department: 'Finance', monthlyCostINR: 7800, licenses: 12, activeUsers: 5, action: 'DOWNSIZE' },
      { name: 'Google Workspace', vendor: 'Google', category: 'PRODUCTIVITY', department: 'All', monthlyCostINR: 41000, licenses: 150, activeUsers: 148, action: 'KEEP' },
    ];

    // Clear existing subs for fresh start in seed
    await db.collection('subscriptions').deleteMany({ companyId: infosparkId });

    for (const s of infosparkSubs) {
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() + 45);
      await db.collection('subscriptions').insertOne({
        ...s,
        companyId: infosparkId,
        ownerId: amanId,
        renewalDate: renewalDate,
        status: 'ACTIVE',
        billingCycle: 'ANNUAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 3. Company 2: BharatMart Retail
    const bharatmart = await db.collection('companies').findOneAndUpdate(
      { slug: 'bharatmart' },
      {
        $set: {
          name: 'BharatMart Retail',
          slug: 'bharatmart',
          industry: 'Retail',
          plan: 'STARTER',
          maxUsers: 25,
          maxSubs: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    const bharatmartId = bharatmart._id || (await db.collection('companies').findOne({ slug: 'bharatmart' }))._id;

    const neha = await db.collection('users').findOneAndUpdate(
      { email: 'neha@bharatmart.in' },
      {
        $set: {
          email: 'neha@bharatmart.in',
          name: 'Neha Gupta',
          password: nehaPassword,
          role: 'COMPANY_ADMIN',
          companyId: bharatmartId,
          department: 'Finance',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    const nehaId = neha._id || (await db.collection('users').findOne({ email: 'neha@bharatmart.in' }))._id;

    const bharatmartSubs = [
      { name: 'Shopify', vendor: 'Shopify', category: 'OTHER', department: 'Sales', monthlyCostINR: 15000, licenses: 5, activeUsers: 5, action: 'KEEP' },
      { name: 'Freshbooks', vendor: 'Freshworks', category: 'FINANCE', department: 'Finance', monthlyCostINR: 3500, licenses: 8, activeUsers: 3, action: 'DOWNSIZE' },
      { name: 'Mailchimp', vendor: 'Mailchimp', category: 'MARKETING', department: 'Marketing', monthlyCostINR: 4200, licenses: 20, activeUsers: 4, action: 'CANCEL' },
      { name: 'Zendesk', vendor: 'Zendesk', category: 'OTHER', department: 'Support', monthlyCostINR: 11000, licenses: 15, activeUsers: 12, action: 'KEEP' },
      { name: 'Slack', vendor: 'Salesforce', category: 'COMMUNICATION', department: 'Engineering', monthlyCostINR: 5400, licenses: 24, activeUsers: 22, action: 'KEEP' },
      { name: 'Razorpay', vendor: 'Razorpay', category: 'FINANCE', department: 'Finance', monthlyCostINR: 2200, licenses: 3, activeUsers: 3, action: 'KEEP' },
    ];

    await db.collection('subscriptions').deleteMany({ companyId: bharatmartId });

    for (const s of bharatmartSubs) {
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() + 30);
      await db.collection('subscriptions').insertOne({
        ...s,
        companyId: bharatmartId,
        ownerId: nehaId,
        renewalDate: renewalDate,
        status: 'ACTIVE',
        billingCycle: 'MONTHLY',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log('Native MongoDB Seeding completed successfully!');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
