import {z} from "zod";
export const messageSchema = z.object({
    content: z.string().min(10,"Minimum 10 chars").max(300,"cannot exceed max limit of 300 chars")
})