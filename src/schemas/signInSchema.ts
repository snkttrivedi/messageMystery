import {z} from "zod"
export const signInSchema = z.object({
    identifier: z.string().email({message:"Invalid! email"}),
    password: z.string(),
});