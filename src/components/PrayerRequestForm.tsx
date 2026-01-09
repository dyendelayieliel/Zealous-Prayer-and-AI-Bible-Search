import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function PrayerRequestForm() {
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
    
    // For now, we'll show a success message
    // The actual email sending will require Cloud to be enabled
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Your prayer request has been received');
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto text-center py-12 animate-fade-in">
        <CheckCircle className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h3 className="text-2xl font-display mb-4">Prayer Request Received</h3>
        <p className="text-muted-foreground font-body mb-6">
          Thank you for sharing your heart with us. We will be praying for you.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setName('');
            setEmail('');
            setRequest('');
          }}
          className="px-6 py-3 border border-border text-foreground font-body text-sm uppercase tracking-widest transition-all hover:border-primary hover:border-glow"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-body uppercase tracking-widest text-muted-foreground mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:border-glow transition-all"
            placeholder="Enter your name"
            maxLength={100}
          />
        </div>

        {/* Email Field (Optional) */}
        <div>
          <label htmlFor="email" className="block text-sm font-body uppercase tracking-widest text-muted-foreground mb-2">
            Email <span className="text-muted-foreground/50">(optional)</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-input border border-border px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:border-glow transition-all"
            placeholder="your@email.com"
            maxLength={255}
          />
        </div>

        {/* Prayer Request Field */}
        <div>
          <label htmlFor="request" className="block text-sm font-body uppercase tracking-widest text-muted-foreground mb-2">
            Your Prayer Request
          </label>
          <textarea
            id="request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={5}
            className="w-full bg-input border border-border px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:border-glow transition-all resize-none"
            placeholder="Share what's on your heart..."
            maxLength={2000}
          />
          <p className="text-right text-xs text-muted-foreground mt-1">
            {request.length}/2000
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="text-center text-xs text-muted-foreground font-body">
          Your prayer request will be sent to our team who will pray for you.
        </p>
      </form>
    </div>
  );
}
