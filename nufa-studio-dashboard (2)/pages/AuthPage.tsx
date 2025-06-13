
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../App'; 
import { ArrowPathIcon } from '../components/icons';

interface AuthPageProps {
  mode: 'signin' | 'signup' | 'forgot-password';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [confirmPassword, setConfirmPassword] = useState(''); // For signup
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordSubmitted, setForgotPasswordSubmitted] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    setForgotPasswordSubmitted(false);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }
      console.log('Signing up with:', name, email, password);
    } else if (mode === 'signin') {
      console.log('Signing in with:', email, password);
    } else if (mode === 'forgot-password') {
        console.log('Requesting password reset for:', email);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
        setForgotPasswordSubmitted(true);
        setIsLoading(false);
        return;
    }


    await new Promise(resolve => setTimeout(resolve, 1000));

    login(() => navigate(from, { replace: true }));
  };

  const pageTitle = mode === 'signin' ? 'Sign In to Nufa Studio' 
                  : mode === 'signup' ? 'Create Your Nufa Account' 
                  : 'Reset Your Password';
  
  const submitButtonText = mode === 'signin' ? 'Sign In'
                         : mode === 'signup' ? 'Create Account'
                         : 'Send Password Reset Link';
  
  const loadingButtonText = mode === 'signin' ? 'Signing In...'
                          : mode === 'signup' ? 'Creating Account...'
                          : 'Sending Link...';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg-dark p-4 sm:p-6 lg:p-8">
      <Link to="/" className="flex items-center space-x-2 mb-10">
        <span className="bg-brand-teal text-black font-bold text-3xl px-3 py-1.5 rounded">N</span>
        <span className="text-3xl font-semibold text-white">nufa.studio</span>
      </Link>
      <Card className="w-full max-w-md bg-brand-bg-card border border-neutral-700/50 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          {pageTitle}
        </h2>

        {forgotPasswordSubmitted && mode === 'forgot-password' ? (
            <div className="text-center">
                <p className="text-green-400 text-base mb-6">If an account exists for {email}, you will receive an email with instructions on how to reset your password shortly.</p>
                <Link to="/signin" className="font-medium text-brand-teal hover:underline">
                    Back to Sign In
                </Link>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
                <Input
                id="name"
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                disabled={isLoading}
                />
            )}
            {(mode === 'signin' || mode === 'signup' || mode === 'forgot-password') && (
                <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    disabled={isLoading}
                />
            )}
            {(mode === 'signin' || mode === 'signup') && (
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    disabled={isLoading}
                />
            )}
            {mode === 'signup' && (
                <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
                />
            )}

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full !py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                        {loadingButtonText}
                    </>
                ) : submitButtonText}
            </Button>
            </form>
        )}

        {!forgotPasswordSubmitted && (
            <div className="mt-8 text-center">
            {mode === 'signin' && (
                <>
                    <p className="text-base text-neutral-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-brand-teal hover:underline">
                        Sign Up
                    </Link>
                    </p>
                    <p className="mt-3">
                        <Link to="/forgot-password" className="text-sm text-neutral-500 hover:text-brand-teal hover:underline">
                            Forgot your password?
                        </Link>
                    </p>
                </>
            )}
            {mode === 'signup' && (
                <p className="text-base text-neutral-400">
                Already have an account?{' '}
                <Link to="/signin" className="font-medium text-brand-teal hover:underline">
                    Sign In
                </Link>
                </p>
            )}
             {mode === 'forgot-password' && !forgotPasswordSubmitted && (
                <p className="text-base text-neutral-400">
                    Remember your password?{' '}
                    <Link to="/signin" className="font-medium text-brand-teal hover:underline">
                        Sign In
                    </Link>
                </p>
             )}
            </div>
        )}
      </Card>
       <p className="mt-8 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} nufa.studio. All rights reserved.
      </p>
    </div>
  );
};

export default AuthPage;
