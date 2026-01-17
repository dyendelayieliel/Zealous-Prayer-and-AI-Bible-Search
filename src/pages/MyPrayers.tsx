import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Clock, CheckCircle, MessageCircle } from 'lucide-react';

interface PrayerRequest {
  id: string;
  name: string;
  prayer_request: string;
  status: string;
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'text-amber-600 bg-amber-100' },
  prayed: { label: 'Prayed', icon: CheckCircle, className: 'text-green-600 bg-green-100' },
  followed_up: { label: 'Followed Up', icon: MessageCircle, className: 'text-blue-600 bg-blue-100' },
};

const MyPrayers = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrayers = async () => {
      // Only fetch prayers for authenticated users
      // Anonymous prayer tracking is not supported for security reasons
      if (!user) {
        setPrayers([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('prayer_requests')
        .select('id, name, prayer_request, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load prayers');
        setPrayers([]);
      } else {
        setPrayers(data || []);
      }
      setIsLoading(false);
    };

    if (!authLoading) {
      fetchPrayers();
    }
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-5 pt-12 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="ios-large-title">My Prayers</h1>
            <p className="text-muted-foreground text-sm">
              Track your prayer requests
            </p>
          </div>
        </div>

        {/* Prayer list */}
        {!user ? (
          <div className="ios-card p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Sign in to track your prayer requests.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="ios-button-primary mb-3"
            >
              Sign In
            </button>
            <p className="text-xs text-muted-foreground">
              Anonymous prayer requests are not tracked for privacy reasons.
            </p>
          </div>
        ) : prayers.length === 0 ? (
          <div className="ios-card p-8 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't submitted any prayer requests yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="ios-button-primary"
            >
              Submit a Prayer Request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer) => {
              const status = statusConfig[prayer.status as keyof typeof statusConfig] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div key={prayer.id} className="ios-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(prayer.created_at)}
                    </span>
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-3">
                    {prayer.prayer_request}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrayers;
