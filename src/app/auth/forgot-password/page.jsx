// app/(auth)/forgot-password/page.jsx - Alternative version
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { forgotPassword } from '@/app/lib/passwordService';


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await forgotPassword(email);
      setMessage('✅ Password reset link has been sent to your email! Check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || '❌ Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-3" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           minHeight: '100vh'
         }}>
      
      <div className="flex flex-column align-items-center w-full md:w-6 lg:w-4">
        {/* Logo */}
        <div className="flex align-items-center mb-4">
          <div className="flex align-items-center justify-content-center bg-blue-600 text-white border-circle w-3rem h-3rem mr-3">
            <i className="pi pi-car text-xl"></i>
          </div>
          <span className="text-3xl font-bold text-white">CarGo</span>
        </div>

        <Card className="w-full shadow-5 border-round-xl">
          {/* Header */}
          <div className="text-center mb-4">
            <i className="pi pi-key text-6xl text-blue-600 mb-3"></i>
            <h2 className="text-2xl font-bold text-900 mb-2">Forgot Password?</h2>
            <p className="text-600 m-0">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <Divider />

          <form onSubmit={handleSubmit} className="flex flex-column gap-4">
            {/* Email Input */}
            <div className="field">
              <label htmlFor="email" className="block text-900 font-medium mb-2">
                <i className="pi pi-envelope mr-2"></i>
                Email Address
              </label>
              <InputText
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full"
                size="large"
                required
                disabled={loading}
              />
            </div>

            {/* Messages */}
            {message && (
              <Message 
                severity="success" 
                text={message}
                className="w-full"
                icon="pi pi-check"
              />
            )}

            {error && (
              <Message 
                severity="error" 
                text={error}
                className="w-full"
                icon="pi pi-exclamation-triangle"
              />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              label={loading ? "Sending Reset Link..." : "Send Reset Link"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
              className="w-full p-button-lg"
              disabled={loading || !email}
              severity="info"
            />

            {/* Back to Login */}
            <div className="text-center mt-3">
              <Link href="/auth/login" className="no-underline">
                <Button 
                  label="Back to Login" 
                  icon="pi pi-arrow-left" 
                  className="p-button-text" 
                  disabled={loading}/>
              </Link>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-4 text-center">
          <span className="text-white text-sm">
            Need help? Contact our <a href="#" className="text-white font-semibold underline">support team</a>
          </span>
        </div>
      </div>
    </div>
  );
}
