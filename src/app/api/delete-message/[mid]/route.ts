import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth"; 
import { NextRequest } from "next/server";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request:NextRequest, {params}:{params:{mid:string}}){
    try {
        await dbconnect();
        const messageId = params.mid;
        const session =  await getServerSession(authOptions);
        if(!session || !session.user)
            throw new Error("User not authenticated");
        const user:User = session?.user as User;
    const updatedResult = await UserModel.updateOne(
         {_id: user._id},
         { $pull: {messages: {_id:messageId}}}
       )
        if(updatedResult.modifiedCount===0){
            return Response.json(
                {
                    success: true,
                    message:"Message not found or already deleted"
                },
                {status:404}
            )
        }
        return Response.json(
            {
                success: true,
                message:"Message deleted successfully"
            },
            {status:200}
        )

    } catch (error:any) {
        console.log("Error")
        return Response.json(
            {
                success: false,
                message:"Something went wrong!",
                error:error.message
            },  
            {status:500}
        )
    }
}