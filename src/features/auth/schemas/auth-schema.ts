import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const signupSchema = loginSchema.extend({
  userId: z.string().trim().min(3).max(50),
  displayName: z.string().trim().min(1).max(100),
  realName: z.string().trim().min(1).max(100),
  verificationValue: z.string().trim().max(255).default(""),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
