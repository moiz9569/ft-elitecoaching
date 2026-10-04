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
  const db = client.db(dbName);

  if (!globalThis._indexesScheduled) {
    globalThis._indexesScheduled = true;
    ensureIndexes().catch((e) => console.error("[db] index init failed:", e));
  }

  return db;
}

export async function collections() {
  const db = await getDb();
  return {
    users: db.collection("users"),
    profiles: db.collection("profiles"),
    purchases: db.collection("purchases"),
    subscriptions: db.collection("subscriptions"),
    contactMessages: db.collection("contact_messages"),
    passwordResets: db.collection("password_resets"),
  };
}

let indexesReady = null;

async function ensureIndexes() {
  if (indexesReady) return indexesReady;

  indexesReady = (async () => {
    const db = await getDb();

    await db.collection("users").createIndex({ email: 1 }, { unique: true });

    // Drop legacy unique index from the old schema if it exists
    try {
      await db.collection("purchases").dropIndex("userId_1_programmeSlug_1");
      console.log("[db] dropped legacy purchases index");
    } catch {
      // doesn't exist, fine
    }

    // One-off purchases: unique per Stripe session only
    await db
      .collection("purchases")
      .createIndex({ stripeSessionId: 1 }, { unique: true, sparse: true });

    await db.collection("purchases").createIndex({ userId: 1, createdAt: -1 });

    // Subscriptions: unique per Stripe subscription
    await db
      .collection("subscriptions")
      .createIndex({ stripeSubscriptionId: 1 }, { unique: true, sparse: true });

    await db.collection("subscriptions").createIndex({ userId: 1, createdAt: -1 });

    // Password resets
    await db
      .collection("password_resets")
      .createIndex({ token: 1 }, { unique: true });

    await db
      .collection("password_resets")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  })().catch((e) => {
    console.error("[db] index setup failed:", e);
    indexesReady = null;
  });

  return indexesReady;
}