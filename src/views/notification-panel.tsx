'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
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
      )}
    </div>
  );
}
