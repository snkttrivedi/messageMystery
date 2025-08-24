import {z} from "zod"
export const verifyValidator = z.string().length(6,{message:"must be of 6 digits"});
export const verifySchema = z.object({
    code: verifyValidator
});