import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest } from "next/server";
export async function POST(request:NextRequest){
    try {
        await dbconnect();
        const session =  await getServerSession(authOptions);
        const user:User = session?.user as User;
        if(!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message:"User is not authenticated",
                },
                {status:401}
            )
        }
        const userId = user._id;
        const {acceptMessages} = await request.json();
        const userUpdate = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true});
        if(!userUpdate) throw new Error("User accept message failed!")
        else
        return Response.json(
            {
                success: true,
                message:"User is AcceptingMessage updated",
                user:userUpdate
            },
            {status:200}
        )
        
    } catch (error:any) {
        return Response.json({
            success: false,
            message:"Error updating isAcceptingMessage",
            error: error.message
        },{status:500}
    )
    }
}
export async function GET(request:Request){
    try {
        await dbconnect();
        const session =  await getServerSession(authOptions);
        const user:User = session?.user as User;
        if(!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message:"User is not authenticated",
                },
                {status:401}
            )
        }
        const userId = user._id;
        const currUser = await UserModel.findById(userId);
        if(!currUser) throw new Error("User not found");

        const txt = (currUser?.isAcceptingMessage)? "accepting":"not accepting";
        return Response.json(
            {
                success: true,
                isAcceptingMessage:currUser?.isAcceptingMessage,
            },
            {status:200}
        )
        
    } catch (error:any) {
        return Response.json({
            success: false,
            message:"Error ",
            error: error.message
        },{status:404}
    )
    }
}