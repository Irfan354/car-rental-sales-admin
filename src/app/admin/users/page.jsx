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

export default function Users() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "Ali Rahman", email: "ali@example.com", role: "ADMIN", status: "Active" },
    { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "HOSTER", status: "Inactive" },
    { id: 3, name: "Omar Khalid", email: "omar@example.com", role: "CUSTOMER", status: "Active" },
  ]);

  const [form, setForm] = useState({ id: null, name: "", email: "", role: "CUSTOMER", status: "Active" });
  const [editingUser, setEditingUser] = useState(null);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;

  // Add User
  const handleAddUser = () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required!");
      return;
    }
    setUsers([...users, { id: users.length + 1, ...form }]);
    setForm({ id: null, name: "", email: "", role: "CUSTOMER", status: "Active" });
    setVisible(false);
  };

  // Edit User
  const handleEditUser = (user) => {
    if (user.role === "ADMIN") {
      setEditingUser(user);
      setForm({ ...user });
      setEditVisible(true);
    }
  };

  // Save edited user
  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required!");
      return;
    }
    
    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? { ...form } : user
    );
    
    setUsers(updatedUsers);
    setEditVisible(false);
    setForm({ id: null, name: "", email: "", role: "CUSTOMER", status: "Active" });
    setEditingUser(null);
  };

  // Templates
  const statusBody = (row) => (
    <Tag severity={row.status === "Active" ? "success" : "danger"} value={row.status} />
  );

  const actionBody = (row) => {
    if (row.role === "ADMIN") {
      return (
        <Button 
          icon="pi pi-pencil" 
          rounded 
          text 
          onClick={() => handleEditUser(row)} 
          tooltip="Edit" 
        />
      );
    }
    return null;
  };

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
              Home &gt; Admin &gt; Users
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Users
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Manage system users and permissions
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Active: ${activeUsers}`} severity="success" />
              <Tag value={`Inactive: ${inactiveUsers}`} severity="danger" />
              <Tag value={`Total: ${totalUsers}`} severity="info" />
            </div>
          </div> 
          
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-user-plus"
              label="Add User"
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
          value={users} 
          paginator 
          rows={5} 
          dataKey="id" 
          stripedRows
          emptyMessage="No users found." 
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column field="name" header="Name" />
          <Column field="email" header="Email" />
          <Column field="role" header="Role" />
          <Column body={statusBody} header="Status" />
          <Column body={actionBody} header="Actions" />
        </DataTable>
      </Card>

      {/* Add User Sidebar */}
      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        header="Add User"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
          <div className="p-field">
            <label htmlFor="role">Role</label>
            <Dropdown
              id="role"
              value={form.role}
              options={["ADMIN", "HOSTER", "CUSTOMER"]}
              onChange={(e) => setForm({ ...form, role: e.value })}
              placeholder="Select role"
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
            label="Save User" 
            icon="pi pi-check" 
            className="p-button-primary" 
            onClick={handleAddUser} 
          />
        </div>
      </Sidebar>

      {/* Edit User Sidebar */}
      <Sidebar
        visible={editVisible}
        position="right"
        onHide={() => setEditVisible(false)}
        header="Edit User"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="editName">Name</label>
            <InputText
              id="editName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editEmail">Email</label>
            <InputText
              id="editEmail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
          <div className="p-field">
            <label htmlFor="editRole">Role</label>
            <Dropdown
              id="editRole"
              value={form.role}
              options={["ADMIN", "HOSTER", "CUSTOMER"]}
              onChange={(e) => setForm({ ...form, role: e.value })}
              placeholder="Select role"
              disabled={true}
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