import {z} from "zod"

export const messageSchema = z.object({
     content: z
          .string()
          .trim()
          .min(5, {message: "Content must be atleast 5 characters"})
          .max(300, {message: "Content can't exceed 300 chareacters"})
})