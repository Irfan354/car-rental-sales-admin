"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import axios from "axios";

 function MobileOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useRef(null);
  
  // Get phone number from URL parameters
  const phoneFromSignup = searchParams.get('phone');
  const [mobile, setMobile] = useState(phoneFromSignup || "8801366342");
  const [otp, setOtp] = useState(["", "", "", "","",""]); // 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // ✅ CORRECT: Use port 8081 (not 8080)
  // const API_BASE_URL = 'http://localhost:8081';

  // ✅ Automatically send OTP when page loads
  useEffect(() => {
    if (mobile) {
      sendOtpAutomatically();
    }
  }, [mobile]);

  const sendOtpAutomatically = async () => {
    try {
      const res = await axios.post("http://localhost:8081/otp/mobile/send", {
        mobile: mobile.replace(/-/g, ""),
      });
      
      if (res.data.success) {
        toast.current.show({
          severity: 'success',
          summary: 'OTP Sent',
          detail: '6-digit verification code sent to your mobile',
          life: 3000
        });
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Failed to Send OTP',
        detail: 'Please try again',
        life: 3000
      });
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ✅ Verify Mobile OTP
  const verifyMobileOtp = async () => {
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 6) {
      toast.current.show({
        severity: 'warn',
        summary: 'Incomplete OTP',
        detail: 'Please enter all 6 digits',
        life: 3000
      });
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8081/otp/mobile/verify", {
        mobile: mobile.replace(/-/g, ""),
        otp: enteredOtp,
      });
      
      setMessage(res.data.message);
      
      if (res.data.success) {
        toast.current.show({
          severity: 'success',
          summary: 'Verified!',
          detail: 'Mobile number verified successfully',
          life: 2000
        });
        
        // Redirect to email verification after success
        setTimeout(() => router.push("/auth/verify/email"), 1500);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Verification Failed',
          detail: 'Invalid OTP code',
          life: 3000
        });
      }
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error verifying OTP',
        life: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend Mobile OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8081/otp/mobile/send", {
        mobile: mobile.replace(/-/g, ""),
      });
      
      if (res.data.success) {
        toast.current.show({
          severity: 'success',
          summary: 'OTP Sent',
          detail: 'New verification code sent to your mobile',
          life: 3000
        });
        
        setCountdown(30);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Failed to Send',
        detail: 'Failed to send OTP',
        life: 3000
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const header = (
    <div className="text-center" style={{ padding: '2rem 0 1rem 0' }}>
      <h1 style={{ 
        color: '#2563eb', 
        fontSize: '2rem', 
        fontWeight: '700', 
        marginBottom: '1rem'
      }}>
        Verify Mobile Number
      </h1>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f8fafc',
      padding: '1rem',
      margin: 0
    }}>
      <Toast ref={toast} />
      
      <Card header={header} style={{ 
        width: '100%', 
        maxWidth: '450px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: 'none',
        borderRadius: '12px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          
          {/* Description */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '1.5rem' }}>
              We sent a 4-digit OTP to:
            </p>
            
            {/* Mobile Number Display */}
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: '#1f2937', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
                {mobile}
              </p>
            </div>

            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Enter the OTP below to verify your mobile number
            </p>
          </div>

          {/* OTP Inputs */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#374151', 
              fontWeight: '600', 
              marginBottom: '1rem',
              fontSize: '0.95rem',
              textAlign: 'center'
            }}>
              Enter OTP
            </label>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.75rem',
              marginBottom: '2rem'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '60px',
                    height: '60px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              ))}
            </div>

            {/* Countdown Timer and Resend Button */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  style={{
                    color: '#2563eb',
                    fontWeight: '600',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    textDecoration: 'underline'
                  }}
                >
                  {resendLoading ? "Sending..." : "Didn't receive the OTP? Resend OTP"}
                </button>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                  Resend code in <span style={{ fontWeight: '600' }}>{countdown}s</span>
                </p>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <Button 
            label={isLoading ? "Processing..." : "Verify Mobile Number"}
            onClick={verifyMobileOtp}
            loading={isLoading}
            style={{ 
              width: '100%', 
              padding: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}
          />

          {/* Back to Sign Up */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => router.push("/auth/signup")}
              style={{
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                textDecoration: 'underline'
              }}
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

 // ✅ Wrap in Suspense to fix useSearchParams() build error
    export default function Page() {
      return (
        <Suspense fallback={<div>Loading verification page...</div>}>
          <MobileOtpPage />
        </Suspense>
      );
  }