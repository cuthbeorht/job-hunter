import {z} from 'zod';

export const registerSchema = z.object({
    email: z.email({message: 'Invalid email address'}),
    password: z.string().min(8),
});

export const loginSchema = registerSchema;