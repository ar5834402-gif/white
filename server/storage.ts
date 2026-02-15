
import { 
  users, memories, coupons, reasons, music,
  type User, type InsertUser, 
  type Memory, type InsertMemory, 
  type Coupon, type InsertCoupon, 
  type Reason, type InsertReason,
  type Music, type InsertMusic
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Memories
  getMemories(userId: number): Promise<Memory[]>;
  createMemory(userId: number, memory: InsertMemory): Promise<Memory>;
  deleteMemory(id: number, userId: number): Promise<void>;

  // Coupons
  getCoupons(userId: number): Promise<Coupon[]>;
  createCoupon(userId: number, coupon: InsertCoupon): Promise<Coupon>;
  redeemCoupon(id: number, userId: number): Promise<Coupon | undefined>;
  deleteCoupon(id: number, userId: number): Promise<void>;

  // Reasons
  getReasons(userId: number): Promise<Reason[]>;
  createReason(userId: number, reason: InsertReason): Promise<Reason>;
  deleteReason(id: number, userId: number): Promise<void>;

  // Music
  getMusic(userId: number): Promise<Music[]>;
  createMusic(userId: number, music: InsertMusic): Promise<Music>;
  deleteMusic(id: number, userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Memories
  async getMemories(userId: number): Promise<Memory[]> {
    return await db.select().from(memories).where(eq(memories.userId, userId));
  }

  async createMemory(userId: number, insertMemory: InsertMemory): Promise<Memory> {
    const [memory] = await db.insert(memories).values({ ...insertMemory, userId }).returning();
    return memory;
  }

  async deleteMemory(id: number, userId: number): Promise<void> {
    await db.delete(memories).where(and(eq(memories.id, id), eq(memories.userId, userId)));
  }

  // Coupons
  async getCoupons(userId: number): Promise<Coupon[]> {
    return await db.select().from(coupons).where(eq(coupons.userId, userId));
  }

  async createCoupon(userId: number, insertCoupon: InsertCoupon): Promise<Coupon> {
    const [coupon] = await db.insert(coupons).values({ ...insertCoupon, userId }).returning();
    return coupon;
  }

  async redeemCoupon(id: number, userId: number): Promise<Coupon | undefined> {
    const [coupon] = await db.update(coupons)
      .set({ isRedeemed: true })
      .where(and(eq(coupons.id, id), eq(coupons.userId, userId)))
      .returning();
    return coupon;
  }

  async deleteCoupon(id: number, userId: number): Promise<void> {
    await db.delete(coupons).where(and(eq(coupons.id, id), eq(coupons.userId, userId)));
  }

  // Reasons
  async getReasons(userId: number): Promise<Reason[]> {
    return await db.select().from(reasons).where(eq(reasons.userId, userId));
  }

  async createReason(userId: number, insertReason: InsertReason): Promise<Reason> {
    const [reason] = await db.insert(reasons).values({ ...insertReason, userId }).returning();
    return reason;
  }

  async deleteReason(id: number, userId: number): Promise<void> {
    await db.delete(reasons).where(and(eq(reasons.id, id), eq(reasons.userId, userId)));
  }

  // Music
  async getMusic(userId: number): Promise<Music[]> {
    return await db.select().from(music).where(eq(music.userId, userId));
  }

  async createMusic(userId: number, insertMusic: InsertMusic): Promise<Music> {
    const [song] = await db.insert(music).values({ ...insertMusic, userId }).returning();
    return song;
  }

  async deleteMusic(id: number, userId: number): Promise<void> {
    await db.delete(music).where(and(eq(music.id, id), eq(music.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
