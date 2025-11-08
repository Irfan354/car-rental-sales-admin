"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export default function ChecklistOptions() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  // read category from URL (safe in client)
  const [categoryId, setCategoryId] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("category") || "";
  });

  // keep categoryId updated if user navigates back/forward
  useEffect(() => {
    const onPop = () => {
      setCategoryId(new URLSearchParams(window.location.search).get("category") || "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const [options, setOptions] = useState([
    { id: 1, categoryId: 1, name: "Body Damage", description: "Check for any body damage", isRequired: true, status: "Active" },
    { id: 2, categoryId: 1, name: "Paint Condition", description: "Check paint quality", isRequired: true, status: "Active" },
    { id: 3, categoryId: 1, name: "Window Condition", description: "Check all windows", isRequired: false, status: "Active" },
    { id: 4, categoryId: 2, name: "Seat Condition", description: "Check seat quality", isRequired: true, status: "Active" },
    { id: 5, categoryId: 2, name: "Dashboard Lights", description: "Check dashboard warning lights", isRequired: false, status: "Inactive" },
  ]);

  const [categories] = useState([
    { id: 1, name: "Exterior Inspection" },
    { id: 2, name: "Interior Inspection" },
    { id: 3, name: "Mechanical Check" },
    { id: 4, name: "Document Verification" },
  ]);

  // initialize form.categoryId using numeric value (if present)
  const [form, setForm] = useState({ 
    categoryId: categoryId ? parseInt(categoryId, 10) : "", 
    name: "", 
    description: "", 
    isRequired: true, 
    status: "Active" 
  });
  const [editingOption, setEditingOption] = useState(null);

  // keep form.categoryId in sync when URL param changes
  useEffect(() => {
    setForm(prev => ({ ...prev, categoryId: categoryId ? parseInt(categoryId, 10) : "" }));
  }, [categoryId]);

  // parse categoryId for comparisons
  const categoryIdNum = categoryId ? parseInt(categoryId, 10) : null;

  // Filter options by selected category
  const filteredOptions = categoryIdNum 
    ? options.filter(option => option.categoryId === categoryIdNum)
    : options;

  const currentCategory = categories.find(cat => cat.id === categoryIdNum);

  // Stats
  const totalOptions = filteredOptions.length;
  const requiredOptions = filteredOptions.filter((o) => o.isRequired).length;
  const optionalOptions = filteredOptions.filter((o) => !o.isRequired).length;

  // Add option
  const handleAddOption = () => {
    if (!form.name.trim() || !form.categoryId) {
      alert("Option name and category are required!");
      return;
    }
    setOptions([...options, { id: options.length + 1, ...form }]);
    setForm({ categoryId: categoryId ? parseInt(categoryId, 10) : "", name: "", description: "", isRequired: true, status: "Active" });
    setVisible(false);
  };

  // Edit option
  const handleEditOption = (option) => {
    setEditingOption(option);
    setForm({ ...option });
    setEditVisible(true);
  };

  // Save edited option
  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.categoryId) {
      alert("Option name and category are required!");
      return;
    }
    
    const updatedOptions = options.map(option => 
      option.id === editingOption.id ? { ...form } : option
    );
    
    setOptions(updatedOptions);
    setEditVisible(false);
    setForm({ categoryId: categoryId ? parseInt(categoryId, 10) : "", name: "", description: "", isRequired: true, status: "Active" });
    setEditingOption(null);
  };

  // Templates
  const statusBody = (row) => (
    <Tag severity={row.status === "Active" ? "success" : "danger"} value={row.status} />
  );

  const requiredBody = (row) => (
    <Tag 
      severity={row.isRequired ? "success" : "info"} 
      value={row.isRequired ? "Required" : "Optional"} 
    />
  );

  const categoryBody = (rowData) => {
    const category = categories.find(cat => cat.id === rowData.categoryId);
    return category ? category.name : "Unknown";
  };

  const actionBody = (row) => (
    <Button 
      icon="pi pi-pencil" 
      rounded 
      text 
      onClick={() => handleEditOption(row)} 
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
              Home &gt; Admin &gt; Checklist Categories &gt; 
              <span style={{ color: 'black', fontWeight: '600' }}>
                {currentCategory ? ` ${currentCategory.name}` : " All"} Options
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Checklist Options {currentCategory && `- ${currentCategory.name}`}
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage checklist options and requirements
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Required: ${requiredOptions}`} severity="success" />
              <Tag value={`Optional: ${optionalOptions}`} severity="info" />
              <Tag value={`Total: ${totalOptions}`} severity="primary" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {!categoryId && (
              <Dropdown 
                value={form.categoryId} 
                options={categories.map(cat => ({ label: cat.name, value: cat.id }))} 
                onChange={(e) => setForm({ ...form, categoryId: e.value })}
                placeholder="Select Category"
                style={{ width: '200px' }}
              />
            )}
            <Button
              icon="pi pi-plus"
              label="Add Option"
              className="p-button-primary"
              onClick={() => setVisible(true)}
              disabled={!categoryId && !form.categoryId}
              style={{ whiteSpace: 'nowrap' }}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ marginTop: '1.5rem' }}>
        <DataTable 
          value={filteredOptions} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No options found."
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="Option Name" />
          <Column field="description" header="Description" />
          {!categoryId && (
            <Column 
              field="categoryId" 
              header="Category" 
              body={categoryBody}
            />
          )}
          <Column body={requiredBody} header="Required" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add Option Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Checklist Option"
      >
        <div className="p-fluid">
          {!categoryId && (
            <div className="p-field">
              <label htmlFor="category">Category</label>
              <Dropdown
                id="category"
                value={form.categoryId}
                options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                onChange={(e) => setForm({ ...form, categoryId: e.value })}
                placeholder="Select category"
              />
            </div>
          )}
          <div className="p-field">
            <label htmlFor="name">Option Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter option name"
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
            <label htmlFor="isRequired">Requirement</label>
            <Dropdown
              id="isRequired"
              value={form.isRequired}
              options={[
                { label: "Required", value: true },
                { label: "Optional", value: false }
              ]}
              onChange={(e) => setForm({ ...form, isRequired: e.value })}
              placeholder="Select requirement"
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
            label="Save Option" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddOption} 
          />
        </div>
      </Sidebar>

      {/* Edit Option Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit Checklist Option"
      >
        <div className="p-fluid">
          {!categoryId && (
            <div className="p-field">
              <label htmlFor="editCategory">Category</label>
              <Dropdown
                id="editCategory"
                value={form.categoryId}
                options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
                onChange={(e) => setForm({ ...form, categoryId: e.value })}
                placeholder="Select category"
              />
            </div>
          )}
          <div className="p-field">
            <label htmlFor="editName">Option Name</label>
            <InputText
              id="editName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter option name"
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
            <label htmlFor="editIsRequired">Requirement</label>
            <Dropdown
              id="editIsRequired"
              value={form.isRequired}
              options={[
                { label: "Required", value: true },
                { label: "Optional", value: false }
              ]}
              onChange={(e) => setForm({ ...form, isRequired: e.value })}
              placeholder="Select requirement"
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