/**
 * Seed Script — Admin & Teacher accounts
 * ─────────────────────────────────────────
 * Usage:  node src/seeders/seed.js
 *
 * Idempotent: skips any user whose email already exists in the database.
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const bcrypt    = require("bcrypt");
const db        = require("../models");
const User      = db.User;

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    fullName : "Administrator",
    email    : "admin@englisheveryday.com",
    password : "Admin@123",
    role     : "admin",
  },
  {
    fullName : "Default Teacher",
    email    : "teacher@englisheveryday.com",
    password : "Teacher@123",
    role     : "teacher",
  },
];

// ── Runner ────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    // Connect & sync (no ALTER — just ensure tables exist)
    await db.sequelize.authenticate();
    console.log("✅  Database connected\n");

    await db.sequelize.sync();

    for (const data of SEED_USERS) {
      const existing = await User.findOne({ where: { email: data.email } });

      if (existing) {
        console.log(`⚠️   [SKIP] ${data.role.toUpperCase()} already exists → ${data.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      await User.create({
        fullName : data.fullName,
        email    : data.email,
        password : hashedPassword,
        role     : data.role,
      });

      console.log(`✅  [CREATED] ${data.role.toUpperCase()} → ${data.email}  (password: ${data.password})`);
    }

    console.log("\n🎉  Seeding complete!");
  } catch (err) {
    console.error("❌  Seeding failed:", err.message);
    process.exit(1);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
};

seed();
