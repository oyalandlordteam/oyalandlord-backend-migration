'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
<<<<<<< HEAD
import { useAuthStore, useNotificationStore } from '@/lib/store';
import { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  MessageSquare,
  Calendar,
  CreditCard,
  AlertCircle,
  Check,
  Trash2,
  MoreVertical,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Format dynamic date/time relative to now
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

export default function NotificationPanel() {
  const { navigate } = useRouter();
  const { currentUser } = useAuthStore();
  const { 
    getNotificationsByUser, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getUnreadCount
  } = useNotificationStore();
  const { toast } = useToast();

  const notifications = getNotificationsByUser(currentUser?.id || '');
  const unreadCount = getUnreadCount(currentUser?.id || '');

  // Sort by date (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    if (currentUser) {
      markAllAsRead(currentUser.id);
      toast({
        title: 'All notifications read',
        description: 'Your notification center is up to date.',
      });
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Logic to navigate based on notification type
    switch (notification.type) {
      case 'inspection_request':
        if (currentUser?.role === 'landlord') navigate('landlord-dashboard');
        else if (currentUser?.role === 'solicitor') navigate('solicitor-dashboard');
        else navigate('tenant-inspections');
        break;
      case 'payment_received':
        navigate('landlord-dashboard');
        break;
      case 'new_message':
        // Navigation handled by chat window usually, but here:
        break;
      case 'new_bid':
        navigate('landlord-dashboard');
        break;
      case 'property_report':
        if (currentUser?.role === 'admin') navigate('admin-dashboard');
        break;
      case 'announcement':
        // Stay here or go to special page
        break;
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'inspection_request': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment_received': return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'new_message': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'new_bid': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'property_report': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'announcement': return <Bell className="h-4 w-4 text-primary" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="container max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your property activities.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {sortedNotifications.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-1">No notifications yet</h2>
          <p className="text-muted-foreground">
            We&apos;ll notify you when something important happens!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                notification.read 
                  ? 'bg-card border-border' 
                  : 'bg-primary/5 border-primary/20 shadow-sm'
              }`}
            >
              {!notification.read && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-full" />
              )}
              
              <div className="flex gap-4">
                <div className={`mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
                  notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm tracking-tight leading-snug ${notification.read ? 'text-muted-foreground' : 'font-semibold'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center shrink-0">
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.read && (
                            <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={(e) => handleDelete(notification.id, e)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {notification.type === 'inspection_request' && (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="secondary" className="h-7 text-xs px-3">
                        View Details
                      </Button>
                    </div>
                  )}
                  
                  {notification.type === 'new_message' && (
                    <div className="mt-2">
                       <Button size="sm" variant="link" className="h-auto p-0 text-primary text-xs font-bold">
                        Reply now →
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">
              Showing your last {sortedNotifications.length} notifications
            </p>
          </div>
        </div>
=======
import { useAuthStore, useNotificationStore, useMessageStore, usePropertyStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatWindow } from '@/components/chat-window';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bell,
  MessageSquare,
  ArrowLeft,
  Check,
  CheckCheck,
  AlertCircle,
  Calendar,
  Home,
  DollarSign,
  Settings,
  Send,
  Clock,
  User,
  Building2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Message, Notification, MessageType } from '@/lib/types';

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
  });
}

// Notification icon based on type
function NotificationIcon({ type }: { type: Notification['type'] }) {
  switch (type) {
    case 'inspection':
      return <Calendar className="h-4 w-4" />;
    case 'rental':
      return <Home className="h-4 w-4" />;
    case 'message':
      return <MessageSquare className="h-4 w-4" />;
    case 'payment':
      return <DollarSign className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

// Message type icon
function MessageTypeIcon({ type }: { type: MessageType }) {
  switch (type) {
    case 'complaint':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'inquiry':
      return <MessageSquare className="h-4 w-4 text-primary" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
}

export default function NotificationPanel() {
  const { navigate, goBack } = useRouter();
  const { currentUser, getUserById } = useAuthStore();
  const { getNotificationsByUser, markAsRead, markAllAsRead, getUnreadCount } = useNotificationStore();
  const { messages, createMessage } = useMessageStore();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications');
  const [activeChat, setActiveChat] = useState<{ userId: string; propertyId?: string } | null>(null);
  
  // Compose message state
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composeType, setComposeType] = useState<MessageType>('general');
  const [composeReceiverId, setComposeReceiverId] = useState('');
  
  const notifications = getNotificationsByUser(currentUser?.id || '');
  const unreadCount = getUnreadCount(currentUser?.id || '');

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl as any);
    }
  };
  
  // Group messages by conversation (user + property)
  const getConversations = () => {
    const conversations: Record<string, {
      otherUserId: string;
      propertyId?: string;
      lastMessage: Message;
    }> = {};

    messages.forEach(msg => {
      const otherUserId = msg.senderId === currentUser?.id ? (msg.recipientId || msg.receiverId || '') : msg.senderId;
      const key = `${otherUserId}-${msg.propertyId || 'global'}`;
      
      if (!conversations[key] || new Date(msg.createdAt) > new Date(conversations[key].lastMessage.createdAt)) {
        conversations[key] = {
          otherUserId,
          propertyId: msg.propertyId,
          lastMessage: msg,
        };
      }
    });

    return Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  };

  const conversations = getConversations();
  
  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Notifications & Messages</h1>
        <p className="text-muted-foreground">
          Stay updated with your rental activities and communicate with landlords
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'outline'}
          onClick={() => setActiveTab('notifications')}
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>
          )}
        </Button>
        <Button
          variant={activeTab === 'messages' ? 'default' : 'outline'}
          onClick={() => setActiveTab('messages')}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Chats
          {messages.filter(m => m.receiverId === currentUser?.id && !m.isRead).length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {messages.filter(m => m.receiverId === currentUser?.id && !m.isRead).length}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Your recent activity updates</CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={() => markAllAsRead(currentUser?.id || '')}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.read ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${!notification.read ? 'bg-primary/10' : 'bg-muted'}`}>
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">{notification.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Chat Conversations</CardTitle>
                <CardDescription>Property-specific discussions and inquiries</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active chats</h3>
                <p className="text-muted-foreground mb-4">
                  Property inquiries and chats will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => {
                  const otherUser = getUserById(conv.otherUserId);
                  const property = conv.propertyId ? usePropertyStore.getState().getPropertyById(conv.propertyId) : undefined;
                  const isUnread = conv.lastMessage.receiverId === currentUser?.id && !conv.lastMessage.isRead;
                  
                  return (
                    <div
                      key={`${conv.otherUserId}-${conv.propertyId}`}
                      onClick={() => setActiveChat({ userId: conv.otherUserId, propertyId: conv.propertyId })}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all hover:bg-muted/50 group flex items-start gap-4",
                        isUnread ? "bg-primary/5 border-primary/20" : "bg-card"
                      )}
                    >
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {otherUser?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-extrabold text-base">{otherUser?.name}</p>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                            {formatDate(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        
                        {property && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-[10px] font-black border-primary/30 text-primary bg-primary/5 px-1.5 h-5 uppercase tracking-tighter">
                              {property.propertyCode}
                            </Badge>
                            <p className="text-xs font-bold text-muted-foreground truncate">{property.title}</p>
                          </div>
                        )}
                        
                        <p className={cn(
                          "text-sm truncate",
                          isUnread ? "text-foreground font-bold" : "text-muted-foreground"
                        )}>
                          {conv.lastMessage.senderId === currentUser?.id && (
                            <span className="text-primary font-bold mr-1">You:</span>
                          )}
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeChat && (
        <ChatWindow 
          otherUserId={activeChat.userId}
          propertyId={activeChat.propertyId}
          onClose={() => setActiveChat(null)}
        />
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
      )}
    </div>
  );
}
