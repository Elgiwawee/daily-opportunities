
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BellIcon, BellOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const NotificationManager = () => {
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if service workers and push messaging are supported
  const isPushSupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  };

  // Initialize service worker and check permission status
  useEffect(() => {
    if (!isPushSupported()) {
      console.log('Push notifications not supported');
      return;
    }

    // Check current permission
    setPermission(Notification.permission);

    // Register service worker
    navigator.serviceWorker.register('/sw.js')
      .then(async (registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for existing subscription
        const subscription = await registration.pushManager.getSubscription();
        setSubscription(subscription);
        
        // Set up cookie for returning users
        checkCookieConsent();
        
        // Prompt for notifications if permission is not determined yet
        if (Notification.permission === 'default') {
          // We'll prompt when they interact with the site
          console.log('Notification permission status: default');
        } else if (Notification.permission === 'granted') {
          // Auto-subscribe for returning users who already granted permission
          if (!subscription) {
            console.log('Permission already granted, subscribing automatically');
            subscribeToNotifications();
          }
        }
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
      
    // Listen for new opportunities to show notifications
    listenForNewOpportunities();
  }, []);

  // Set a cookie with an expiration date
  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  // Get a cookie value by name
  const getCookie = (name: string) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return '';
  };

  // Check if user has already given cookie consent
  const checkCookieConsent = () => {
    const consent = getCookie('cookieConsent');
    if (!consent) {
      toast(
        'This site uses cookies to enhance your experience and provide notifications about new opportunities.',
        {
          description: 'By continuing to use this site, you consent to our cookie policy.',
          action: {
            label: 'Accept',
            onClick: () => {
              setCookie('cookieConsent', 'accepted', 365);
              // After accepting cookies, ask about notifications
              promptForNotifications();
            }
          },
          duration: 10000,
        }
      );
    }
  };
  
  // Prompt for notifications after interacting with site
  const promptForNotifications = () => {
    if (Notification.permission === 'default') {
      toast(
        'Stay updated with new opportunities!',
        {
          description: 'Enable notifications to receive alerts when new scholarships and jobs are posted.',
          action: {
            label: 'Enable',
            onClick: () => subscribeToNotifications()
          },
          duration: 10000,
        }
      );
    }
  };

  // Listen for new opportunities via Supabase realtime
  const listenForNewOpportunities = () => {
    const channel = supabase
      .channel('opportunities-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'opportunities'
        },
        (payload) => {
          if (Notification.permission === 'granted') {
            const newOpportunity = payload.new as any;
            showNewOpportunityNotification(newOpportunity);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Subscribe to push notifications
  const subscribeToNotifications = async () => {
    if (!isPushSupported()) {
      toast.error('Push notifications are not supported by your browser');
      return;
    }

    try {
      setLoading(true);
      
      // Request permission if not granted
      if (permission !== 'granted') {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result !== 'granted') {
          // Handle denied permission gracefully
          toast.error('You can enable notifications later from the settings');
          setLoading(false);
          return;
        }
      }
      
      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push
      const subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // In real implementation, this key should come from your server
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
        )
      };
      
      const pushSubscription = await registration.pushManager.subscribe(subscriptionOptions);
      setSubscription(pushSubscription);
      
      // Store the subscription on your server
      await saveSubscription(pushSubscription);
      
      setCookie('notificationsEnabled', 'true', 365);
      toast.success('Successfully subscribed to notifications');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      toast.info('Please allow notifications from your browser settings');
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribeFromNotifications = async () => {
    if (!subscription) return;
    
    try {
      setLoading(true);
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Remove subscription from server
      await deleteSubscription(subscription);
      
      setCookie('notificationsEnabled', 'false', 365);
      toast.success('Successfully unsubscribed from notifications');
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      toast.error('Failed to unsubscribe from notifications');
    } finally {
      setLoading(false);
    }
  };

  // Save subscription to database
  const saveSubscription = async (subscription: PushSubscription) => {
    // Get current user ID if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const subscriptionJSON = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = subscriptionJSON.keys?.p256dh;
    const auth = subscriptionJSON.keys?.auth;

    if (!p256dh || !auth) {
      throw new Error('Invalid subscription keys');
    }

    try {
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({ 
          endpoint, 
          p256dh, 
          auth, 
          user_id: userId || null
        }, { 
          onConflict: 'endpoint' 
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  };

  // Delete subscription from database
  const deleteSubscription = async (subscription: PushSubscription) => {
    try {
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  };

  // Helper function to show notifications
  const showNewOpportunityNotification = (opportunity: any) => {
    if (Notification.permission === 'granted' && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(`New ${opportunity.type}: ${opportunity.title}`, {
          body: `From ${opportunity.organization}`,
          icon: '/og-image.png',
          badge: '/favicon.ico',
          data: {
            url: `/opportunity/${opportunity.id}`
          }
        });
      });
    }
  };

  // Convert base64 to Uint8Array for applicationServerKey
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!isPushSupported()) {
    return null;
  }

  return (
    <div onClick={promptForNotifications}>
      {subscription ? (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            unsubscribeFromNotifications();
          }}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <BellOffIcon className="h-4 w-4" />
          <span className="hidden md:inline">Notifications On</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            subscribeToNotifications();
          }}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <BellIcon className="h-4 w-4" />
          <span className="hidden md:inline">Get Notified</span>
        </Button>
      )}
    </div>
  );
};

export default NotificationManager;
