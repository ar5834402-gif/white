
import { users, memories, coupons, reasons, music } from "@shared/schema";
import { db } from "./db";
import { storage } from "./storage";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) return;

  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await storage.createUser({
    username: "demo",
    password: hashedPassword,
    girlfriendName: "Sarah",
    girlfriendPassword: "love",
  });

  await storage.createReason(user.id, { text: "You have the cutest smile" });
  await storage.createReason(user.id, { text: "You always make me laugh" });
  await storage.createReason(user.id, { text: "You make the best coffee" });

  await storage.createCoupon(user.id, {
    title: "Movie Night",
    description: "Your choice of movie and snacks!",
    isRedeemed: false
  });
  
  await storage.createCoupon(user.id, {
    title: "Back Massage",
    description: "30 minutes of relaxation",
    isRedeemed: false
  });

  await storage.createMemory(user.id, {
    title: "First Date",
    description: "We went to that Italian place and talked for hours.",
    date: new Date("2023-02-14"),
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a"
  });

  await storage.createMemory(user.id, {
    title: "Beach Trip",
    description: "Watching the sunset together.",
    date: new Date("2023-07-20"),
    type: "photo",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  });

  console.log("Database seeded!");
}
