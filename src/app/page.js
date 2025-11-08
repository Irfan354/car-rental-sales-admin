"use client";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function Dashboard() {
  const stats = {
    vehicles: 4,
    bookings: 12,
    earnings: 54000,
  };

  const cardFooter = (label) => (
    <Button label={label} className="w-full p-button-primary" />
  );

  return (
    <div className="p-4">
      <div className="grid">
        <div className="col-12 md:col-4">
          <Card 
            title="Total Vehicles" 
            className="text-center shadow-2" 
            footer={cardFooter("Manage")}
          >
            <p className="text-4xl font-bold text-900 m-0">{stats.vehicles}</p>
          </Card>
        </div>
        
        <div className="col-12 md:col-4">
          <Card 
            title="Active Bookings" 
            className="text-center shadow-2" 
            footer={cardFooter("View Bookings")}
          >
            <p className="text-4xl font-bold text-900 m-0">{stats.bookings}</p>
          </Card>
        </div>
        
        <div className="col-12 md:col-4">
          <Card 
            title="Earnings" 
            className="text-center shadow-2" 
            footer={cardFooter("View Earnings")}
          >
            <p className="text-4xl font-bold text-900 m-0">₹{stats.earnings}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}