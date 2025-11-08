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

export default function Variants() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [variants, setVariants] = useState([
    { id: 1, name: "LE", model: "Camry", fuelType: "Petrol", transmission: "Automatic", status: "Active" },
    { id: 2, name: "EX", model: "Civic", fuelType: "Petrol", transmission: "Manual", status: "Active" },
    { id: 3, name: "Platinum", model: "F-150", fuelType: "Diesel", transmission: "Automatic", status: "Inactive" },
  ]);

  const [form, setForm] = useState({ 
    name: "", 
    model: "", 
    fuelType: "Petrol", 
    transmission: "Automatic", 
    status: "Active" 
  });
  const [editingVariant, setEditingVariant] = useState(null);

  const models = ["Camry", "Civic", "F-150", "Corolla", "Accord"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const transmissions = ["Automatic", "Manual", "CVT"];

  // Stats
  const totalVariants = variants.length;
  const activeVariants = variants.filter((v) => v.status === "Active").length;
  const inactiveVariants = variants.filter((v) => v.status === "Inactive").length;

  // Add variant
  const handleAddVariant = () => {
    if (!form.name.trim() || !form.model.trim()) {
      alert("Variant name and model are required!");
      return;
    }
    setVariants([...variants, { id: variants.length + 1, ...form }]);
    setForm({ name: "", model: "", fuelType: "Petrol", transmission: "Automatic", status: "Active" });
    setVisible(false);
  };

  // Edit variant
  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setForm({ ...variant });
    setEditVisible(true);
  };

  // Save edited variant
  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.model.trim()) {
      alert("Variant name and model are required!");
      return;
    }
    
    const updatedVariants = variants.map(variant => 
      variant.id === editingVariant.id ? { ...form } : variant
    );
    
    setVariants(updatedVariants);
    setEditVisible(false);
    setForm({ name: "", model: "", fuelType: "Petrol", transmission: "Automatic", status: "Active" });
    setEditingVariant(null);
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
      onClick={() => handleEditVariant(row)} 
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
              Home &gt; Admin &gt; Variants
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Car Variants
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage car variants and specifications
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Active: ${activeVariants}`} severity="success" />
              <Tag value={`Inactive: ${inactiveVariants}`} severity="danger" />
              <Tag value={`Total: ${totalVariants}`} severity="info" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add Variant"
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
          value={variants} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No variants found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="Variant Name" />
          <Column field="model" header="Model" />
          <Column field="fuelType" header="Fuel Type" />
          <Column field="transmission" header="Transmission" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add Variant Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Variant"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Variant Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter variant name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="model">Model</label>
            <Dropdown
              id="model"
              value={form.model}
              options={models}
              onChange={(e) => setForm({ ...form, model: e.value })}
              placeholder="Select model"
            />
          </div>
          <div className="p-field">
            <label htmlFor="fuelType">Fuel Type</label>
            <Dropdown
              id="fuelType"
              value={form.fuelType}
              options={fuelTypes}
              onChange={(e) => setForm({ ...form, fuelType: e.value })}
              placeholder="Select fuel type"
            />
          </div>
          <div className="p-field">
            <label htmlFor="transmission">Transmission</label>
            <Dropdown
              id="transmission"
              value={form.transmission}
              options={transmissions}
              onChange={(e) => setForm({ ...form, transmission: e.value })}
              placeholder="Select transmission"
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
            label="Save Variant" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddVariant} 
          />
        </div>
      </Sidebar>

      {/* Edit Variant Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit Variant"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="editName">Variant Name</label>
            <InputText
              id="editName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter variant name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editModel">Model</label>
            <Dropdown
              id="editModel"
              value={form.model}
              options={models}
              onChange={(e) => setForm({ ...form, model: e.value })}
              placeholder="Select model"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editFuelType">Fuel Type</label>
            <Dropdown
              id="editFuelType"
              value={form.fuelType}
              options={fuelTypes}
              onChange={(e) => setForm({ ...form, fuelType: e.value })}
              placeholder="Select fuel type"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editTransmission">Transmission</label>
            <Dropdown
              id="editTransmission"
              value={form.transmission}
              options={transmissions}
              onChange={(e) => setForm({ ...form, transmission: e.value })}
              placeholder="Select transmission"
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