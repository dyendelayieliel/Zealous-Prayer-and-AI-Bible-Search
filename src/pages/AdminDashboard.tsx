import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Clock, CheckCircle, MessageCircle, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrayerRequest {
  id: string;
  name: string;
  email: string | null;
  prayer_request: string;
  status: string;
  notes: string | null;
  created_at: string;
  user_id: string | null;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, className: 'text-amber-600 bg-amber-100' },
  { value: 'prayed', label: 'Prayed', icon: CheckCircle, className: 'text-green-600 bg-green-100' },
  { value: 'followed_up', label: 'Followed Up', icon: MessageCircle, className: 'text-blue-600 bg-blue-100' },
];

const AdminDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  // Check if user is admin using server-side RPC function
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        // Log generic message only - don't expose error details
        console.error('Admin verification failed');
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    };

    if (user) {
      checkAdmin();
    }
  }, [user]);

  // Redirect non-authenticated or non-admin users
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch all prayer requests (only works for admins due to RLS)
  useEffect(() => {
    const fetchPrayers = async () => {
      if (!user || !isAdmin) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Log generic message only - don't expose error details
        console.error('Failed to load prayer requests');
        toast({
          title: "Error",
          description: "Failed to load prayer requests",
          variant: "destructive"
        });
      } else {
        setPrayers(data || []);
      }
      setIsLoading(false);
    };

    if (isAdmin) {
      fetchPrayers();
    }
  }, [user, isAdmin, toast]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setSavingId(id);
    
    const { error } = await supabase
      .from('prayer_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Failed to update status');
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } else {
      setPrayers(prayers.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast({
        title: "Updated",
        description: "Prayer request status updated"
      });
    }
    
    setSavingId(null);
  };

  const handleSaveNotes = async (id: string) => {
    setSavingId(id);
    
    const { error } = await supabase
      .from('prayer_requests')
      .update({ notes: notesValue })
      .eq('id', id);

    if (error) {
      console.error('Failed to save notes');
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive"
      });
    } else {
      setPrayers(prayers.map(p => p.id === id ? { ...p, notes: notesValue } : p));
      setEditingNotes(null);
      toast({
        title: "Saved",
        description: "Notes saved successfully"
      });
    }
    
    setSavingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    
    setSavingId(id);
    
    const { error } = await supabase
      .from('prayer_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete prayer request');
      toast({
        title: "Error",
        description: "Failed to delete prayer request",
        variant: "destructive"
      });
    } else {
      setPrayers(prayers.filter(p => p.id !== id));
      toast({
        title: "Deleted",
        description: "Prayer request removed"
      });
    }
    
    setSavingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="ios-large-title mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="ios-button-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-5 pt-12 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="ios-large-title">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Manage prayer requests ({prayers.length} total)
            </p>
          </div>
        </div>

        {/* Prayer list */}
        {prayers.length === 0 ? (
          <div className="ios-card p-8 text-center">
            <p className="text-muted-foreground">
              No prayer requests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer) => {
              const statusConfig = statusOptions.find(s => s.value === prayer.status) || statusOptions[0];
              const StatusIcon = statusConfig.icon;
              const isEditing = editingNotes === prayer.id;
              const isSaving = savingId === prayer.id;

              return (
                <div key={prayer.id} className="ios-card p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{prayer.name}</span>
                        {prayer.user_id === null && (
                          <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                            Anonymous
                          </span>
                        )}
                      </div>
                      {prayer.email && (
                        <p className="text-sm text-muted-foreground">{prayer.email}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(prayer.created_at)}
                      </p>
                    </div>
                    
                    {/* Status dropdown */}
                    <select
                      value={prayer.status}
                      onChange={(e) => handleStatusChange(prayer.id, e.target.value)}
                      disabled={isSaving}
                      className={`text-sm px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusConfig.className}`}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prayer content */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {prayer.prayer_request}
                    </p>
                  </div>

                  {/* Notes section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Notes</span>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingNotes(prayer.id);
                            setNotesValue(prayer.notes || '');
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          {prayer.notes ? 'Edit' : 'Add notes'}
                        </button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          placeholder="Add internal notes about this prayer request..."
                          className="w-full p-3 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNotes(prayer.id)}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotes(null)}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : prayer.notes ? (
                      <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 whitespace-pre-wrap">
                        {prayer.notes}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 italic">No notes yet</p>
                    )}
                  </div>

                  {/* Delete button */}
                  <div className="flex justify-end pt-3 border-t border-border">
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      disabled={isSaving}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
