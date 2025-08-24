import {z} from "zod";
export const userValidation  = z.string()
                                .min(2,"Must be of atleat 2 characters")
                                .max(20,"Must be no more than 20 characters")
                                .regex(/^[a-zA-Z0-9_]*$/,"Must contain only alphanumeric characters and underscore");
export const signUpSchema = z.object({
    username: userValidation,
    email: z.string().email({message:"Invaid! email"}),
    password: z.string().min(6,"Must be of atleat 6 characters"),
})
