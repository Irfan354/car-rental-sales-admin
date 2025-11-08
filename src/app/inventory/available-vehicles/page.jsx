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
import { Rating } from "primereact/rating";

export default function AvailableVehicles() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      regNumber: "ABC123",
      vehicle: "Toyota Camry 2023",
      hoster: "Ali Rahman",
      hosterPhone: "+1-555-0123",
      inspectionDate: "2024-01-12",
      inspector: "John Inspector",
      inspectionScore: 4.8,
      status: "Available",
      dailyRate: "$45",
      location: "Downtown",
      vehicleType: "Sedan",
      fuelType: "Petrol",
      mileage: "12,000 km",
      features: ["AC", "Bluetooth", "GPS", "Backup Camera"]
    },
    {
      id: 2,
      regNumber: "SUV456",
      vehicle: "Honda CR-V 2024",
      hoster: "Omar Khalid",
      hosterPhone: "+1-555-0456",
      inspectionDate: "2024-01-14",
      inspector: "Sarah Inspector",
      inspectionScore: 4.9,
      status: "Available",
      dailyRate: "$55",
      location: "Airport Area",
      vehicleType: "SUV",
      fuelType: "Petrol",
      mileage: "8,000 km",
      features: ["AC", "Sunroof", "Leather Seats", "Apple CarPlay"]
    },
    {
      id: 3,
      regNumber: "LUX789",
      vehicle: "Mercedes C-Class 2023",
      hoster: "Sarah Wilson",
      hosterPhone: "+1-555-0789",
      inspectionDate: "2024-01-13",
      inspector: "Mike Inspector",
      inspectionScore: 4.7,
      status: "Rented",
      dailyRate: "$85",
      location: "City Center",
      vehicleType: "Luxury",
      fuelType: "Petrol",
      mileage: "15,000 km",
      features: ["Premium Sound", "Heated Seats", "Navigation", "Parking Assist"]
    },
    {
      id: 4,
      regNumber: "TRK012",
      vehicle: "Ford Ranger 2023",
      hoster: "Mike Johnson",
      hosterPhone: "+1-555-0321",
      inspectionDate: "2024-01-15",
      inspector: "Emily Inspector",
      inspectionScore: 4.6,
      status: "Available",
      dailyRate: "$60",
      location: "Suburban",
      vehicleType: "Truck",
      fuelType: "Diesel",
      mileage: "18,000 km",
      features: ["4x4", "Towing Package", "Bed Liner", "Touchscreen"]
    }
  ]);

  const [form, setForm] = useState({ 
    regNumber: "",
    vehicle: "",
    hoster: "",
    hosterPhone: "",
    inspectionDate: "",
    inspector: "",
    inspectionScore: 4.0,
    status: "Available",
    dailyRate: "",
    location: "",
    vehicleType: "",
    fuelType: "",
    mileage: "",
    features: []
  });
  
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState("");

  // Available options for dropdowns
  const statusOptions = ["Available", "Rented", "Maintenance"];
  const typeOptions = ["Sedan", "SUV", "Truck", "Luxury", "Van"];
  const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const locationOptions = ["Downtown", "Airport Area", "City Center", "Suburban", "Beach Area"];
  const featureOptions = ["AC", "Bluetooth", "GPS", "Backup Camera", "Sunroof", "Leather Seats", "Apple CarPlay", "Android Auto", "Premium Sound", "Heated Seats", "Navigation", "Parking Assist", "4x4", "Towing Package", "Bed Liner", "Touchscreen"];

  // Stats
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === "Available").length;
  const rentedVehicles = vehicles.filter((v) => v.status === "Rented").length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === "Maintenance").length;
  const avgRating = (vehicles.reduce((acc, v) => acc + v.inspectionScore, 0) / vehicles.length).toFixed(1);
  const totalDailyValue = vehicles.filter(v => v.status === "Available").reduce((acc, v) => acc + parseInt(v.dailyRate.replace('$', '')), 0);

  // Add vehicle
  const handleAddVehicle = () => {
    if (!form.regNumber.trim() || !form.vehicle.trim() || !form.hoster.trim()) {
      alert("Registration number, vehicle, and hoster are required!");
      return;
    }
    
    setVehicles([...vehicles, { 
      id: vehicles.length + 1, 
      ...form 
    }]);
    
    setForm({ 
      regNumber: "",
      vehicle: "",
      hoster: "",
      hosterPhone: "",
      inspectionDate: "",
      inspector: "",
      inspectionScore: 4.0,
      status: "Available",
      dailyRate: "",
      location: "",
      vehicleType: "",
      fuelType: "",
      mileage: "",
      features: []
    });
    setVisible(false);
  };

  // Edit vehicle
  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setForm({ ...vehicle });
    setEditVisible(true);
  };

  // Save edited vehicle
  const handleSaveEdit = () => {
    if (!form.regNumber.trim() || !form.vehicle.trim() || !form.hoster.trim()) {
      alert("Registration number, vehicle, and hoster are required!");
      return;
    }
    
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === editingVehicle.id ? { ...form } : vehicle
    );
    
    setVehicles(updatedVehicles);
    setEditVisible(false);
    setForm({ 
      regNumber: "",
      vehicle: "",
      hoster: "",
      hosterPhone: "",
      inspectionDate: "",
      inspector: "",
      inspectionScore: 4.0,
      status: "Available",
      dailyRate: "",
      location: "",
      vehicleType: "",
      fuelType: "",
      mileage: "",
      features: []
    });
    setEditingVehicle(null);
  };

  // Add feature to features array
  const handleAddFeature = () => {
    if (selectedFeature && !form.features.includes(selectedFeature)) {
      setForm({
        ...form,
        features: [...form.features, selectedFeature]
      });
      setSelectedFeature("");
    }
  };

  // Remove feature from features array
  const handleRemoveFeature = (featureToRemove) => {
    setForm({
      ...form,
      features: form.features.filter(feature => feature !== featureToRemove)
    });
  };

  // Templates
  const statusBody = (row) => (
    <Tag 
      severity={
        row.status === "Available" ? "success" :
        row.status === "Rented" ? "info" : "warning"
      } 
      value={row.status} 
    />
  );

  const scoreBody = (row) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Rating value={row.inspectionScore} readOnly cancel={false} />
      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>({row.inspectionScore})</span>
    </div>
  );

  const typeBody = (row) => (
    <Tag value={row.vehicleType} severity="info" />
  );

  const actionBody = (row) => (
    <Button 
      icon="pi pi-pencil" 
      rounded 
      text 
      onClick={() => handleEditVehicle(row)} 
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
              Home &gt; Admin &gt; Available Vehicles
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Available Vehicles
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage vehicle inventory and availability
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Total: ${totalVehicles}`} severity="info" />
              <Tag value={`Available: ${availableVehicles}`} severity="success" />
              <Tag value={`Rented: ${rentedVehicles}`} severity="help" />
              <Tag value={`Maintenance: ${maintenanceVehicles}`} severity="warning" />
              <Tag value={`Avg Rating: ${avgRating}`} severity="secondary" />
              <Tag value={`Daily Value: $${totalDailyValue}`} severity="success" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add Vehicle"
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
          value={vehicles} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No vehicles found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="regNumber" header="Reg Number" />
          <Column field="vehicle" header="Vehicle" />
          <Column field="vehicleType" header="Type" body={typeBody} />
          <Column field="hoster" header="Hoster" />
          <Column field="dailyRate" header="Daily Rate" />
          <Column body={scoreBody} header="Inspection Score" />
          <Column field="inspectionDate" header="Inspected On" />
          <Column body={statusBody} header="Status" />
          <Column field="location" header="Location" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add Vehicle Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Vehicle"
        style={{ width: '500px', color:'green' }}
      >
        <div className="p-fluid" style={{color:'black'}}>
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
            <label htmlFor="vehicle">Vehicle Model</label>
            <InputText
              id="vehicle"
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              placeholder="e.g., Toyota Camry 2023"
            />
          </div>
          <div className="p-field">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <Dropdown
              id="vehicleType"
              value={form.vehicleType}
              options={typeOptions}
              onChange={(e) => setForm({ ...form, vehicleType: e.value })}
              placeholder="Select vehicle type"
            />
          </div>
          <div className="p-field">
            <label htmlFor="hoster">Hoster Name</label>
            <InputText
              id="hoster"
              value={form.hoster}
              onChange={(e) => setForm({ ...form, hoster: e.target.value })}
              placeholder="Enter hoster name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="hosterPhone">Hoster Phone</label>
            <InputText
              id="hosterPhone"
              value={form.hosterPhone}
              onChange={(e) => setForm({ ...form, hosterPhone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div className="p-field">
            <label htmlFor="dailyRate">Daily Rate</label>
            <InputText
              id="dailyRate"
              value={form.dailyRate}
              onChange={(e) => setForm({ ...form, dailyRate: e.target.value })}
              placeholder="e.g., $45"
            />
          </div>
          <div className="p-field">
            <label htmlFor="location">Location</label>
            <Dropdown
              id="location"
              value={form.location}
              options={locationOptions}
              onChange={(e) => setForm({ ...form, location: e.value })}
              placeholder="Select location"
            />
          </div>
          <div className="p-field">
            <label htmlFor="fuelType">Fuel Type</label>
            <Dropdown
              id="fuelType"
              value={form.fuelType}
              options={fuelOptions}
              onChange={(e) => setForm({ ...form, fuelType: e.value })}
              placeholder="Select fuel type"
            />
          </div>
          <div className="p-field">
            <label htmlFor="mileage">Mileage</label>
            <InputText
              id="mileage"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              placeholder="e.g., 12,000 km"
            />
          </div>
          <div className="p-field">
            <label htmlFor="inspectionScore">Inspection Score</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Rating 
                value={form.inspectionScore} 
                onChange={(e) => setForm({ ...form, inspectionScore: e.value })} 
                cancel={false} 
              />
              <span>({form.inspectionScore})</span>
            </div>
          </div>
          <div className="p-field">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              value={form.status}
              options={statusOptions}
              onChange={(e) => setForm({ ...form, status: e.value })}
              placeholder="Select status"
            />
          </div>
          <div className="p-field">
            <label>Features</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Dropdown
                value={selectedFeature}
                options={featureOptions}
                onChange={(e) => setSelectedFeature(e.value)}
                placeholder="Select feature"
                style={{ flex: 1 }}
              />
              <Button 
                icon="pi pi-plus" 
                className="p-button-outlined"
                onClick={handleAddFeature}
                disabled={!selectedFeature}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {form.features.map((feature, index) => (
                <Tag 
                  key={index} 
                  value={feature} 
                  severity="info" 
                  style={{ marginBottom: '0.25rem' }}
                  removable 
                  onRemove={() => handleRemoveFeature(feature)}
                />
              ))}
            </div>
          </div>
          <Divider />
          <Button 
            label="Save Vehicle" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddVehicle} 
          />
        </div>
      </Sidebar>

      {/* Edit Vehicle Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit Vehicle"
        style={{ width: '500px' , color:'blue'}}
      >
        <div className="p-fluid" style={{color:'black'}} >
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
            <label htmlFor="editVehicle">Vehicle Model</label>
            <InputText
              id="editVehicle"
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              placeholder="e.g., Toyota Camry 2023"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editVehicleType">Vehicle Type</label>
            <Dropdown
              id="editVehicleType"
              value={form.vehicleType}
              options={typeOptions}
              onChange={(e) => setForm({ ...form, vehicleType: e.value })}
              placeholder="Select vehicle type"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editHoster">Hoster Name</label>
            <InputText
              id="editHoster"
              value={form.hoster}
              onChange={(e) => setForm({ ...form, hoster: e.target.value })}
              placeholder="Enter hoster name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editHosterPhone">Hoster Phone</label>
            <InputText
              id="editHosterPhone"
              value={form.hosterPhone}
              onChange={(e) => setForm({ ...form, hosterPhone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editDailyRate">Daily Rate</label>
            <InputText
              id="editDailyRate"
              value={form.dailyRate}
              onChange={(e) => setForm({ ...form, dailyRate: e.target.value })}
              placeholder="e.g., $45"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editLocation">Location</label>
            <Dropdown
              id="editLocation"
              value={form.location}
              options={locationOptions}
              onChange={(e) => setForm({ ...form, location: e.value })}
              placeholder="Select location"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editFuelType">Fuel Type</label>
            <Dropdown
              id="editFuelType"
              value={form.fuelType}
              options={fuelOptions}
              onChange={(e) => setForm({ ...form, fuelType: e.value })}
              placeholder="Select fuel type"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editMileage">Mileage</label>
            <InputText
              id="editMileage"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              placeholder="e.g., 12,000 km"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editInspectionScore">Inspection Score</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Rating 
                value={form.inspectionScore} 
                onChange={(e) => setForm({ ...form, inspectionScore: e.value })} 
                cancel={false} 
              />
              <span>({form.inspectionScore})</span>
            </div>
          </div>
          <div className="p-field">
            <label htmlFor="editStatus">Status</label>
            <Dropdown
              id="editStatus"
              value={form.status}
              options={statusOptions}
              onChange={(e) => setForm({ ...form, status: e.value })}
              placeholder="Select status"
            />
          </div>
          <div className="p-field">
            <label>Features</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Dropdown
                value={selectedFeature}
                options={featureOptions}
                onChange={(e) => setSelectedFeature(e.value)}
                placeholder="Select feature"
                style={{ flex: 1 }}
              />
              <Button 
                icon="pi pi-plus" 
                className="p-button-outlined"
                onClick={handleAddFeature}
                disabled={!selectedFeature}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {form.features.map((feature, index) => (
                <Tag 
                  key={index} 
                  value={feature} 
                  severity="info" 
                  style={{ marginBottom: '0.25rem' }}
                  removable 
                  onRemove={() => handleRemoveFeature(feature)}
                />
              ))}
            </div>
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