import { email, z } from 'zod';

export const signupDto = z.object({
  username: z.string().min(3).max(64),
  email: z.email(),
  password: z.string().min(8)
})

export const signInDto = z.object({
  email: z.email(),
  password: z.string().min(8)
})

