"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {  useEffect, useState } from "react";
import  {useDebounceValue} from "usehooks-ts";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { ApiResponse } from "@/Types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
const Page = () => {
  
  const [isSubmiting, setIsSubmitting] = useState(false);
  const {toast} = useToast();
  const router:any = useRouter();
  // zod implementation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier: "",
      password: ""
    }
  });
 

    const onSubmit = async (data: z.infer<typeof signInSchema>) =>{
        const response  = await signIn('credentials',{
          redirect:false,
          identifier: data.identifier,
          password: data.password,
        })
        if(response?.error){
          toast({
            title: 'Login Failed!',
            description: "Incorrect email or pwd",
            variant: "destructive"
          })
        }
        console.log(response);
        if(response?.url){
          router.replace('/dashboard');
        }

    }

  return (
  

<div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join Mystery Message 
          </h1>
      <p className="mb-4">Sign in to start your anonymous adventure </p>
    </div>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

    
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email goes here..." {...field} onChange={(e)=>{
                  field.onChange(e);
                  
                }}/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        /> 

<FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password goes here..." type="password" {...field} onChange={(e)=>{
                  field.onChange(e);
            
                }}/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        /> 
        

        <Button type="submit" disabled={isSubmiting}>
          Sign In
        </Button>
     </form>
    </Form>
  </div>
</div>
    
  )
}
export default Page;