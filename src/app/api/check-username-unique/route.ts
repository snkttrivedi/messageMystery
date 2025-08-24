import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { userValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

const UsernameQuerySchema = z.object({
    username: userValidation
});
export async function GET(request:NextRequest){
    console.log("here")
    try {
      
        await dbconnect();
        const { searchParams } = request.nextUrl;
        const queryParam = {
            username : searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result);
        if(!result.success){ 
            const usernameError = result.error.format().username?._errors || []; 
            throw new Error(usernameError.join(','));
         }
        const dbsearchResult = await UserModel.findOne({username:queryParam.username});
        if(!dbsearchResult) 
        return Response.json(
            {
                success: true,
                message:"Username is unique"
            },
            {status:200}
        )
        else
        throw new Error("Username already taken");
    } catch (error:any) {
        console.error("Error in checking username " , error);
        return Response.json(
            {
                success: false,
                message:"Error checking username",
                error: error.message
            },
            {status:500}
        )
    }
}