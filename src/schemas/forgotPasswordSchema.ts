import {z} from "zod"

export const forgotPasswordSchema = z.object({
     email: z.string().email({message: "Invalid email address"}),
})

export const otpVerificationSchema = z.object({
     email: z.string().email({message: "Invalid email address"}),
     otp: z.string().length(6, {message: "OTP must be 6 digits"}),
})

export const resetPasswordSchema = z.object({
     email: z.string().email({message: "Invalid email address"}),
     otp: z.string().length(6, {message: "OTP must be 6 digits"}),
     newPassword: z.string().min(6, {message: "Password must be at least 6 characters"}),
     confirmPassword: z.string().min(6, {message: "Password must be at least 6 characters"}),
}).refine((data) => data.newPassword === data.confirmPassword, {
     message: "Passwords don't match",
     path: ["confirmPassword"],
})