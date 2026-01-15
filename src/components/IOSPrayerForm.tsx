import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function IOSPrayerForm() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !request.trim()) {
      toast.error('Please fill in your name and prayer request');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-prayer-request', {
        body: {
          name: name.trim(),
          email: email.trim(),
          prayerRequest: request.trim(),
          userId: user?.id || null, // Link to user if authenticated
        },
      });

      if (error) {
        console.error('Prayer request submission failed');
        toast.error('Failed to send prayer request. Please try again.');
        return;
      }

      setIsSubmitted(true);
      toast.success('Your prayer request has been sent');
    } catch (err) {
      console.error('Prayer request submission failed');
      toast.error('Failed to send prayer request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full text-center py-12 animate-scale-in">
        <div className="ios-card p-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-foreground" />
          <h3 className="text-xl font-semibold mb-3">Prayer Request Received</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for sharing your heart with us. We will be praying for you.
          </p>
          {user && (
            <p className="text-sm text-muted-foreground mb-4">
              You can track this request in{' '}
              <Link to="/my-prayers" className="underline hover:text-foreground">
                My Prayers
              </Link>
            </p>
          )}
          <button
            onClick={() => {
              setIsSubmitted(false);
              setName('');
              setEmail('');
              setRequest('');
            }}
            className="ios-button-secondary"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="ios-card-grouped">
          <div className="ios-list-item flex-col items-start gap-1">
            <label htmlFor="name" className="text-sm text-muted-foreground">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-1"
              placeholder="Enter your name"
              maxLength={100}
            />
          </div>

          <div className="ios-list-item flex-col items-start gap-1">
            <label htmlFor="email" className="text-sm text-muted-foreground">
              Email <span className="opacity-50">(optional)</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-1"
              placeholder="your@email.com"
              maxLength={255}
            />
          </div>
        </div>

        {/* Prayer Request Field */}
        <div className="ios-card p-4">
          <label htmlFor="request" className="block text-sm text-muted-foreground mb-2">
            Your Prayer Request
          </label>
          <textarea
            id="request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={5}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
            placeholder="Share what's on your heart..."
            maxLength={2000}
          />
          <p className="text-right text-xs text-muted-foreground mt-2">
            {request.length}/2000
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="ios-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Prayer Request
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Your prayer request will be sent to our team who will pray for you.
        </p>
      </form>
    </div>
  );
}
