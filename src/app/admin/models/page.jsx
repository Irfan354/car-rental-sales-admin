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

export default function Models() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [models, setModels] = useState([
    { id: 1, name: "Camry", brand: "Toyota", status: "Active", year: "2024" },
    { id: 2, name: "Civic", brand: "Honda", status: "Active", year: "2024" },
    { id: 3, name: "F-150", brand: "Ford", status: "Inactive", year: "2023" },
  ]);

  const [form, setForm] = useState({ name: "", brand: "", year: "", status: "Active" });
  const [editingModel, setEditingModel] = useState(null);

  const brands = ["Toyota", "Honda", "Ford", "BMW", "Mercedes"];

  // Stats
  const totalModels = models.length;
  const activeModels = models.filter((m) => m.status === "Active").length;
  const inactiveModels = models.filter((m) => m.status === "Inactive").length;

  // Add model
  const handleAddModel = () => {
    if (!form.name.trim() || !form.brand.trim()) {
      alert("Model name and brand are required!");
      return;
    }
    setModels([...models, { id: models.length + 1, ...form }]);
    setForm({ name: "", brand: "", year: "", status: "Active" });
    setVisible(false);
  };

  // Edit model
  const handleEditModel = (model) => {
    setEditingModel(model);
    setForm({ ...model });
    setEditVisible(true);
  };

  // Save edited model
  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.brand.trim()) {
      alert("Model name and brand are required!");
      return;
    }
    
    const updatedModels = models.map(model => 
      model.id === editingModel.id ? { ...form } : model
    );
    
    setModels(updatedModels);
    setEditVisible(false);
    setForm({ name: "", brand: "", year: "", status: "Active" });
    setEditingModel(null);
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
      onClick={() => handleEditModel(row)} 
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
              Home &gt; Admin &gt; Models
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Car Models
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage car models and their specifications
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Active: ${activeModels}`} severity="success" />
              <Tag value={`Inactive: ${inactiveModels}`} severity="danger" />
              <Tag value={`Total: ${totalModels}`} severity="info" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add Model"
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
          value={models} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No models found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="Model Name" />
          <Column field="brand" header="Brand" />
          <Column field="year" header="Year" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add Model Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Model"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Model Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter model name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="brand">Brand</label>
            <Dropdown
              id="brand"
              value={form.brand}
              options={brands}
              onChange={(e) => setForm({ ...form, brand: e.value })}
              placeholder="Select brand"
            />
          </div>
          <div className="p-field">
            <label htmlFor="year">Year</label>
            <InputText
              id="year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="Enter year"
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
            label="Save Model" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddModel} 
          />
        </div>
      </Sidebar>

      {/* Edit Model Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit Model"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="editName">Model Name</label>
            <InputText
              id="editName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter model name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editBrand">Brand</label>
            <Dropdown
              id="editBrand"
              value={form.brand}
              options={brands}
              onChange={(e) => setForm({ ...form, brand: e.value })}
              placeholder="Select brand"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editYear">Year</label>
            <InputText
              id="editYear"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="Enter year"
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