"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import axios from "axios"; 
import { setToken } from "@/app/lib/tokenService";

export default function LoginPage() {
  const router = useRouter();
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

// Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8081/actuator/health');
      if (response.ok) {
        console.log(' Backend is running on port 8081');
      }
    } catch (error) {
      console.error(' Backend is not accessible');
      setError('Backend server is not running. Please start your Spring Boot application.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

// handle submit 
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axios.post("http://localhost:8081/api/auth/login",
      {
        username: formData.username,
        password: formData.password,
      }
      // {
      //   headers: { "Content-Type": "application/json" },
      // }
    );

    // console.log("✅ Login successful:", response.data);

    // Extract values from backend response
    const { token, username, role } = response.data;

    // ✅ Save token & user details to localStorage
      // localStorage.setItem("jwtToken", response.data.token);
      // localStorage.setItem("user", JSON.stringify({
      //   username: response.data.username,
      //   role: response.data.role
      // }));

 // ✅ Store in sessionStorage via tokenService
    setToken(token, { username, role });

    // notify
    toast.current.show({
      severity: "success",
      summary: "Login Successful",
      detail: `Welcome back, ${username}!`,
      life: 2500,
    });

    // redirect after delay
    setTimeout(() => {router.push("/"); }, 1200); // redirect to home page instead of "/"
  } catch (err) {
    console.error("❌ Login error:", err);
    let errorMessage = "Login failed. Please check your credentials.";

    if (err.response?.status === 401) {
      errorMessage = "Invalid username or password.";
    } else if (err.response?.data) {
      errorMessage = err.response.data;
    }

    setError(errorMessage);

    toast.current.show({
      severity: "error",
      summary: "Login Failed",
      detail: errorMessage,
      life: 3000,
    });
  } finally {
    setLoading(false);
  }
};



// Test with existing user credentials
  const fillTestCredentials = () => {
    setFormData({
      username: "testuser",
      password: "password123"
    });
    setError("");
    toast.current.show({
      severity: 'info',
      summary: 'Test Credentials',
      detail: 'Using testuser/password123. Make sure this user exists in database.',
      life: 4000
    });
  };

  const header = (
    <div className="text-center" style={{ padding: '1rem 0 1rem 0' }}>
      <h1 style={{ 
        color: '#2563eb', 
        fontSize: '2.5rem', 
        fontWeight: '700', 
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Welcome Back
      </h1>
      <p style={{ color: "green", fontSize: '1.1rem' }}>
        Sign in to your CarGo account
      </p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      backgroundColor: '#f8fafc'
    }}>
      <Toast ref={toast} />
      
      {/* Left Column - Login Form */}
      <div style={{ 
        width: '50%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2rem',
        backgroundColor: '#f8fafc'
      }}>
        <Card header={header} style={{ 
          width: '100%', 
          maxWidth: '450px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: 'none',
          borderRadius: '12px',
          backgroundColor: '#ffffff'
        }}>
          {/* Test Credentials Button */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={fillTestCredentials}
              style={{
                color: '#2563eb',
                background: 'none',
                border: '1px solid #2563eb',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Fill Test Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" style={{ 
                display: 'block', 
                color: '#374151', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                Username *
              </label>
              <InputText
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                style={{ 
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ 
                display: 'block', color: '#374151', fontWeight: '600', 
                marginBottom: '0.5rem',fontSize: '0.95rem'
              }}>
                Password *
              </label>
              <Password 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{ width: '100%' }}
                inputStyle={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px',
                  border: '2px solid #e5e7eb', fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#ffffff'
                }}
                panelStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e5e7eb'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                toggleMask 
                feedback={false} 
                required 
              />
            </div>

            {/* Error Display */}
            {error && (
              <div style={{ 
                padding: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#dc2626', margin: 0, fontSize: '0.9rem' }}>
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  inputId="rememberMe" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="rememberMe" style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Remember me
                </label>
              </div>
              <button
                type="button"
                style={{ 
                  color: '#2563eb', fontSize: '0.9rem', fontWeight: '600',
                  background: 'none', border: 'none',cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onClick={() => router.push("/auth/forgot-password")}>
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button 
              label={loading ? "Signing In..." : "Sign In"} 
              disabled={loading} 
              type="submit" 
              style={{ 
                width: '100%', padding: '12px', fontSize: '1.1rem', fontWeight: '600',
                backgroundColor: '#2563eb', border: 'none', borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                  e.target.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
            />

            {/* Signup Link */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Don't have an account?{" "}
              </span>
              <button
                type="button"
                style={{ 
                  color: '#2563eb', fontWeight: '600', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: '0.95rem', textDecoration: 'underline'
                }}
                onClick={() => router.push("/auth/register")}>
                Create account
              </button>
            </div>

            <Divider align="center">
              <span style={{ color: '#9ca3af', fontWeight: '500', backgroundColor: '#ffffff', padding: '0 1rem' }}>
                Or continue with
              </span>
            </Divider>

            {/* Social Logins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button
                icon="pi pi-google"
                label="Continue with Google"
                style={{ 
                  width: '100%',
                  padding: '10px', 
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px', 
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#374151';
                }}
              />
            </div>
          </form>
        </Card>
      </div>

      {/* Right Column - Banner */}
      <div style={{ 
        width: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '3rem',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}>
        <div style={{ 
          textAlign: 'center', 
          width: '100%',
          maxWidth: '500px'
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem',
            color: '#2563eb',
            lineHeight: '1.2'
          }}>
            Drive Your Earnings
          </h2>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: "green",
            marginBottom: '1rem',
            lineHeight: '1.6'
          }}>
            Join thousands of hosts earning with CarGo.<br />
            Turn your vehicle into passive income.
          </p>

          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <img 
              src="/earnings/earnings1.jpg"
              alt="Car Rental Benefits"
              style={{ 
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: '12px',
              }}
              onError={(e) => {
                e.target.src = 'https://img.freepik.com/free-vector/carsharing-service-abstract-concept-illustration-rental-service-short-term-rent-carsharing-application-ride-application-hiring-car-peer-peer-hourly-payment_335657-379.jpg';
              }}
            />
          </div>

          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ 
              fontSize: '0.95rem',
              margin: 0,
              fontStyle: 'italic'
            }}>
              "Earn up to $500/month by sharing your vehicle with trusted travelers"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}