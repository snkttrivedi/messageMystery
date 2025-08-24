import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


import mongoose, { Mongoose } from "mongoose";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){
    try {
        await dbconnect();
        const {username,content} = await request.json();
        const usr  = await UserModel.findOne({username:username});
        if(!usr)    {
            return Response.json(
                {
                    success: false,
                    message:"User not found"
                },
                {status:404}
            )
        }
        else if(!usr.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message:"User is no longer accepting messages"
                },
                {status:403}
            )
        }
        else{
            const newMessage= {
                content,
                createdAt: new Date()
            }
            usr.messages.push(newMessage as Message);
            await usr.save();
      
            return Response.json(
                {
                    success: true,
                    message:"Message sent successfully",
                },
                {status:200}
            )
        
        }

    } catch (error:any) {
        return Response.json(
            {
                success: false,
                message:"Something went wrong! Try again later!",
                error:error.message
            },  
            {status:401}
        )
    }
}