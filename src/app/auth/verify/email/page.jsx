"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import axios from "axios";

// ✅ Your main OTP page component
function EmailOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useRef(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Get email from URL parameters (passed from signup page)
  const emailFromSignup = searchParams.get("email");
  const [email, setEmail] = useState(emailFromSignup || "maverickcodes54@gmail.com");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

  // ✅ Automatically send Email OTP when page loads
  useEffect(() => {
    if (email) {
      sendEmailOtpAutomatically();
    }
  }, [email]);

  const sendEmailOtpAutomatically = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/otp/email/send`, {
        email: email,
      });

      if (res.data.success) {
        toast.current.show({
          severity: "success",
          summary: "OTP Sent",
          detail: "6-digit verification code sent to your email",
          life: 3000,
        });
        setCountdown(60);
        setCanResend(false);
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Failed to Send OTP",
        detail: "Please try again",
        life: 3000,
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

  // ✅ Verify Email OTP
  const verifyEmailOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.current.show({
        severity: "warn",
        summary: "Incomplete OTP",
        detail: "Please enter all 6 digits",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/otp/email/verify`, {
        email: email,
        otp: enteredOtp,
      });

      setMessage(res.data.message);

      if (res.data.success) {
        toast.current.show({
          severity: "success",
          summary: "Email Verified!",
          detail: "Your account has been created successfully",
          life: 2000,
        });

        // Redirect to login after success
        setTimeout(() => router.push("/auth/login"), 1500);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Verification Failed",
          detail: "Invalid OTP code",
          life: 3000,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "❌ Error verifying Email OTP.";
      setMessage(errorMessage);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend Email OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/otp/email/send`, {
        email: email,
      });

      if (res.data.success) {
        toast.current.show({
          severity: "success",
          summary: "OTP Sent",
          detail: "New verification code sent to your email",
          life: 3000,
        });

        setCountdown(30);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failed to Send",
          detail: res.data.message || "Failed to send OTP",
          life: 3000,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "❌ Error sending OTP.";
      setMessage(errorMessage);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
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
    <div className="text-center" style={{ padding: "2rem 0 1rem 0" }}>
      <div
        style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#dbeafe",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem auto",
        }}
      >
        <span style={{ fontSize: "2rem", color: "#2563eb" }}>✉️</span>
      </div>
      <h1
        style={{
          color: "#2563eb",
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "0.5rem",
        }}
      >
        Verify Email Address
      </h1>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: "1rem",
        margin: 0,
      }}
    >
      <Toast ref={toast} />

      <Card
        header={header}
        style={{
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          border: "none",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ padding: "0 2rem 2rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <p style={{ color: "#6b7280", fontSize: "1rem", marginBottom: "1.5rem" }}>
              We sent a 6-digit OTP to:
            </p>

            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  color: "#1f2937",
                  margin: 0,
                  fontWeight: "600",
                  fontSize: "1.1rem",
                }}
              >
                {email}
              </p>
            </div>

            <p style={{ color: "#6b7280", fontSize: "1rem", marginBottom: "0.5rem" }}>
              Enter the OTP below to verify your email address
            </p>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              Check your inbox and spam folder
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                color: "#374151",
                fontWeight: "600",
                marginBottom: "1rem",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Enter Verification Code
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: "50px",
                    height: "60px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              ))}
            </div>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  style={{
                    color: "#2563eb",
                    fontWeight: "600",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    textDecoration: "underline",
                  }}
                >
                  {resendLoading ? "Sending..." : "Didn't receive the OTP? Resend OTP"}
                </button>
              ) : (
                <p style={{ color: "#6b7280", fontSize: "1rem" }}>
                  Resend code in <span style={{ fontWeight: "600" }}>{countdown}s</span>
                </p>
              )}
            </div>
          </div>

          {message && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                padding: "0.5rem",
                borderRadius: "4px",
                backgroundColor: message.includes("❌") ? "#fef2f2" : "#f0f9ff",
                border: `1px solid ${message.includes("❌") ? "#fecaca" : "#bae6fd"}`,
              }}
            >
              <p
                style={{
                  color: message.includes("❌") ? "#dc2626" : "#0369a1",
                  margin: 0,
                  fontSize: "0.9rem",
                }}
              >
                {message}
              </p>
            </div>
          )}

          <Button
            label={isLoading ? "Verifying..." : "Verify Email & Complete Signup"}
            onClick={verifyEmailOtp}
            loading={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: "#10b981",
              border: "none",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => router.push("/auth/verify/mobile")}
              style={{
                color: "#6b7280",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                display: "block",
                width: "100%",
              }}
            >
              ← Back to mobile verification
            </button>

            <button
              onClick={() => router.push("/auth/signup")}
              style={{
                color: "#6b7280",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                textDecoration: "underline",
              }}
            >
              Back to Sign Up
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
      <EmailOtpPage />
    </Suspense>
  );
}
