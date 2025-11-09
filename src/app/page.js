"use client";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
// import { getAuth } from "./utils/auth";
import { getToken, getUser } from "./lib/tokenService";  // adjust import path

export default function Dashboard() {

  // const { token, user } = getAuth();
  const [authData, setAuthData] = useState({ token: null, user: null });

  // jwt token 
  useEffect(() => {
    // ✅ Fetch token & user from sessionStorage
    const token = getToken();
    const user = getUser();

    setAuthData({ token, user });

  // ✅ Debug logs to check values in console
    console.log("🔐 Token from sessionStorage:", token);
    console.log("👤 User from sessionStorage:", user);
  
  if (token) {
    console.log('✅ Token is stored and ready to use');
  } else {
    console.log('❌ No token found in localStorage');
  }
}, []);



  // Mock data
  const stats = {
    vehicles: 4,
    bookings: 12,
    earnings: 54000,
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Earnings (₹)",
        data: [5000, 8000, 12000, 9000, 10000],
        fill: false,
        borderColor: "#8b5cf6",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: "#374151",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { color: "#f3f4f6" },
      },
      y: {
        ticks: { color: "#6b7280" },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  return (
   
    <div className="p-8 flex flex-col gap-8">
 {/* Auth Info Display */}
      {/* <div className="p-4 bg-gray-50 rounded-xl shadow">
        {authData.user ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome, {authData.user.username} 👋
            </h1>
            <p className="text-gray-600 mt-1">Role: {authData.user.role}</p>
            <p className="text-gray-400 mt-1 text-sm">
              Token: {authData.token ? authData.token.substring(0, 25) + "..." : "No token found"}
            </p>
          </>
        ) : (
          <p className="text-gray-600">User not logged in</p>
        )}
      </div> */}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Vehicles" className="text-center shadow-md p-3">
          <p className="text-4xl font-bold">{stats.vehicles}</p>
          <Button label="Manage" className="mt-4 w-full bg-dark-600 border-none" />
        </Card>
        <Card title="Active Bookings" className="text-center shadow-md p-3">
          <p className="text-4xl font-bold">{stats.bookings}</p>
          <Button label="View Bookings" className="mt-4 w-full bg-dark-600 border-none" />
        </Card>
        <Card title="Earnings" className="text-center shadow-md p-3">
          <p className="text-4xl font-bold">₹{stats.earnings}</p>
          <Button label="View Earnings" className="mt-4 w-full bg-dark-600 border-none" />
        </Card>
      </div>
    </div>
    
  );
}
