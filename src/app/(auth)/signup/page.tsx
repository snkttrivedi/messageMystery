"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {  useEffect, useState } from "react";
import  {useDebounceCallback} from "usehooks-ts";
import { toast } from "@/components/ui/use-toast";
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
const Page = () => {
  const [username,setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername,500 );
  // const router = useRouter();
  // zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username: "",
      email: "",
      password: ""
    }
  });
  const router = useRouter();
  useEffect(()=>{
    async function checkUsername(){
      if(username){
        
        setIsCheckingUsername(true);
        try{
          const response = await axios.get('/api/check-username-unique?username='+username);
          console.log(response)
          setUsernameMessage(response.data.message);
        }catch(error:any){
          setUsernameMessage(error.response.data.error);
         
        }finally{
          setIsCheckingUsername(false);
        }
      }
     
      }

      checkUsername();
    }
  
  ,[username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{
      console.log(data);
      setIsSubmitting(true);
      try {
        const response = await axios.post<ApiResponse>('/api/signup',data);
        console.log(response);
        if(response.data.success){
          toast({
            title: 'Success',
            description: response.data.message
          })
      
          router.push('/sign-in');
        }
        
      } catch (error:any) {
        console.log(error)
        toast({
          title:'Signup failed',
          description: error.response.data.message,
          variant: "destructive"
        })
      } finally {
        setIsSubmitting(false);
      }

    }

  return (
  

<div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join Mystery Message 
          </h1>
      <p className="mb-4">Sign up to start your anonymous adventure </p>
    </div>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

     <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username goes here..." {...field} onChange={(e)=>{
                  field.onChange(e);
              
                  debounced(e.target.value);
                }}/>
               
              </FormControl> 
              {isCheckingUsername &&  <Loader2 className="animate-spin"/>}
              <p className={`text-sm ${usernameMessage==="Username already taken by someone else" ? 'text-red-500' : 'text-green-500'}`}>
                {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        /> 
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email goes here..." {...field} onChange={(e)=>{
                  field.onChange(e);
                  
                }}/>
              </FormControl>
              <FormDescription>
           
              </FormDescription>
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
          {
            isSubmiting ? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Please Wait
            </>) : 'Sign Up'
          }
        </Button>
     </form>
    </Form>
  </div>
</div>
    
  )
}
export default Page;