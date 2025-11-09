"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { registerUser } from "@/app/lib/authService";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: ""
  });

 const states = [
  { label: "Andhra Pradesh", value: "AP" },
  { label: "Arunachal Pradesh", value: "AR" },
  { label: "Assam", value: "AS" },
  { label: "Bihar", value: "BR" },
  { label: "Chhattisgarh", value: "CG" },
  { label: "Goa", value: "GA" },
  { label: "Gujarat", value: "GJ" },
  { label: "Haryana", value: "HR" },
  { label: "Karnataka", value: "KA" },
  { label: "Kerala", value: "KL" },
  { label: "Madhya Pradesh", value: "MP" },
  { label: "Maharashtra", value: "MH" },
  { label: "Punjab", value: "PB" },
  { label: "Rajasthan", value: "RJ" },
  { label: "Tamil Nadu", value: "TN" },
  { label: "Telangana", value: "TG" },
  { label: "Uttar Pradesh", value: "UP" },

];

// city data
const cities = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Delhi", value: "delhi" },
  { label: "Bengaluru", value: "bengaluru" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Chennai", value: "chennai" },
  { label: "Kolkata", value: "kolkata" },
  { label: "Pune", value: "pune" },
  { label: "Ahmedabad", value: "ahmedabad" },
  { label: "Jaipur", value: "jaipur" },
  { label: "Lucknow", value: "lucknow" }
  // … and thousands more
];

// handle input change
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

 // ✅ handle form submission
  const handleProceed = async (e) => {
  e.preventDefault();

  const payload = {
    username: formData.firstName + " " + formData.lastName,
    email: formData.email,
    mobile : formData.mobile,
    password: formData.password,
    role: "CUSTOMER"
  };

  try {
    const response = await registerUser(payload);
      console.log("Registration success:", response.data);
      alert("User registered successfully!");
      router.push(`/auth/verify/mobile?...`);
  } catch (error) {
      console.error(" Registration failed:", error);
      alert("Something went wrong while registering");
  }
};




  const header = (
    <div className="text-center" style={{ padding: '2rem 0 1rem 0' }}>
      <h1 style={{ 
        color: '#2563eb', 
        fontSize: '2.5rem', 
        fontWeight: '700', 
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Create Account
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
        Join CarGo and start your journey
      </p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      backgroundColor: '#f8fafc',
      margin: 0,
      border: 0
    }}>
      {/* Left Column - Signup Form */}
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
          maxWidth: '500px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: 'none',
          borderRadius: '12px',
          backgroundColor: '#ffffff'
        }}>
          {/* ✅ Remove onSubmit from form and use onClick on button only */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Name Row */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* First Name */}
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem'
                }}>
                  First Name
                </label>
                <InputText
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="First Name"
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
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} required />
              </div>

              {/* Last Name */}
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem'
                }}>
                  Last Name
                </label>
                <InputText
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Last Name"
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
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ 
                display: 'block', 
                color: '#374151', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                Email
              </label>
              <InputText
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email Address"
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
                type="email"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label style={{ 
                display: 'block', 
                color: '#374151', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                Mobile
              </label>
              <InputText
                value={formData.mobile}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                placeholder="Mobile Number"
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
                  type="tel"
                  required
                />
              </div>

              {/* Password Row */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Password */}
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    color: '#374151', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem'
                  }}>
                    Password
                  </label>
                  <Password
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Password"
                    style={{ width: '100%' }}
                    inputStyle={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
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

                {/* Confirm Password */}
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    color: '#374151', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem'
                  }}>
                    Confirm Password
                  </label>
                  <Password
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Confirm Password"
                    style={{ width: '100%' }}
                    inputStyle={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
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
              </div>

              {/* Full Address */}
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem'
                }}>
                  Full Address
                </label>
                <InputText
                  value={formData.fullAddress}
                  onChange={(e) => handleChange('fullAddress', e.target.value)}
                  placeholder="Full Address"
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

              {/* City, State, Pincode Row */}
              <div style={{ display: 'flex', gap: '1rem' }}>
              {/* City */}
<div style={{ flex: 1 }}>
  <label
    style={{
      display: "block",
      color: "#374151",
      fontWeight: "600",
      marginBottom: "0.5rem",
      fontSize: "0.95rem", }}>
    City
  </label>
  <Dropdown
    value={formData.city}
    onChange={(e) => handleChange("city", e.value)}
    options={cities}
    placeholder="Select City"
    style={{
      width: "100%",
    }}
    panelStyle={{
      backgroundColor: "#ffffff",
      border: "2px solid #e5e7eb",
    }}
    required
  />
</div>

{/* State */}
<div style={{ flex: 1 }}>
  <label
    style={{
      display: "block",
      color: "#374151",
      fontWeight: "600",
      marginBottom: "0.5rem",
      fontSize: "0.95rem",
    }}
  >
    State
  </label>
  <Dropdown
    value={formData.state}
    onChange={(e) => handleChange("state", e.value)}
    options={states}
    placeholder="Select State"
    style={{
      width: "100%",
    }}
    panelStyle={{
      backgroundColor: "#ffffff",
      border: "2px solid #e5e7eb",
    }}
    required
  />
</div>


                {/* Pincode */}
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    color: '#374151', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem'
                  }}>
                    Pincode
                  </label>
                  <InputText
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    placeholder="Pincode"
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
              </div>

              {/* ✅ FIXED: Register Button - Remove type="submit" and use onClick only */}
              <Button 
                label="Proceed" 
                onClick={handleProceed} // Use the new function
                style={{ 
                  width: '100%', 
                  padding: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                  e.target.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  e.target.style.backgroundColor = '#2563eb';
                }}
              />

              {/* Login Link */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  style={{ 
                    color: '#2563eb', 
                    fontWeight: '600',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    textDecoration: 'underline'
                  }}
                  onClick={() => router.push("/auth/login")}
                >
                  Login here
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column - Banner (unchanged) */}
        <div style={{ 
          width: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1rem',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}>
          <div style={{ 
            textAlign: 'center', 
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ 
              fontSize: '2.8rem', 
              fontWeight: '700', 
              marginBottom: '3rem',
              color: '#2563eb',
              lineHeight: '1.2'
            }}>
              Start Your Journey
            </h2>
            
            <p style={{ 
              fontSize: '1.3rem', 
              color: '#4b5563',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Join thousands of users who trust CarGo<br />
              for their transportation needs.
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
                  objectFit: 'cover'
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
                "Get 20% off your first ride when you sign up today!"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }