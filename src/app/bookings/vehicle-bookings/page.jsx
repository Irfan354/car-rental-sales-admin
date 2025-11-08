"use client";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export default function VehicleBookings() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingId: "BK20240115001",
      customer: "John Doe",
      customerPhone: "+1-555-0123",
      vehicle: "Toyota Camry",
      model: "2023 SE",
      regNumber: "ABC123",
      vin: "1HGCM82633A123456",
      pickupDate: "2024-01-15",
      returnDate: "2024-01-20",
      pickupLocation: "Downtown Branch",
      returnLocation: "Airport Branch",
      status: "Confirmed",
      totalAmount: "$350",
      paymentStatus: "Paid",
      bookingDate: "2024-01-10"
    },
    {
      id: 2,
      bookingId: "BK20240116002",
      customer: "Jane Smith",
      customerPhone: "+1-555-0456",
      vehicle: "Honda Civic",
      model: "2024 LX",
      regNumber: "XYZ789",
      vin: "2HGFG21598H765432",
      pickupDate: "2024-01-16",
      returnDate: "2024-01-18",
      pickupLocation: "Airport Branch",
      returnLocation: "Airport Branch",
      status: "Pending",
      totalAmount: "$220",
      paymentStatus: "Pending",
      bookingDate: "2024-01-11"
    },
    {
      id: 3,
      bookingId: "BK20240117003",
      customer: "Mike Johnson",
      customerPhone: "+1-555-0789",
      vehicle: "Ford F-150",
      model: "2023 XLT",
      regNumber: "TRK456",
      vin: "1FTFW1ET0PFA98765",
      pickupDate: "2024-01-17",
      returnDate: "2024-01-22",
      pickupLocation: "City Center",
      returnLocation: "Downtown Branch",
      status: "Active",
      totalAmount: "$480",
      paymentStatus: "Paid",
      bookingDate: "2024-01-12"
    },
    {
      id: 4,
      bookingId: "BK20240118004",
      customer: "Sarah Wilson",
      customerPhone: "+1-555-0321",
      vehicle: "BMW X5",
      model: "2024 xDrive40i",
      regNumber: "BMW007",
      vin: "5UXCR6C06P9A12345",
      pickupDate: "2024-01-18",
      returnDate: "2024-01-25",
      pickupLocation: "Downtown Branch",
      returnLocation: "Downtown Branch",
      status: "Cancelled",
      totalAmount: "$700",
      paymentStatus: "Refunded",
      bookingDate: "2024-01-13"
    }
  ]);

  const [form, setForm] = useState({ 
    bookingId: "",
    customer: "",
    customerPhone: "",
    vehicle: "",
    model: "",
    regNumber: "",
    vin: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    returnLocation: "",
    status: "Pending",
    totalAmount: "",
    paymentStatus: "Pending",
    bookingDate: ""
  });
  
  const [editingBooking, setEditingBooking] = useState(null);

  // Available options for dropdowns
  const statusOptions = ["Pending", "Confirmed", "Active", "Completed", "Cancelled"];
  const paymentStatusOptions = ["Pending", "Paid", "Refunded"];
  const vehicleOptions = ["Toyota Camry", "Honda Civic", "Ford F-150", "BMW X5", "Tesla Model 3"];
  const locationOptions = ["Downtown Branch", "Airport Branch", "City Center", "Mall Location"];

  // Stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;
  const activeBookings = bookings.filter((b) => b.status === "Active").length;
  const completedBookings = bookings.filter((b) => b.status === "Completed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;

  // Add booking
  const handleAddBooking = () => {
    if (!form.customer.trim() || !form.vehicle.trim() || !form.pickupDate.trim()) {
      alert("Customer, vehicle, and pickup date are required!");
      return;
    }
    
    // Generate booking ID
    const newBookingId = `BK${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(bookings.length + 1).padStart(3, '0')}`;
    
    setBookings([...bookings, { 
      id: bookings.length + 1, 
      bookingId: newBookingId,
      ...form 
    }]);
    
    setForm({ 
      bookingId: "",
      customer: "",
      customerPhone: "",
      vehicle: "",
      model: "",
      regNumber: "",
      vin: "",
      pickupDate: "",
      returnDate: "",
      pickupLocation: "",
      returnLocation: "",
      status: "Pending",
      totalAmount: "",
      paymentStatus: "Pending",
      bookingDate: ""
    });
    setVisible(false);
  };

  // Edit booking
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setForm({ ...booking });
    setEditVisible(true);
  };

  // Save edited booking
  const handleSaveEdit = () => {
    if (!form.customer.trim() || !form.vehicle.trim() || !form.pickupDate.trim()) {
      alert("Customer, vehicle, and pickup date are required!");
      return;
    }
    
    const updatedBookings = bookings.map(booking => 
      booking.id === editingBooking.id ? { ...form } : booking
    );
    
    setBookings(updatedBookings);
    setEditVisible(false);
    setForm({ 
      bookingId: "",
      customer: "",
      customerPhone: "",
      vehicle: "",
      model: "",
      regNumber: "",
      vin: "",
      pickupDate: "",
      returnDate: "",
      pickupLocation: "",
      returnLocation: "",
      status: "Pending",
      totalAmount: "",
      paymentStatus: "Pending",
      bookingDate: ""
    });
    setEditingBooking(null);
  };

  // Handle vehicle selection - auto-populate model
  const handleVehicleChange = (selectedVehicle) => {
    const vehicleModels = {
      "Toyota Camry": "2023 SE",
      "Honda Civic": "2024 LX", 
      "Ford F-150": "2023 XLT",
      "BMW X5": "2024 xDrive40i",
      "Tesla Model 3": "2024 Standard"
    };
    
    setForm({
      ...form,
      vehicle: selectedVehicle,
      model: vehicleModels[selectedVehicle] || ""
    });
  };

  // Templates
  const statusBody = (row) => (
    <Tag 
      severity={
        row.status === "Confirmed" ? "success" :
        row.status === "Active" ? "info" :
        row.status === "Pending" ? "warning" :
        row.status === "Completed" ? "help" : "danger"
      } 
      value={row.status} 
    />
  );

  const paymentStatusBody = (row) => (
    <Tag 
      severity={
        row.paymentStatus === "Paid" ? "success" :
        row.paymentStatus === "Pending" ? "warning" : "info"
      } 
      value={row.paymentStatus} 
    />
  );

  const actionBody = (row) => (
    <Button 
      icon="pi pi-pencil" 
      rounded 
      text 
      onClick={() => handleEditBooking(row)} 
      tooltip="Edit" 
    />
  );

  return (
    <div className="p-fluid p-3">
      {/* Header */}
      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'black', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Home &gt; Bookings &gt; Vehicle Bookings
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Vehicle Bookings
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage vehicle rental bookings and reservations
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Total: ${totalBookings}`} severity="info" />
              <Tag value={`Pending: ${pendingBookings}`} severity="warning" />
              <Tag value={`Confirmed: ${confirmedBookings}`} severity="success" />
              <Tag value={`Active: ${activeBookings}`} severity="help" />
              <Tag value={`Completed: ${completedBookings}`} severity="secondary" />
              <Tag value={`Cancelled: ${cancelledBookings}`} severity="danger" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add Booking"
              className="p-button-primary"
              onClick={() => setVisible(true)}
              style={{ whiteSpace: 'nowrap' }}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ marginTop: '1.5rem' }}>
        <DataTable 
          value={bookings} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No bookings found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="bookingId" header="Booking ID" />
          <Column field="customer" header="Customer" />
          <Column field="vehicle" header="Vehicle" />
          <Column field="regNumber" header="Reg Number" />
          <Column field="pickupDate" header="Pickup Date" />
          <Column field="returnDate" header="Return Date" />
          <Column body={statusBody} header="Status" />
          <Column field="totalAmount" header="Amount" />
          <Column body={paymentStatusBody} header="Payment" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add Booking Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Booking"
        style={{ width: '500px' , color:'green'}}
      >
        <div className="p-fluid" style={{color:'black'}}>
          <div className="p-field">
            <label htmlFor="customer">Customer Name</label>
            <InputText
              id="customer"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              placeholder="Enter customer name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="customerPhone">Customer Phone</label>
            <InputText
              id="customerPhone"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div className="p-field">
            <label htmlFor="vehicle">Vehicle</label>
            <Dropdown
              id="vehicle"
              value={form.vehicle}
              options={vehicleOptions}
              onChange={(e) => handleVehicleChange(e.value)}
              placeholder="Select a vehicle"
            />
          </div>
          <div className="p-field">
            <label htmlFor="model">Model</label>
            <InputText
              id="model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Auto-filled"
              disabled
            />
          </div>
          <div className="p-field">
            <label htmlFor="regNumber">Registration Number</label>
            <InputText
              id="regNumber"
              value={form.regNumber}
              onChange={(e) => setForm({ ...form, regNumber: e.target.value.toUpperCase() })}
              placeholder="e.g., ABC123"
            />
          </div>
          <div className="p-field">
            <label htmlFor="vin">VIN</label>
            <InputText
              id="vin"
              value={form.vin}
              onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })}
              placeholder="Enter VIN number"
            />
          </div>
          <div className="p-field">
            <label htmlFor="pickupDate">Pickup Date</label>
            <InputText
              id="pickupDate"
              type="date"
              value={form.pickupDate}
              onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="returnDate">Return Date</label>
            <InputText
              id="returnDate"
              type="date"
              value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="pickupLocation">Pickup Location</label>
            <Dropdown
              id="pickupLocation"
              value={form.pickupLocation}
              options={locationOptions}
              onChange={(e) => setForm({ ...form, pickupLocation: e.value })}
              placeholder="Select pickup location"
            />
          </div>
          <div className="p-field">
            <label htmlFor="returnLocation">Return Location</label>
            <Dropdown
              id="returnLocation"
              value={form.returnLocation}
              options={locationOptions}
              onChange={(e) => setForm({ ...form, returnLocation: e.value })}
              placeholder="Select return location"
            />
          </div>
          <div className="p-field">
            <label htmlFor="totalAmount">Total Amount</label>
            <InputText
              id="totalAmount"
              value={form.totalAmount}
              onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
              placeholder="e.g., $350"
            />
          </div>
          <div className="p-field">
            <label htmlFor="status">Booking Status</label>
            <Dropdown
              id="status"
              value={form.status}
              options={statusOptions}
              onChange={(e) => setForm({ ...form, status: e.value })}
              placeholder="Select status"
            />
          </div>
          <div className="p-field">
            <label htmlFor="paymentStatus">Payment Status</label>
            <Dropdown
              id="paymentStatus"
              value={form.paymentStatus}
              options={paymentStatusOptions}
              onChange={(e) => setForm({ ...form, paymentStatus: e.value })}
              placeholder="Select payment status"
            />
          </div>
          <Divider />
          <Button 
            label="Save Booking" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddBooking} 
          />
        </div>
      </Sidebar>

      {/* Edit Booking Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit Booking"
        style={{ width: '500px', color:'blue' }}
      >
        <div className="p-fluid" style={{color:'black'}}>
          <div className="p-field">
            <label htmlFor="editCustomer">Customer Name</label>
            <InputText
              id="editCustomer"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              placeholder="Enter customer name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editCustomerPhone">Customer Phone</label>
            <InputText
              id="editCustomerPhone"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editVehicle">Vehicle</label>
            <Dropdown
              id="editVehicle"
              value={form.vehicle}
              options={vehicleOptions}
              onChange={(e) => handleVehicleChange(e.value)}
              placeholder="Select a vehicle"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editModel">Model</label>
            <InputText
              id="editModel"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Auto-filled"
              disabled
            />
          </div>
          <div className="p-field">
            <label htmlFor="editRegNumber">Registration Number</label>
            <InputText
              id="editRegNumber"
              value={form.regNumber}
              onChange={(e) => setForm({ ...form, regNumber: e.target.value.toUpperCase() })}
              placeholder="e.g., ABC123"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editVin">VIN</label>
            <InputText
              id="editVin"
              value={form.vin}
              onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })}
              placeholder="Enter VIN number"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editPickupDate">Pickup Date</label>
            <InputText
              id="editPickupDate"
              type="date"
              value={form.pickupDate}
              onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="editReturnDate">Return Date</label>
            <InputText
              id="editReturnDate"
              type="date"
              value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="editPickupLocation">Pickup Location</label>
            <Dropdown
              id="editPickupLocation"
              value={form.pickupLocation}
              options={locationOptions}
              onChange={(e) => setForm({ ...form, pickupLocation: e.value })}
              placeholder="Select pickup location"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editReturnLocation">Return Location</label>
            <Dropdown
              id="editReturnLocation"
              value={form.returnLocation}
              options={locationOptions}
              onChange={(e) => setForm({ ...form, returnLocation: e.value })}
              placeholder="Select return location"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editTotalAmount">Total Amount</label>
            <InputText
              id="editTotalAmount"
              value={form.totalAmount}
              onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
              placeholder="e.g., $350"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editStatus">Booking Status</label>
            <Dropdown
              id="editStatus"
              value={form.status}
              options={statusOptions}
              onChange={(e) => setForm({ ...form, status: e.value })}
              placeholder="Select status"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editPaymentStatus">Payment Status</label>
            <Dropdown
              id="editPaymentStatus"
              value={form.paymentStatus}
              options={paymentStatusOptions}
              onChange={(e) => setForm({ ...form, paymentStatus: e.value })}
              placeholder="Select payment status"
            />
          </div>
          <Divider />
          <Button
            label="Save Changes"
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleSaveEdit}
          />
        </div>
      </Sidebar>
    </div>
  );
}