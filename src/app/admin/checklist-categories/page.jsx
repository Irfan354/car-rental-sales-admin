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

export default function ChecklistCategories() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: "Exterior Inspection", description: "Check exterior parts of the vehicle", status: "Active", vehicleType: "All" },
    { id: 2, name: "Interior Inspection", description: "Check interior components", status: "Active", vehicleType: "All" },
    { id: 3, name: "Mechanical Check", description: "Engine and mechanical systems", status: "Active", vehicleType: "Car" },
    { id: 4, name: "Document Verification", description: "Check all required documents", status: "Inactive", vehicleType: "All" },
  ]);

  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    vehicleType: "All", 
    status: "Active" 
  });
  const [editingCategory, setEditingCategory] = useState(null);

  const vehicleTypes = ["All", "Car", "SUV", "Truck", "Motorcycle", "Van"];

  // Stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "Active").length;
  const inactiveCategories = categories.filter((c) => c.status === "Inactive").length;

  // Add category
  const handleAddCategory = () => {
    if (!form.name.trim()) {
      alert("Category name is required!");
      return;
    }
    setCategories([...categories, { id: categories.length + 1, ...form }]);
    setForm({ name: "", description: "", vehicleType: "All", status: "Active" });
    setVisible(false);
  };

  // Edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setForm({ ...category });
    setEditVisible(true);
  };

  // Save edited category
  const handleSaveEdit = () => {
    if (!form.name.trim()) {
      alert("Category name is required!");
      return;
    }
    
    const updatedCategories = categories.map(category => 
      category.id === editingCategory.id ? { ...form } : category
    );
    
    setCategories(updatedCategories);
    setEditVisible(false);
    setForm({ name: "", description: "", vehicleType: "All", status: "Active" });
    setEditingCategory(null);
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
      onClick={() => handleEditCategory(row)} 
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
              Home &gt; Admin &gt; Checklist Categories
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Checklist Categories
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage vehicle inspection checklist categories
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Active: ${activeCategories}`} severity="success" />
              <Tag value={`Inactive: ${inactiveCategories}`} severity="danger" />
              <Tag value={`Total: ${totalCategories}`} severity="info" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add Category"
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
          value={categories} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No categories found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="Category Name" />
          <Column field="description" header="Description" />
          <Column field="vehicleType" header="Vehicle Type" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add Category Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Checklist Category"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Category Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter category name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div className="p-field">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <Dropdown
              id="vehicleType"
              value={form.vehicleType}
              options={vehicleTypes}
              onChange={(e) => setForm({ ...form, vehicleType: e.value })}
              placeholder="Select vehicle type"
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
            label="Save Category" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddCategory} 
          />
        </div>
      </Sidebar>

      {/* Edit Category Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit Checklist Category"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="editName">Category Name</label>
            <InputText
              id="editName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter category name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editDescription">Description</label>
            <InputText
              id="editDescription"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editVehicleType">Vehicle Type</label>
            <Dropdown
              id="editVehicleType"
              value={form.vehicleType}
              options={vehicleTypes}
              onChange={(e) => setForm({ ...form, vehicleType: e.value })}
              placeholder="Select vehicle type"
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