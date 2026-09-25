import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "ft_elite";

if (!uri) throw new Error("Missing MONGODB_URI env var");

let clientPromise;
if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function collections() {
  const db = await getDb();
  return {
    users: db.collection("users"),
    profiles: db.collection("profiles"),
    purchases: db.collection("purchases"),
    contactMessages: db.collection("contact_messages"),
    passwordResets: db.collection("password_resets"),
  };
}

// Create indexes once on first use.
export async function ensureIndexes() {
  const { users, purchases, passwordResets } = await collections();
  await users.createIndex({ email: 1 }, { unique: true });
  await purchases.createIndex({ userId: 1, programmeSlug: 1 }, { unique: true });
  await passwordResets.createIndex({ token: 1 }, { unique: true });
  await passwordResets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}