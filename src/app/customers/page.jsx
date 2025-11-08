"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useHosters } from "../hooks/useHosters";
import { useStates } from "../hooks/useStates";
import { useCities } from "../hooks/useCities";

export default function Hosters() {
  const toast = useRef(null);
  const {
    hosters,
    setHosters,
    loading: hostersLoading,
    error: hostersError,
    updateHosterStatus,
    loadHosters
  } = useHosters();

  const {
    states,
    loading: statesLoading,
    error: statesError,
    loadStates
  } = useStates();

  const {
    cities,
    loading: citiesLoading,
    loadCities
  } = useCities();

  const [validationVisible, setValidationVisible] = useState(false);
  const [validatingHoster, setValidatingHoster] = useState(null);
  const [validationNotes, setValidationNotes] = useState("");

  // Load data on component mount
  useEffect(() => {
    loadStates();
    loadCities();
  }, []);

  // Get state name by ID from API data
  const getStateName = (stateId) => {
    if (!stateId) return 'N/A';
    const state = states.find(s => s.id === stateId);
    return state ? state.name : 'N/A';
  };

  // Get city name by ID from API data
  const getCityName = (cityId) => {
    if (!cityId) return 'N/A';
    const city = cities.find(c => c.id === cityId);
    return city ? city.name : 'N/A';
  };

  // Combined loading state
  const loading = hostersLoading || statesLoading || citiesLoading;

  // Stats
  const totalHosters = hosters.length;
  const activeHosters = hosters.filter((h) => h.status === "ACTIVE").length;
  const pendingHosters = hosters.filter((h) => h.status === "PENDING").length;
  const suspendedHosters = hosters.filter((h) => h.status === "SUSPENDED").length;
  const verifiedHosters = hosters.filter((h) => h.verificationStatus === "VERIFIED").length;

  // Show toast messages
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  // Handle API errors
  useEffect(() => {
    if (hostersError) {
      showToast('error', 'Hosters Error', hostersError);
    }
    if (statesError) {
      showToast('error', 'States Error', statesError);
    }
  }, [hostersError, statesError]);

  // Validate hoster
  const handleValidateHoster = (hoster) => {
    console.log('🔍 Validating hoster:', hoster);
    setValidatingHoster(hoster);
    setValidationNotes("");
    setValidationVisible(true);
  };


// Save validation decision
const handleSaveValidation = async (newStatus) => {
  if (!validatingHoster) return;

  try {
    // Build request payload for backend
    const statusData = {
       approvalStatus :
       newStatus === "REJECTED" ? "REJECTED" : newStatus === "PENDING" ? "IN_PROGESS" : "APPROVED",      // must match enum value
      hosterStatus: 
      newStatus === "REJECTED" ? "IN_ACTIVE" : newStatus === "PENDING" ? "IN_PROGRESS" : "ACTIVE",          // must match enum value
      validationNotes: validationNotes || "",
    };

    
    // 🔹 Call backend PATCH
    const updatedHoster = await updateHosterStatus(validatingHoster.id, statusData);
    console.log("updated hoster :" + updatedHoster);

    // Ensure we always update local state instantly
    setHosters((prevHosters) =>
      Array.isArray(prevHosters)
        ? prevHosters.map((h) =>
            h.id === validatingHoster.id
              ? { ...h, ...statusData, ...updatedHoster }
              : h
          )
        : []
    );

    //  Reload list to sync with backend (optional)
    await loadHosters();

    // 🧩 Show toast safely
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: "Status Updated",
        detail: `Hoster ${statusData.approvalStatus.toLowerCase()} successfully.`,
        life: 3000,
      });
    }

    // Close sidebar
    setValidationVisible(false);
    setValidatingHoster(null);
    setValidationNotes("");
  } catch (error) {
    console.error("❌ Validation error:", error);

    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Update Failed",
        detail: "Failed to update hoster status.",
        life: 3000,
      });
    }
  }
};

  
  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([
      loadHosters(),
      loadStates(),
      loadCities()
    ]);
    showToast('success', 'Refreshed', 'All data has been refreshed');
  };

  // Templates
  const imageBody = (row) => (
    <Image 
      src={row.profilePic || "/demo/images/avatar/placeholder.png"} 
      alt={row.name} width="40" height="40" className="border-circle" preview 
    />
  );
  const hosterStatus = (row) => (
    <Tag 
      severity={
        row.hosterStatus === "ACTIVE"
          ? "success"
          : row.hosterStatus === "PENDING"
          ? "warning"
          : row.hosterStatus === "IN_ACTIVE"
          ? "danger"
          : "secondary"
      }
      value={row.hosterStatus || "N/A"} 
    />
  );

  const approvalStatus = (row) => (
    <Tag 
      severity={
        row.approvalStatus === "APPROVED"
          ? "success"
          : row.approvalStatus === "UNDER_REVIEW"
          ? "warning"
          : row.approvalStatus === "REJECTED"
          ? "danger"
          : "secondary"
      } 
      value={row.approvalStatus || "N/A"} 
    />
  );

  const actionBody = (row) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button 
        icon="pi pi-eye" 
        rounded 
        text 
        severity="info"
        onClick={() => handleValidateHoster(row)} 
        tooltip="Validate & Inspect" 
      />
    </div>
  );

  const documentsBody = (row) => (
    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
      <Tag 
        value="Aadhar" 
        severity={row.aadharNumber ? "success" : "warning"}
        style={{ fontSize: '0.75rem' }}
      />
      <Tag 
        value="PAN" 
        severity={row.panNumber ? "success" : "warning"}
        style={{ fontSize: '0.75rem' }}
      />
    </div>
  );

  // State and City name display using REAL API data
  const stateBody = (row) => (
    <span>{getStateName(row.stateId)}</span>
  );

  const cityBody = (row) => (
    <span>{getCityName(row.cityId)}</span>
  );

  return (
    <div className="p-fluid p-3">
      <Toast ref={toast} />

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
              Home &gt; Admin &gt; Hosters
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'black' }}>
              Hosters Management
            </h1>
            <p style={{ color: 'black', margin: 0 }}>
              Verify and manage hoster registrations
            </p>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Tag value={`Total: ${totalHosters}`} severity="info" />
              <Tag value={`Active: ${activeHosters}`} severity="success" />
              <Tag value={`Pending: ${pendingHosters}`} severity="warning" />
              <Tag value={`Suspended: ${suspendedHosters}`} severity="danger" />
              <Tag value={`Verified: ${verifiedHosters}`} severity="success" />
              {/* <Tag value={`States: ${states.length}`} severity="info" /> */}
              {/* <Tag value={`Cities: ${cities.length}`} severity="info" /> */}
            </div>
          </div> 
          
          {/* Refresh button */}
          <div style={{ marginLeft: 'auto' }}>
            <Button
              icon="pi pi-refresh"
              label="Refresh All"
              className="p-button-outlined"
              onClick={handleRefresh}
              tooltip="Refresh all data"
              loading={loading}
            />
          </div>
        </div>
      </Card>

      {/* Table - Using REAL State and City Data */}
      <Card style={{ marginTop: '1.5rem' }}>
        <DataTable 
          value={hosters} 
          paginator 
          rows={10} 
          dataKey="id" 
          stripedRows
          emptyMessage="No hosters found."
          loading={loading}
        >
          <Column field="id" header="ID" style={{ width: "60px" }} />
          <Column body={imageBody} header="Image" style={{ width: "80px" }} />
          <Column field="name" header="Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="mobile" header="Mobile" sortable />
          <Column field="alternateMobile" header="Alternate Mobile" />
          <Column field="stateName" header="State" />
          <Column field="cityName" header="City" />
          <Column body={hosterStatus} header="Hoster Status" sortable />
          <Column body={approvalStatus} header="Approval Status" sortable />
          <Column body={documentsBody} header="Documents" />
          <Column body={actionBody} header="Actions" style={{ width: '80px' }} />
        </DataTable>
      </Card>

      {/* Validation Sidebar - Using REAL State and City Data */}
      <Sidebar
        visible={validationVisible}
        position="right"
        onHide={() => {
          setValidationVisible(false);
          setValidatingHoster(null);
          setValidationNotes("");
        }}
        header={`Validate Hoster - ${validatingHoster?.name || ''}`}
        style={{ width: '700px' }}
      >
        {validatingHoster && (
          <div className="p-fluid">
            {/* Profile Header */}
            <div className="p-field text-center mb-4">
              <Image 
                src={validatingHoster.profilePic || "/demo/images/avatar/placeholder.png"} 
                alt={validatingHoster.name} 
                width="100" 
                height="100" 
                className="border-circle mb-3" 
                preview 
              />
              <h3 style={{ margin: '0.5rem 0', color: 'var(--text-color)' }}>
                {validatingHoster.name}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Tag 
                  value={validatingHoster.status} 
                  severity={
                    validatingHoster.status === "ACTIVE" ? "success" :
                    validatingHoster.status === "PENDING" ? "warning" : "danger"
                  } 
                />
                <Tag 
                  value={validatingHoster.verificationStatus} 
                  severity={
                    validatingHoster.verificationStatus === "VERIFIED" ? "success" :
                    validatingHoster.verificationStatus === "UNDER_REVIEW" ? "warning" : "danger"
                  } 
                />
              </div>
            </div>

            <Divider />

            {/* Personal Information */}
            <div className="p-field">
              <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Personal Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="font-semibold">{validatingHoster.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mobile</label>
                  <p className="font-semibold">{validatingHoster.mobile}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Alternate Mobile</label>
                  <p>{validatingHoster.alternateMobile || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">User ID</label>
                  <p>{validatingHoster.userId || "N/A"}</p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Document Information */}
            <div className="p-field">
              <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Document Verification</h4>
              
              {/* Aadhar Information */}
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Aadhar Card</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Aadhar Number</label>
                    <p className={validatingHoster.aadharNumber ? "font-mono font-semibold" : "text-gray-500"}>
                      {validatingHoster.aadharNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <Tag 
                      value={validatingHoster.aadharNumber ? "Provided" : "Missing"} 
                      severity={validatingHoster.aadharNumber ? "success" : "warning"}
                    />
                  </div>
                </div>
                
                {/* Aadhar Images */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {validatingHoster.aadharFrontPic ? (
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-1">Aadhar Front</label>
                      <Image 
                        src={validatingHoster.aadharFrontPic} 
                        alt="Aadhar Front" 
                        width="120" 
                        height="80" 
                        preview 
                        className="border-round"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-1">Aadhar Front</label>
                      <div className="border-2 border-dashed border-gray-300 p-4 rounded" style={{ width: '120px', height: '80px' }}>
                        <i className="pi pi-image text-gray-400"></i>
                      </div>
                    </div>
                  )}
                  
                  {validatingHoster.aadharBackPic ? (
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-1">Aadhar Back</label>
                      <Image 
                        src={validatingHoster.aadharBackPic} 
                        alt="Aadhar Back" 
                        width="120" 
                        height="80" 
                        preview 
                        className="border-round"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-1">Aadhar Back</label>
                      <div className="border-2 border-dashed border-gray-300 p-4 rounded" style={{ width: '120px', height: '80px' }}>
                        <i className="pi pi-image text-gray-400"></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PAN Information */}
              <div className="mb-4">
                <h5 className="font-semibold mb-2">PAN Card</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">PAN Number</label>
                    <p className={validatingHoster.panNumber ? "font-mono font-semibold" : "text-gray-500"}>
                      {validatingHoster.panNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <Tag 
                      value={validatingHoster.panNumber ? "Provided" : "Missing"} 
                      severity={validatingHoster.panNumber ? "success" : "warning"}
                    />
                  </div>
                </div>
                
                {/* PAN Image */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {validatingHoster.pancardPic ? (
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-1">PAN Card</label>
                      <Image 
                        src={validatingHoster.pancardPic} 
                        alt="PAN Card" 
                        width="120" 
                        height="80" 
                        preview 
                        className="border-round"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <label className="block text-sm text-gray-600 mb-1">PAN Card</label>
                      <div className="border-2 border-dashed border-gray-300 p-4 rounded" style={{ width: '120px', height: '80px' }}>
                        <i className="pi pi-image text-gray-400"></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            {/* Address Information - Using REAL State and City Data */}
            <div className="p-field">
              <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Address Information</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Address</label>
                  <p>{validatingHoster.address || "Not provided"}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">State</label>
                    <p>{validatingHoster.stateName || "not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">City</label>
                    <p>{validatingHoster.cityName || "not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Pincode</label>
                    <p>{validatingHoster.pincode || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Validation Notes & Actions */}
            <div className="p-field">
              <label htmlFor="validationNotes" className="block text-sm font-medium text-gray-600 mb-2">
                Validation Notes
              </label>
              <InputTextarea
                id="validationNotes"
                value={validationNotes}
                onChange={(e) => setValidationNotes(e.target.value)}
                placeholder="Add notes about your validation decision..."
                rows={3}
                className="w-full"
              />
            </div>

            <Divider />

            {/* Approval Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                label="Approve"
                icon="pi pi-check"
                className="p-button-success flex-1"
                onClick={() => handleSaveValidation("ACTIVE")}
                disabled={loading}
              />
              <Button
                label="Reject"
                icon="pi pi-times"
                className="p-button-danger flex-1"
                onClick={() => handleSaveValidation("REJECTED")}
                disabled={loading}
              />
              <Button
                label="Request Info"
                icon="pi pi-info-circle"
                className="p-button-warning flex-1"
                onClick={() => handleSaveValidation("PENDING")}
                disabled={loading}
              />
{/* <Divider/> */}
{/*  Usage */}
              {/* <Button label="Approve" onClick={() => handleApproval(hoster.id, "APPROVED")} /> */}
              {/* <Button label="Reject" onClick={() => handleApproval(hoster.id, "REJECTED")} /> */}
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}