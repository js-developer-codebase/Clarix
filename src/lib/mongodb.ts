import { MongoClient } from "mongodb";

// In development, use a global variable to preserve the client across HMR.
// In production, instantiate directly.

const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  const uri = process.env.DATABASE_URL?.replace(/^["']|["']$/g, '');
  
  if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
    // If we're during build and URI is missing or invalid, we should not crash the build
    // unless we actually try to perform a database operation.
    if (process.env.NODE_ENV === "production") {
      // In production (including build time), we just log a warning instead of crashing
      // until a request actually arrives.
      console.warn("MongoDB URI is invalid or missing. If this is build time, it's normal if no DB operations are called.");
    }
    // Return a promise that will throw if awaited, but won't crash on import
    return Promise.reject(new Error("Invalid MongoDB connection string. Check DATABASE_URL."));
  }

  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

// We still export a default promise for compatibility with existing imports
// but we now wrap it to avoid top-level evaluation crashes.
const defaultClientPromise = (async () => {
    try {
        return await getMongoClient();
    } catch (e) {
        // We log the error but don't let it crash the module evaluation
        console.error("MongoDB Client Promise initialization failed:", e);
        throw e;
    }
})();

export default defaultClientPromise;

export async function getDb() {
  const client = await getMongoClient();
  return client.db();
}
