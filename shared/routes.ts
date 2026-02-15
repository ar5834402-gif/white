
import { z } from 'zod';
import { insertUserSchema, insertMemorySchema, insertCouponSchema, insertReasonSchema, insertMusicSchema, users, memories, coupons, reasons, music } from './schema';

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  serverError: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Auth Routes
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    // User getting their own profile
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    // Verify girlfriend password for viewing
    verifyGirlfriend: {
      method: 'POST' as const,
      path: '/api/verify-girlfriend' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ success: z.boolean(), token: z.string().optional() }),
        401: errorSchemas.unauthorized,
      },
    }
  },

  // Memories
  memories: {
    list: {
      method: 'GET' as const,
      path: '/api/memories' as const,
      responses: {
        200: z.array(z.custom<typeof memories.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/memories' as const,
      // We'll handle multipart/form-data manually in the route, but schema validates the fields
      input: insertMemorySchema, 
      responses: {
        201: z.custom<typeof memories.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/memories/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    }
  },

  // Coupons
  coupons: {
    list: {
      method: 'GET' as const,
      path: '/api/coupons' as const,
      responses: {
        200: z.array(z.custom<typeof coupons.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/coupons' as const,
      input: insertCouponSchema,
      responses: {
        201: z.custom<typeof coupons.$inferSelect>(),
      },
    },
    redeem: {
      method: 'POST' as const,
      path: '/api/coupons/:id/redeem' as const,
      responses: {
        200: z.custom<typeof coupons.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/coupons/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    }
  },

  // Reasons
  reasons: {
    list: {
      method: 'GET' as const,
      path: '/api/reasons' as const,
      responses: {
        200: z.array(z.custom<typeof reasons.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reasons' as const,
      input: insertReasonSchema,
      responses: {
        201: z.custom<typeof reasons.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/reasons/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    }
  },

  // Music
  music: {
    list: {
      method: 'GET' as const,
      path: '/api/music' as const,
      responses: {
        200: z.array(z.custom<typeof music.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/music' as const,
      input: insertMusicSchema, 
      responses: {
        201: z.custom<typeof music.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/music/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    }
  },

  // Public View (Girlfriend Access)
  public: {
    getProfile: {
      method: 'GET' as const,
      path: '/api/public/:username' as const,
      responses: {
        200: z.object({
          username: z.string(),
          girlfriendName: z.string(),
          memories: z.array(z.custom<typeof memories.$inferSelect>()),
          coupons: z.array(z.custom<typeof coupons.$inferSelect>()),
          reasons: z.array(z.custom<typeof reasons.$inferSelect>()),
          music: z.array(z.custom<typeof music.$inferSelect>()),
        }),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized, // Password required
      },
    }
  }
};
