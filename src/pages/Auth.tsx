import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import zealousLogo from '@/assets/zealous-logo.png';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isReset = searchParams.get('reset') === 'true';
  
  const [mode, setMode] = useState<AuthMode>(isReset ? 'reset' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  
  const { signIn, signUp, signInWithGoogle, resetPassword, updatePassword, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Handle reset mode from URL
  useEffect(() => {
    if (isReset) {
      setMode('reset');
    }
  }, [isReset]);

  // Redirect if already logged in (except during password reset)
  useEffect(() => {
    if (user && !isLoading && mode !== 'reset') {
      navigate('/');
    }
  }, [user, isLoading, navigate, mode]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    if (mode === 'forgot') {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0].message;
      }
    } else if (mode === 'reset') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0].message;
      }

      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }

      if (mode === 'signup' && password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password reset email sent! Check your inbox.');
          setMode('signin');
        }
      } else if (mode === 'reset') {
        const { error } = await updatePassword(password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password updated successfully!');
          navigate('/');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully! You are now signed in.');
          navigate('/');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Forgot Password';
      case 'reset': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Sign up to track your prayer requests';
      case 'forgot': return 'Enter your email to receive a reset link';
      case 'reset': return 'Enter your new password';
      default: return 'Sign in to continue your journey';
    }
  };

  const getButtonText = () => {
    if (isSubmitting) {
      switch (mode) {
        case 'signup': return 'Creating Account...';
        case 'forgot': return 'Sending Reset Link...';
        case 'reset': return 'Updating Password...';
        default: return 'Signing In...';
      }
    }
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Send Reset Link';
      case 'reset': return 'Update Password';
      default: return 'Sign In';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-5 pt-16 pb-8">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-10">
          <img 
            src={zealousLogo} 
            alt="Zealous" 
            className="h-20 w-20 mx-auto mb-4"
          />
          <h1 className="ios-large-title mb-2">
            {getTitle()}
          </h1>
          <p className="text-muted-foreground">
            {getSubtitle()}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field - shown for signin, signup, forgot */}
          {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`ios-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          )}

          {/* Password field - shown for signin, signup, reset */}
          {(mode === 'signin' || mode === 'signup' || mode === 'reset') && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {mode === 'reset' ? 'New Password' : 'Password'}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: undefined }));
                }}
                className={`ios-input ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {/* Confirm password - shown for signup, reset */}
          {(mode === 'signup' || mode === 'reset') && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }}
                className={`ios-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="ios-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            )}
            {getButtonText()}
          </button>
        </form>

        {/* Forgot password link - only on signin */}
        {mode === 'signin' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setMode('forgot');
                setErrors({});
              }}
              className="text-sm text-primary hover:underline transition-colors"
              disabled={isSubmitting}
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Divider - only for signin/signup */}
        {(mode === 'signin' || mode === 'signup') && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={async () => {
                const { error } = await signInWithGoogle();
                if (error) {
                  toast.error(error.message);
                }
              }}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {/* Toggle between modes */}
        <div className="mt-6 text-center">
          {mode === 'signin' && (
            <button
              onClick={() => {
                setMode('signup');
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              Don't have an account? Sign up
            </button>
          )}
          {mode === 'signup' && (
            <button
              onClick={() => {
                setMode('signin');
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              Already have an account? Sign in
            </button>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <button
              onClick={() => {
                setMode('signin');
                setErrors({});
                // Clear reset param from URL
                navigate('/auth', { replace: true });
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              Back to sign in
            </button>
          )}
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;