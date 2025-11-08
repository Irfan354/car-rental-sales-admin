"use client";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import Image from "next/image";

export default function Brands() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [brands, setBrands] = useState([
    { id: 1, name: "Toyota", status: "Active", description: "Japanese automaker", image: null },
    { id: 2, name: "Honda", status: "Active", description: "Japanese automaker", image: null },
    { id: 3, name: "Ford", status: "Inactive", description: "American automaker", image: null },
  ]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
    image: null,
  });
  const [editingBrand, setEditingBrand] = useState(null);

  // Stats
  const totalBrands = brands.length;
  const activeBrands = brands.filter((b) => b.status === "Active").length;
  const inactiveBrands = brands.filter((b) => b.status === "Inactive").length;

  // Add Brand
  const handleAddBrand = () => {
    if (!form.name.trim()) {
      alert("Brand name is required!");
      return;
    }
    setBrands([...brands, { id: brands.length + 1, ...form }]);
    setForm({ name: "", description: "", status: "Active", image: null });
    setVisible(false);
  };

  // Edit
  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setForm({ ...brand });
    setEditVisible(true);
  };

  const handleSaveEdit = () => {
    if (!form.name.trim()) {
      alert("Brand name is required!");
      return;
    }
    const updated = brands.map((b) =>
      b.id === editingBrand.id ? { ...form, id: b.id } : b
    );
    setBrands(updated);
    setEditVisible(false);
    setEditingBrand(null);
    setForm({ name: "", description: "", status: "Active", image: null });
  };

  // Image upload
  const onUploadImage = (event) => {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setForm({ ...form, image: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  // Templates
  const imageBody = (row) =>
    row.image ? (
      <Image src={row.image} alt={row.name} width={50} height={50} />
    ) : (
      <span>No Image</span>
    );

  const statusBody = (row) => (
    <Tag severity={row.status === "Active" ? "success" : "danger"} value={row.status} />
  );

  const actionBody = (row) => (
    <Button icon="pi pi-pencil" rounded text onClick={() => handleEditBrand(row)} tooltip="Edit" />
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
              Home &gt; Admin &gt; Brands
            </div>
            <h1 style={{ color:'black',fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
              Car Brands
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage available car brands
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex',gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Active: ${activeBrands}`} severity="success" />
              <Tag value={`Inactive: ${inactiveBrands}`} severity="danger" />
              <Tag value={`Total: ${totalBrands}`} severity="info" />
            </div>
          </div>
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-plus"
              label="Add Brand"
              className="p-button-primary"
              onClick={() => setVisible(true)}
              style={{ whiteSpace: 'nowrap' }}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ marginTop: '1.5rem' }}>
        <DataTable value={brands} paginator rows={5} dataKey="id" stripedRows>
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="Brand Name" />
          <Column body={imageBody} header="Brand Logo" />
          <Column field="description" header="Description" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add Brand Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add Brand"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Brand Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <div className="p-field">
            <label>Brand Logo</label>
            <FileUpload
              mode="basic"
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              auto
              uploadHandler={onUploadImage}
              chooseLabel="Upload Logo"
            />
          </div>
          {form.image && (
            <div className="p-mt-3">
              <Image src={form.image} alt="Preview" width={80} height={80} />
            </div>
          )}
          <Divider />
          <Button label="Save" icon="pi pi-check" severity="help" onClick={handleAddBrand} />
        </div>
      </Sidebar>

      {/* Edit Brand Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit Brand"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Brand Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <div className="p-field">
            <label>Brand Logo</label>
            <FileUpload
              mode="basic"
              accept="image/*"
              maxFileSize={1000000}
              customUpload
              auto
              uploadHandler={onUploadImage}
              chooseLabel="Upload Logo"
            />
          </div>
          {form.image && (
            <div className="p-mt-3">
              <Image src={form.image} alt="Preview" width={80} height={80} />
            </div>
          )}
          <Divider />
          <Button
            label="Save Changes"
            icon="pi pi-check"
            severity="success"
            onClick={handleSaveEdit}
          />
        </div>
      </Sidebar>
    </div>
  );
}