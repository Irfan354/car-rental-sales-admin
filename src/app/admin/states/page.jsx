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

export default function States() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [states, setStates] = useState([
    { id: 1, name: "California", code: "CA", country: "USA", status: "Active" },
    { id: 2, name: "Texas", code: "TX", country: "USA", status: "Active" },
    { id: 3, name: "New York", code: "NY", country: "USA", status: "Active" },
    { id: 4, name: "Florida", code: "FL", country: "USA", status: "Inactive" },
  ]);

  const [form, setForm] = useState({ name: "", code: "", country: "USA", status: "Active" });
  const [editingState, setEditingState] = useState(null);

  // Stats
  const totalStates = states.length;
  const activeStates = states.filter((s) => s.status === "Active").length;
  const inactiveStates = states.filter((s) => s.status === "Inactive").length;

  // Add state
  const handleAddState = () => {
    if (!form.name.trim() || !form.code.trim()) {
      alert("State name and code are required!");
      return;
    }
    setStates([...states, { id: states.length + 1, ...form }]);
    setForm({ name: "", code: "", country: "USA", status: "Active" });
    setVisible(false);
  };

  // Edit state
  const handleEditState = (state) => {
    setEditingState(state);
    setForm({ ...state });
    setEditVisible(true);
  };

  // Save edited state
  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.code.trim()) {
      alert("State name and code are required!");
      return;
    }
    
    const updatedStates = states.map(state => 
      state.id === editingState.id ? { ...form } : state
    );
    
    setStates(updatedStates);
    setEditVisible(false);
    setForm({ name: "", code: "", country: "USA", status: "Active" });
    setEditingState(null);
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
      onClick={() => handleEditState(row)} 
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
              Home &gt; Admin &gt; States
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              States
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage states and their information
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Active: ${activeStates}`} severity="success" />
              <Tag value={`Inactive: ${inactiveStates}`} severity="danger" />
              <Tag value={`Total: ${totalStates}`} severity="info" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add State"
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
          value={states} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No states found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="State Name" />
          <Column field="code" header="State Code" />
          <Column field="country" header="Country" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add State Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add State"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">State Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter state name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="code">State Code</label>
            <InputText
              id="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              maxLength={2}
              placeholder="e.g., CA"
            />
          </div>
          <div className="p-field">
            <label htmlFor="country">Country</label>
            <InputText
              id="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Enter country"
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
            label="Save State" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddState} 
          />
        </div>
      </Sidebar>

      {/* Edit State Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit State"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="editName">State Name</label>
            <InputText
              id="editName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter state name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editCode">State Code</label>
            <InputText
              id="editCode"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              maxLength={2}
              placeholder="e.g., CA"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editCountry">Country</label>
            <InputText
              id="editCountry"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Enter country"
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