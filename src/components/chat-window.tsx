'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore, useMessageStore, usePropertyStore } from '@/lib/store';
import { Message, User, Property } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  X, 
  Building2, 
  MapPin, 
  MessageSquare,
  Clock,
  CheckCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  otherUserId: string;
  propertyId?: string;
  onClose: () => void;
}

export function ChatWindow({ otherUserId, propertyId, onClose }: ChatWindowProps) {
  const { currentUser, getUserById } = useAuthStore();
  const { getMessagesBetweenUsers, createMessage, markAsRead } = useMessageStore();
  const { getPropertyById } = usePropertyStore();
  
  const [content, setContent] = useState('');
  const [otherUser, setOtherUser] = useState<User | undefined>();
  const [property, setProperty] = useState<Property | undefined>();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = getMessagesBetweenUsers(currentUser?.id || '', otherUserId, propertyId);
  
  useEffect(() => {
    setOtherUser(getUserById(otherUserId));
    if (propertyId) {
      setProperty(getPropertyById(propertyId));
    }
  }, [otherUserId, propertyId, getUserById, getPropertyById]);

  useEffect(() => {
    // Mark messages as read when window is open
    messages.forEach(msg => {
      if (msg.receiverId === currentUser?.id && !msg.isRead) {
        markAsRead(msg.id);
      }
    });
    scrollToBottom();
  }, [messages, currentUser?.id, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    
    createMessage(currentUser.id, otherUserId, content.trim(), propertyId);
    setContent('');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!otherUser) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-[400px] h-[550px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-8 duration-500 z-50 overflow-hidden dark:bg-[#0c0c0c]">
      <CardHeader className="bg-primary p-4 text-primary-foreground flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground text-primary font-bold">
              {otherUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight leading-none mb-1">
              {otherUser.name}
            </CardTitle>
            <p className="text-[10px] font-bold opacity-80 flex items-center gap-1 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Now
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-white/10 rounded-full h-8 w-8">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      {property && (
        <div className="bg-white/5 border-b border-white/10 p-2.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate uppercase tracking-tight">{property.title}</p>
            <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70">
              <MapPin className="h-2.5 w-2.5" />
              {property.location}
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground font-black text-[9px] px-1.5 py-0.5 h-fit shrink-0">
            {property.propertyCode}
          </Badge>
        </div>
      )}

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <MessageSquare className="h-12 w-12 mb-3 text-primary/50" />
            <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
              Start a conversation securely<br/>regarding this property
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col max-w-[85%]",
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div 
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm font-bold shadow-sm",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-white dark:bg-white/10 rounded-tl-none border border-border dark:border-white/5"
                  )}
                >
                  {msg.content}
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-1">
                  <span className="text-[9px] font-bold opacity-50 uppercase tracking-tighter">
                    {formatTime(msg.createdAt)}
                  </span>
                  {isMe && (
                    <CheckCheck className={cn("h-3 w-3", msg.isRead ? "text-blue-500" : "text-muted-foreground opacity-30")} />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Input 
            placeholder="Type your message..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-xl border-primary/20 focus-visible:ring-primary font-bold dark:bg-black/40"
          />
          <Button type="submit" size="icon" disabled={!content.trim()} className="rounded-xl shrink-0 shadow-lg shadow-primary/20">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
