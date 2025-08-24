import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/Types/ApiResponse";
import { NextRequest } from "next/server";
export async function POST(request:NextRequest){
    await dbconnect();
    try{
        const {username,email,password} = await request.json();
        const olduser = await UserModel.findOne({email:email});
        console.log(olduser)
        if(!olduser){
            const newUser = new UserModel({
                username:username,
                email:email,
                password: await bcrypt.hash(password,10),
                verifyCode: Math.random().toString(36).substring(7),
                verifyCodeExpiry: new Date(Date.now() + 3600000),
                verified:false,
                isAcceptingMessage:true,
                messages:[]
            });
            await newUser.save();
            const emailResponse = await sendVerificationEmail(email,username,newUser.verifyCode);
            if(!emailResponse.success){
                const msg:ApiResponse = {
                    success:false,
                    message:"Some error occured"
                }
                return Response.json(msg,{status:500});
            }
            else{
                const msg:ApiResponse = {
                    success:true,
                    message:"User registered successfully Please verify your email"
                }
                return Response.json(msg,{status:201});
            }
        }
        else{
            const msg:ApiResponse = {
                success:false,
                message:"User already exists"
            }
            return Response.json(msg,{status:400});
        }
    }
    catch(error){
        console.error("error registering user", error);
        const msg:ApiResponse = {
            success:false,
            message:"Some error occured"
        }
        return Response.json(msg,{status:500});
    }
}