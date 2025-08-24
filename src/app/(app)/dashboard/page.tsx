"use client"
import { Button } from '@/components/ui/button';
import MessageCard from '@/components/ui/messageCard';
import NavBar from '@/components/ui/Navbar'
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {useCallback, useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Page()  {
  const [messages,setMessages]  =useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  const [isSwitchLoading,setIsSwitchLoading] = useState(false);
  const {toast} = useToast();
  const handleDeleteMessage = async (messageId:string) => {
    const nmsg = messages.filter((m)=>{
      return m._id !== messageId;
    })
    setMessages(nmsg);

  }
  const {data:session} = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const {register, watch, setValue} = form;
  const acceptMessages  = watch('acceptMessages');
  const fetchAcceptMessage = useCallback(async ()=>{
    setIsSwitchLoading(true);
    try {
      const reponse = await axios.get('/api/accept-messages');
      setValue('acceptMessages',reponse.data.isAcceptingMessage);
    } catch (error:any) {
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive"
      })
    } finally{
      setIsSwitchLoading(false);
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async (refresh:boolean = false)=>{
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get('/api/get-messages');
      setMessages(response.data.messages.length>0 && response.data.messages || []);
      if(refresh){
        toast({
          title:"Refreshed!",
          description:"Showing latest messages",
        })
      }
    } catch (error:any) {
      if(refresh)
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive"
      })
    } finally{
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },[setIsLoading,setMessages,setIsSwitchLoading,toast]);

  useEffect(() => {
    if(!session || !session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session,setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      await axios.post('/api/accept-messages',{
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages',!acceptMessages);
      toast({
        title:"Success",
        description:`Messages are now ${acceptMessages ? "disabled" : "enabled"}`,
      })
    } catch (error:any) {
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive"
      })
    }
  }

  if(!session || !session?.user) return( <div>Please Login</div> )

    const { username } = session.user ;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;
    const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title:"Copied",
        description:"Profile URL copied to clipboard",
      });
    }
  return (
    
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
  
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
  
        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <Separator />
  
        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    
  )
}
