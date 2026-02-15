import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { insertMemorySchema, insertCouponSchema, insertReasonSchema, insertMusicSchema } from "@shared/schema";
import { z } from "zod";

// --- MEMORIES ---
export function useMemories() {
  return useQuery({
    queryKey: [api.memories.list.path],
    queryFn: async () => {
      const res = await fetch(api.memories.list.path);
      if (!res.ok) throw new Error("Failed to fetch memories");
      return await res.json();
    },
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertMemorySchema>) => {
      // NOTE: In a real app with file uploads, we'd use FormData here if data.image is a File.
      // For now we follow the schema which expects strings (urls) or text fields.
      // If we implement file upload, we'd do it separately and pass the URL here.
      const res = await fetch(api.memories.create.path, {
        method: api.memories.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create memory");
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.memories.list.path] }),
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.memories.delete.path, { id });
      const res = await fetch(url, { method: api.memories.delete.method });
      if (!res.ok) throw new Error("Failed to delete memory");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.memories.list.path] }),
  });
}

// --- COUPONS ---
export function useCoupons() {
  return useQuery({
    queryKey: [api.coupons.list.path],
    queryFn: async () => {
      const res = await fetch(api.coupons.list.path);
      if (!res.ok) throw new Error("Failed to fetch coupons");
      return await res.json();
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertCouponSchema>) => {
      const res = await fetch(api.coupons.create.path, {
        method: api.coupons.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create coupon");
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.coupons.list.path] }),
  });
}

export function useRedeemCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.coupons.redeem.path, { id });
      const res = await fetch(url, { method: api.coupons.redeem.method });
      if (!res.ok) throw new Error("Failed to redeem coupon");
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.coupons.list.path] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.coupons.delete.path, { id });
      const res = await fetch(url, { method: api.coupons.delete.method });
      if (!res.ok) throw new Error("Failed to delete coupon");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.coupons.list.path] }),
  });
}

// --- REASONS ---
export function useReasons() {
  return useQuery({
    queryKey: [api.reasons.list.path],
    queryFn: async () => {
      const res = await fetch(api.reasons.list.path);
      if (!res.ok) throw new Error("Failed to fetch reasons");
      return await res.json();
    },
  });
}

export function useCreateReason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertReasonSchema>) => {
      const res = await fetch(api.reasons.create.path, {
        method: api.reasons.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create reason");
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.reasons.list.path] }),
  });
}

export function useDeleteReason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.reasons.delete.path, { id });
      const res = await fetch(url, { method: api.reasons.delete.method });
      if (!res.ok) throw new Error("Failed to delete reason");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.reasons.list.path] }),
  });
}

// --- MUSIC ---
export function useMusic() {
  return useQuery({
    queryKey: [api.music.list.path],
    queryFn: async () => {
      const res = await fetch(api.music.list.path);
      if (!res.ok) throw new Error("Failed to fetch music");
      return await res.json();
    },
  });
}

export function useCreateMusic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertMusicSchema>) => {
      const res = await fetch(api.music.create.path, {
        method: api.music.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add music");
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.music.list.path] }),
  });
}

export function useDeleteMusic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.music.delete.path, { id });
      const res = await fetch(url, { method: api.music.delete.method });
      if (!res.ok) throw new Error("Failed to delete music");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.music.list.path] }),
  });
}

// --- PUBLIC PROFILE ---
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: [api.public.getProfile.path, username],
    queryFn: async () => {
      const url = buildUrl(api.public.getProfile.path, { username });
      const res = await fetch(url);
      if (res.status === 401) throw new Error("Unauthorized");
      if (res.status === 404) throw new Error("User not found");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return await res.json();
    },
    retry: false,
  });
}
