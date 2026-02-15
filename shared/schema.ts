
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

// Users table (Boyfriends/Admins)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Hashed
  girlfriendName: text("girlfriend_name").notNull(),
  girlfriendPassword: text("girlfriend_password"), // Plain text or hashed, for the GF to access view
  createdAt: timestamp("created_at").defaultNow(),
});

// Memories (Timeline)
export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url"), // Path to uploaded file
  type: text("type").default("photo"), // photo, video
  createdAt: timestamp("created_at").defaultNow(),
});

// Coupons
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isRedeemed: boolean("is_redeemed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// "Why I Love You" Reasons
export const reasons = pgTable("reasons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Background Music
export const music = pgTable("music", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  url: text("url").notNull(), // Path to uploaded file
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const usersRelations = relations(users, ({ many }) => ({
  memories: many(memories),
  coupons: many(coupons),
  reasons: many(reasons),
  music: many(music),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
  user: one(users, {
    fields: [memories.userId],
    references: [users.id],
  }),
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
  user: one(users, {
    fields: [coupons.userId],
    references: [users.id],
  }),
}));

export const reasonsRelations = relations(reasons, ({ one }) => ({
  user: one(users, {
    fields: [reasons.userId],
    references: [users.id],
  }),
}));

export const musicRelations = relations(music, ({ one }) => ({
  user: one(users, {
    fields: [music.userId],
    references: [users.id],
  }),
}));

// === ZOD SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertMemorySchema = createInsertSchema(memories).omit({ id: true, createdAt: true, userId: true });
export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true, createdAt: true, userId: true });
export const insertReasonSchema = createInsertSchema(reasons).omit({ id: true, createdAt: true, userId: true });
export const insertMusicSchema = createInsertSchema(music).omit({ id: true, createdAt: true, userId: true });

// === TYPES ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Memory = typeof memories.$inferSelect;
export type InsertMemory = z.infer<typeof insertMemorySchema>;

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;

export type Reason = typeof reasons.$inferSelect;
export type InsertReason = z.infer<typeof insertReasonSchema>;

export type Music = typeof music.$inferSelect;
export type InsertMusic = z.infer<typeof insertMusicSchema>;
