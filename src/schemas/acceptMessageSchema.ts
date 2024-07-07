import {z} from "zod"

export const scceptMessageSchema = z.object({
     acceptMessages: z.boolean(),
})