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

export default function Cities() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [cities, setCities] = useState([
    { id: 1, name: "Los Angeles", state: "California", stateCode: "CA", zipCode: "90001", status: "Active" },
    { id: 2, name: "San Francisco", state: "California", stateCode: "CA", zipCode: "94102", status: "Active" },
    { id: 3, name: "Houston", state: "Texas", stateCode: "TX", zipCode: "77001", status: "Active" },
    { id: 4, name: "Miami", state: "Florida", stateCode: "FL", zipCode: "33101", status: "Inactive" },
  ]);

  const [form, setForm] = useState({ 
    name: "", 
    state: "", 
    stateCode: "", 
    zipCode: "", 
    status: "Active" 
  });
  const [editingCity, setEditingCity] = useState(null);

  // Available states for dropdown
  const states = [
    { name: "California", code: "CA" },
    { name: "Texas", code: "TX" },
    { name: "New York", code: "NY" },
    { name: "Florida", code: "FL" },
    { name: "Illinois", code: "IL" }
  ];

  // Stats
  const totalCities = cities.length;
  const activeCities = cities.filter((c) => c.status === "Active").length;
  const inactiveCities = cities.filter((c) => c.status === "Inactive").length;

  // Add city
  const handleAddCity = () => {
    if (!form.name.trim() || !form.state.trim() || !form.zipCode.trim()) {
      alert("City name, state, and zip code are required!");
      return;
    }
    setCities([...cities, { id: cities.length + 1, ...form }]);
    setForm({ name: "", state: "", stateCode: "", zipCode: "", status: "Active" });
    setVisible(false);
  };

  // Edit city
  const handleEditCity = (city) => {
    setEditingCity(city);
    setForm({ ...city });
    setEditVisible(true);
  };

  // Handle state selection - automatically set state code
  const handleStateChange = (selectedState) => {
    const stateObj = states.find(s => s.name === selectedState);
    setForm({
      ...form,
      state: selectedState,
      stateCode: stateObj ? stateObj.code : ""
    });
  };

  // Save edited city
  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.state.trim() || !form.zipCode.trim()) {
      alert("City name, state, and zip code are required!");
      return;
    }
    
    const updatedCities = cities.map(city => 
      city.id === editingCity.id ? { ...form } : city
    );
    
    setCities(updatedCities);
    setEditVisible(false);
    setForm({ name: "", state: "", stateCode: "", zipCode: "", status: "Active" });
    setEditingCity(null);
  };

  // Templates
  const statusBody = (row) => (
    <Tag severity={row.status === "Active" ? "success" : "danger"} value={row.status} />
  );

  const actionBody = (row) => (
    <Button 
      icon="pi pi-pencil" 
      rounded 
      text 
      onClick={() => handleEditCity(row)} 
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
              Home &gt; Admin &gt; Cities
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Cities
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage cities and their state associations
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Active: ${activeCities}`} severity="success" />
              <Tag value={`Inactive: ${inactiveCities}`} severity="danger" />
              <Tag value={`Total: ${totalCities}`} severity="info" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add City"
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
          value={cities} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No cities found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="City Name" />
          <Column field="state" header="State" />
          <Column field="stateCode" header="State Code" />
          <Column field="zipCode" header="Zip Code" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add City Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add City"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">City Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter city name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="state">State</label>
            <Dropdown
              id="state"
              value={form.state}
              options={states.map(s => s.name)}
              onChange={(e) => handleStateChange(e.value)}
              placeholder="Select a state"
            />
          </div>
          <div className="p-field">
            <label htmlFor="stateCode">State Code</label>
            <InputText
              id="stateCode"
              value={form.stateCode}
              onChange={(e) => setForm({ ...form, stateCode: e.target.value.toUpperCase() })}
              maxLength={2}
              disabled
              placeholder="Auto-filled"
            />
          </div>
          <div className="p-field">
            <label htmlFor="zipCode">Zip Code</label>
            <InputText
              id="zipCode"
              value={form.zipCode}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
              placeholder="e.g., 90001"
            />
          </div>
          <div className="p-field">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              value={form.status}
              options={["Active", "Inactive"]}
              onChange={(e) => setForm({ ...form, status: e.value })}
              placeholder="Select status"
            />
          </div>
          <Divider />
          <Button 
            label="Save City" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddCity} 
          />
        </div>
      </Sidebar>

      {/* Edit City Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit City"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="editName">City Name</label>
            <InputText
              id="editName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter city name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editState">State</label>
            <Dropdown
              id="editState"
              value={form.state}
              options={states.map(s => s.name)}
              onChange={(e) => handleStateChange(e.value)}
              placeholder="Select a state"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editStateCode">State Code</label>
            <InputText
              id="editStateCode"
              value={form.stateCode}
              onChange={(e) => setForm({ ...form, stateCode: e.target.value.toUpperCase() })}
              maxLength={2}
              disabled
              placeholder="Auto-filled"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editZipCode">Zip Code</label>
            <InputText
              id="editZipCode"
              value={form.zipCode}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
              placeholder="e.g., 90001"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editStatus">Status</label>
            <Dropdown
              id="editStatus"
              value={form.status}
              options={["Active", "Inactive"]}
              onChange={(e) => setForm({ ...form, status: e.value })}
              placeholder="Select status"
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