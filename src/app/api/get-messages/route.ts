import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth"; 
import { NextRequest } from "next/server";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose, { Mongoose } from "mongoose";

export async function GET(request:NextRequest){
    try {
        await dbconnect();
        const session =  await getServerSession(authOptions);
        if(!session || !session.user)
            throw new Error("User not authenticated");
        const user:User = session?.user as User;
        console.log(user)
        const userId = new mongoose.Types.ObjectId(user._id);
        const message = await UserModel.aggregate([{
            $match:{
                _id:userId
            }
        },{
            $unwind: '$messages'
        },{
            $sort: {'messages.createdAt':-1}
        } ,{
            $group:{_id:'$_id' , messages:{$push:'$messages'}}
        }
         
        ]);
        
        if(!message||message.length==0){
            return Response.json(
                {
                    success: true,
                    message:"No messages found or user not found"
                },
                {status:200}
            )

        }
        return Response.json(
            {
                success: true,
                messages:message[0].messages
            },
            {status:200}
        )

    } catch (error:any) {
        return Response.json(
            {
                success: false,
                message:"Something went wrong!",
                error:error.message
            },  
            {status:401}
        )
    }
}