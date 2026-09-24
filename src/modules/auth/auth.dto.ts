import { email, z } from 'zod';

export const signupDto = z.object({
  username: z.string().min(3).max(64),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
})

export const signInDto = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
})

