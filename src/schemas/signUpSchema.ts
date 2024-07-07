import {z} from "zod"

export const usernameValidation= z
     .string()
     .min(3, "username must be atleast 3 characters")
     .max(20, "username must not exceed 20 characters")
     .regex(/^([A-Za-z0-9_])+$/, 'username can only contain alphanumeric characters and underscores')

export const signUpSchema = z.object({
     username: usernameValidation,
     email: z.string().email({message: "Invalid email address"}),
     password: z.string().min(8, {message: "password must be atleast 8 characters"})
})