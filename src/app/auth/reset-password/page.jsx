  // app/(auth)/reset-password/page.jsx
  'use client';
  import { useState, useEffect , useRef,Suspense} from 'react';
  import { useSearchParams, useRouter } from 'next/navigation';
  import Link from 'next/link';
  import { resetPassword,verifyResetToken } from '@/app/lib/passwordService';


   function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validToken, setValidToken] = useState(false);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Verify token on component mount
    useEffect(() => {
      if (!token) {
        setError('Invalid reset link');
        return;
      }

      const verifyToken = async () => {
        try {
          await verifyResetToken(token);
          setValidToken(true);
        } catch (err) {
          setError('Invalid or expired reset link');
        }
      };

      verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      try {
        await resetPassword(token, password);
        setMessage('Password reset successfully! Redirecting to login...');
        
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    };

    if (!token || error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <div className="text-center text-red-600 mb-4">{error}</div>
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
              Request new reset link
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{message}</div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !validToken}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
    // ✅ Wrap in Suspense to fix useSearchParams() build error
    export default function Page() {
      return (
        <Suspense fallback={<div>Loading verification page...</div>}>
          <ResetPasswordPage />
        </Suspense>
      );
  }
