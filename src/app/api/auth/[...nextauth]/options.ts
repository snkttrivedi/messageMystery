import {NextAuthOptions, User} from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs"
import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { error } from "console";
import { pages } from "next/dist/build/templates/app-page";

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            id: "credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              email: { label: "Email", type: "email", placeholder: "smith@email.com" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any> {
                try {
                    
                    await dbconnect();

                    const user =  await UserModel.findOne({
                        $or:[{email:credentials.identifier}]
                    }
                    );
                    if(!user){
                        throw new Error("User not found");
                    }
                    
                    const ispk = await bcryptjs.compare(credentials.password,user.password);
                    if(ispk) return user;
                    else throw new Error("Incorrect Password");
                } catch (err:any) {
                    throw new Error(err);
                }
              
            }
          })],
          pages: {
            signIn: '/signin',
          },
          session:{
            strategy:"jwt",

          },
          secret:process.env.NEXTAUTHSECRET,
          callbacks:{ 
            async jwt({ token, user }) {
                if(user){
                    token._id  = user._id?.toString();
                    token.verified = user.verified;
                    token.isAcceptingMessage = user.isAcceptingMessage;
                    token.username =   user.username
                }
                return token;
              },
              async session({ session,token}) {
                if(token){
                    session.user._id = token._id
                    session.user.verified = token.verified
                    session.user.isAcceptingMessage = token.isAcceptingMessage
                    session.user.username = token.username

                }
                return session
              }
          }

    
}
