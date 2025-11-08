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
import { Calendar } from "primereact/calendar";

export default function PendingVehicles() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      regNumber: "XYZ789",
      vehicle: "Honda Civic 2024",
      hoster: "Sarah Ahmed",
      hosterPhone: "+1-555-0456",
      submittedDate: "2024-01-15",
      inspectionStatus: "Pending",
      location: "Downtown",
      vehicleType: "Sedan",
      fuelType: "Petrol",
      mileage: "15,000 km"
    },
    {
      id: 2,
      regNumber: "TRK456",
      vehicle: "Ford F-150 2023",
      hoster: "Mike Johnson",
      hosterPhone: "+1-555-0789",
      submittedDate: "2024-01-16",
      inspectionStatus: "Scheduled",
      inspectionDate: "2024-01-18",
      location: "City Center",
      vehicleType: "Truck",
      fuelType: "Diesel",
      mileage: "25,000 km"
    },
    {
      id: 3,
      regNumber: "BMW007",
      vehicle: "BMW X5 2024",
      hoster: "David Wilson",
      hosterPhone: "+1-555-0321",
      submittedDate: "2024-01-17",
      inspectionStatus: "In Progress",
      inspector: "John Inspector",
      location: "Airport Area",
      vehicleType: "SUV",
      fuelType: "Petrol",
      mileage: "8,000 km"
    },
    {
      id: 4,
      regNumber: "NIS123",
      vehicle: "Nissan Altima 2023",
      hoster: "Lisa Brown",
      hosterPhone: "+1-555-0987",
      submittedDate: "2024-01-18",
      inspectionStatus: "Re-inspection",
      previousStatus: "Failed - Tire issues",
      location: "Suburban",
      vehicleType: "Sedan",
      fuelType: "Petrol",
      mileage: "20,000 km"
    }
  ]);

  const [form, setForm] = useState({ 
    regNumber: "",
    vehicle: "",
    hoster: "",
    hosterPhone: "",
    submittedDate: "",
    inspectionStatus: "Pending",
    inspectionDate: "",
    inspector: "",
    location: "",
    vehicleType: "",
    fuelType: "",
    mileage: "",
    previousStatus: ""
  });
  
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Available options for dropdowns
  const statusOptions = ["Pending", "Scheduled", "In Progress", "Re-inspection"];
  const typeOptions = ["Sedan", "SUV", "Truck", "Luxury", "Van"];
  const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const locationOptions = ["Downtown", "Airport Area", "City Center", "Suburban", "Beach Area"];
  const inspectors = ["John Inspector", "Sarah Inspector", "Mike Inspector", "Emily Inspector"];

  // Stats
  const totalVehicles = vehicles.length;
  const pendingVehicles = vehicles.filter((v) => v.inspectionStatus === "Pending").length;
  const scheduledVehicles = vehicles.filter((v) => v.inspectionStatus === "Scheduled").length;
  const inProgressVehicles = vehicles.filter((v) => v.inspectionStatus === "In Progress").length;
  const reinspectionVehicles = vehicles.filter((v) => v.inspectionStatus === "Re-inspection").length;

  // Add vehicle
  const handleAddVehicle = () => {
    if (!form.regNumber.trim() || !form.vehicle.trim() || !form.hoster.trim()) {
      alert("Registration number, vehicle, and hoster are required!");
      return;
    }
    
    setVehicles([...vehicles, { 
      id: vehicles.length + 1, 
      submittedDate: new Date().toISOString().split('T')[0],
      ...form 
    }]);
    
    setForm({ 
      regNumber: "",
      vehicle: "",
      hoster: "",
      hosterPhone: "",
      submittedDate: "",
      inspectionStatus: "Pending",
      inspectionDate: "",
      inspector: "",
      location: "",
      vehicleType: "",
      fuelType: "",
      mileage: "",
      previousStatus: ""
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
      submittedDate: "",
      inspectionStatus: "Pending",
      inspectionDate: "",
      inspector: "",
      location: "",
      vehicleType: "",
      fuelType: "",
      mileage: "",
      previousStatus: ""
    });
    setEditingVehicle(null);
  };

  // Schedule inspection
  const scheduleInspection = (vehicle) => {
    const inspectionDate = prompt("Enter inspection date (YYYY-MM-DD):");
    const inspector = prompt("Enter inspector name:");
    
    if (inspectionDate && inspector) {
      setVehicles(prev => prev.map(v => 
        v.id === vehicle.id ? { 
          ...v, 
          inspectionStatus: "Scheduled",
          inspectionDate: inspectionDate,
          inspector: inspector
        } : v
      ));
    }
  };

  // Start inspection
  const startInspection = (vehicle) => {
    setVehicles(prev => prev.map(v => 
      v.id === vehicle.id ? { 
        ...v, 
        inspectionStatus: "In Progress",
        inspector: "Current User"
      } : v
    ));
    alert(`Starting inspection for ${vehicle.regNumber}`);
  };

  // Templates
  const statusBody = (row) => (
    <Tag 
      severity={
        row.inspectionStatus === "Scheduled" ? "info" :
        row.inspectionStatus === "In Progress" ? "warning" :
        row.inspectionStatus === "Re-inspection" ? "danger" : "secondary"
      } 
      value={row.inspectionStatus} 
    />
  );

  const actionBody = (row) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button 
        icon="pi pi-calendar" 
        rounded 
        text 
        severity="info"
        onClick={() => scheduleInspection(row)} 
        tooltip="Schedule Inspection" 
        disabled={row.inspectionStatus === "In Progress"}
      />
      <Button 
        icon="pi pi-play" 
        rounded 
        text 
        severity="success"
        onClick={() => startInspection(row)} 
        tooltip="Start Inspection" 
      />
      <Button 
        icon="pi pi-pencil" 
        rounded 
        text 
        onClick={() => handleEditVehicle(row)} 
        tooltip="Edit" 
      />
    </div>
  );

  const dateBody = (row, field) => (
    <span>{row[field] || "Not scheduled"}</span>
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
              Home &gt; Admin &gt; Pending Vehicles
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Pending Vehicle Inspection
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage vehicle inspections and scheduling
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Total: ${totalVehicles}`} severity="info" />
              <Tag value={`Pending: ${pendingVehicles}`} severity="secondary" />
              <Tag value={`Scheduled: ${scheduledVehicles}`} severity="info" />
              <Tag value={`In Progress: ${inProgressVehicles}`} severity="warning" />
              <Tag value={`Re-inspection: ${reinspectionVehicles}`} severity="danger" />
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
          <Column field="hoster" header="Hoster" />
          <Column field="submittedDate" header="Submitted" />
          <Column body={statusBody} header="Status" />
          <Column field="inspectionDate" header="Inspection Date" body={(row) => dateBody(row, 'inspectionDate')} />
          <Column field="location" header="Location" />
          <Column body={actionBody} header="Actions" style={{ width: '200px' }} />
        </DataTable>
      </Card>

      {/* Add Vehicle Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Vehicle for Inspection"
        style={{ width: '500px', color:'green' }}
      >
        <div className="p-fluid" style={{color:'black'}}>
          <div className="p-field">
            <label htmlFor="regNumber">Registration Number</label>
            <InputText
              id="regNumber"
              value={form.regNumber}
              onChange={(e) => setForm({ ...form, regNumber: e.target.value.toUpperCase() })}
              placeholder="e.g., XYZ789"
            />
          </div>
          <div className="p-field">
            <label htmlFor="vehicle">Vehicle Model</label>
            <InputText
              id="vehicle"
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              placeholder="e.g., Honda Civic 2024"
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
            <label htmlFor="mileage">Mileage</label>
            <InputText
              id="mileage"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              placeholder="e.g., 15,000 km"
            />
          </div>
          <div className="p-field">
            <label htmlFor="inspectionStatus">Inspection Status</label>
            <Dropdown
              id="inspectionStatus"
              value={form.inspectionStatus}
              options={statusOptions}
              onChange={(e) => setForm({ ...form, inspectionStatus: e.value })}
              placeholder="Select status"
            />
          </div>
          {form.inspectionStatus === "Scheduled" && (
            <>
              <div className="p-field">
                <label htmlFor="inspectionDate">Inspection Date</label>
                <Calendar
                  id="inspectionDate"
                  value={form.inspectionDate ? new Date(form.inspectionDate) : null}
                  onChange={(e) => setForm({ ...form, inspectionDate: e.value ? e.value.toISOString().split('T')[0] : '' })}
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>
              <div className="p-field">
                <label htmlFor="inspector">Inspector</label>
                <Dropdown
                  id="inspector"
                  value={form.inspector}
                  options={inspectors}
                  onChange={(e) => setForm({ ...form, inspector: e.value })}
                  placeholder="Select inspector"
                />
              </div>
            </>
          )}
          {form.inspectionStatus === "Re-inspection" && (
            <div className="p-field">
              <label htmlFor="previousStatus">Previous Status Notes</label>
              <InputText
                id="previousStatus"
                value={form.previousStatus}
                onChange={(e) => setForm({ ...form, previousStatus: e.target.value })}
                placeholder="e.g., Failed - Tire issues"
              />
            </div>
          )}
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
        header="Edit Vehicle Inspection"
        style={{ width: '500px' ,color:'blue'}}
      >
        <div className="p-fluid" style={{color:'black'}}>
          <div className="p-field">
            <label htmlFor="editRegNumber">Registration Number</label>
            <InputText
              id="editRegNumber"
              value={form.regNumber}
              onChange={(e) => setForm({ ...form, regNumber: e.target.value.toUpperCase() })}
              placeholder="e.g., XYZ789"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editVehicle">Vehicle Model</label>
            <InputText
              id="editVehicle"
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              placeholder="e.g., Honda Civic 2024"
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
            <label htmlFor="editMileage">Mileage</label>
            <InputText
              id="editMileage"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              placeholder="e.g., 15,000 km"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editInspectionStatus">Inspection Status</label>
            <Dropdown
              id="editInspectionStatus"
              value={form.inspectionStatus}
              options={statusOptions}
              onChange={(e) => setForm({ ...form, inspectionStatus: e.value })}
              placeholder="Select status"
            />
          </div>
          {form.inspectionStatus === "Scheduled" && (
            <>
              <div className="p-field">
                <label htmlFor="editInspectionDate">Inspection Date</label>
                <Calendar
                  id="editInspectionDate"
                  value={form.inspectionDate ? new Date(form.inspectionDate) : null}
                  onChange={(e) => setForm({ ...form, inspectionDate: e.value ? e.value.toISOString().split('T')[0] : '' })}
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>
              <div className="p-field">
                <label htmlFor="editInspector">Inspector</label>
                <Dropdown
                  id="editInspector"
                  value={form.inspector}
                  options={inspectors}
                  onChange={(e) => setForm({ ...form, inspector: e.value })}
                  placeholder="Select inspector"
                />
              </div>
            </>
          )}
          {form.inspectionStatus === "Re-inspection" && (
            <div className="p-field">
              <label htmlFor="editPreviousStatus">Previous Status Notes</label>
              <InputText
                id="editPreviousStatus"
                value={form.previousStatus}
                onChange={(e) => setForm({ ...form, previousStatus: e.target.value })}
                placeholder="e.g., Failed - Tire issues"
              />
            </div>
          )}
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