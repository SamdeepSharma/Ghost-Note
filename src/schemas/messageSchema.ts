import {z} from "zod"

export const messageSchema = z.object({
     content: z
          .string()
          .min(10, {message: "Content must be atleast 10 characters"})
          .max(300, {message: "Content can't exceed 300 chareacters"})
})