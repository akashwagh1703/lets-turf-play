import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Phone, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { sendOTP, verifyOTP } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/search';

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await sendOTP(phoneNumber);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await verifyOTP(phoneNumber, otp);
      if (result.success) {
        if (result.isNewUser) {
          navigate('/onboarding', { state: { phoneNumber } });
        } else if (result.user) {
          login(result.user);
          navigate(from, { replace: true });
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-end items-start p-12 bg-login-hero bg-cover bg-center animate-background-pan" style={{ backgroundSize: '150%' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 150 }}
            className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 font-bold text-primary-foreground text-3xl shadow-glow-primary"
          >
            LTP
          </motion.div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Your Next Match
          </h1>
          <p className="text-xl text-gray-200 mt-4 max-w-md">
            Discover and book premium sports turfs in seconds.
          </p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-4 lg:p-8">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="bg-card rounded-2xl shadow-lifted p-8 border border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 lg:hidden font-bold text-primary-foreground text-2xl">
                LTP
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {step === 'phone' ? 'Welcome Back' : 'Enter Code'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {step === 'phone'
                  ? 'Enter your phone number to sign in or create an account.'
                  : `A 6-digit code was sent to +91 ${phoneNumber}`}
              </p>
            </div>

            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    error={error}
                    icon={<Phone size={20} />}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" isLoading={isLoading} variant="primary">
                  Send Code
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <Input
                    label="Verification Code"
                    type="text"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    error={error}
                    icon={<KeyRound size={20} />}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" isLoading={isLoading} variant="primary">
                  Verify & Proceed
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            )}

            <div className="text-center mt-6">
              {step === 'otp' && (
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError('');
                  }}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Use a different number
                </button>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Demo OTP: <span className="font-mono font-bold text-primary">123456</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
