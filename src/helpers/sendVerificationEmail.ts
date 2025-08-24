import { resend } from "@/lib/resend";
import VerifyEmailTemplate from "../../Emails/verficationEmail";
import {ApiResponse} from "@/Types/ApiResponse";

export async function sendVerificationEmail(email:string,username:string,verifyCode:string): Promise<ApiResponse>{
    const otp = verifyCode;
    try{
       const emr =  await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Verify yourself",
            text:"",
            react: VerifyEmailTemplate({ username,otp:verifyCode }),
          });
          console.log(emr)
        return { success:true,message:'verification email'}
    }
    catch(emailError){
        console.error("error sending email "+emailError);
        return { success:false,message:'failed to send verification email'}
    }

}