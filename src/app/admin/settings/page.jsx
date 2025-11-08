"use client";
import { useState } from "react";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";

export default function VehicleInspectionChecklist() {
  const [inspections, setInspections] = useState({});
  const [remarks, setRemarks] = useState({});
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const checklistData = {
    "Exterior Condition": [
      "Scratches / Dents",
      "Paint Condition",
      "Windshield (cracks/chips)",
      "Windows & Mirrors",
      "Headlights / Taillights / Indicators",
      "Bumpers & Body Panels"
    ],
    "Tires & Wheels": [
      "Tire Tread Depth",
      "Tire Pressure",
      "Spare Tire Condition",
      "Wheel Alignment",
      "Rims / Alloy Condition"
    ],
    "Interior Condition": [
      "Seats (fabric/leather condition)",
      "Dashboard & Controls",
      "Seat Belts (functionality)",
      "AC / Heater Working",
      "Infotainment / Audio System",
      "Odor / Cleanliness"
    ],
    "Engine & Fluids": [
      "Engine Oil Level & Quality",
      "Coolant Level",
      "Brake Fluid",
      "Transmission Fluid",
      "Battery Health",
      "Fuel Level"
    ],
    "Brakes & Suspension": [
      "Brake Pads",
      "Brake Discs / Drums",
      "Suspension Noise",
      "Shock Absorbers",
      "Steering Alignment"
    ],
    "Lights & Electricals": [
      "Headlights High/Low Beam",
      "Indicators / Hazards",
      "Cabin Lights",
      "Horn",
      "Power Windows",
      "Wipers / Washer Fluid"
    ],
    "Safety & Documents": [
      "Insurance Papers",
      "Registration Certificate (RC)",
      "Pollution Certificate (PUC)",
      "Roadside Emergency Kit (jack, tools, first-aid)",
      "Fire Extinguisher"
    ]
  };

  // Toggle inspection status
  const toggleInspection = (category, item) => {
    const key = `${category}-${item}`;
    setInspections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Add remarks
  const addRemarks = (category, item) => {
    const key = `${category}-${item}`;
    setCurrentItem({ category, item, key });
    setShowRemarksDialog(true);
  };

  // Save remarks
  const saveRemarks = () => {
    if (currentItem) {
      setRemarks(prev => ({
        ...prev,
        [currentItem.key]: prev[currentItem.key] || ""
      }));
    }
    setShowRemarksDialog(false);
  };

  // Calculate completion percentages
  const getCategoryCompletion = (category) => {
    const items = checklistData[category];
    const inspectedCount = items.filter(item => 
      inspections[`${category}-${item}`]
    ).length;
    return Math.round((inspectedCount / items.length) * 100);
  };

  const totalItems = Object.values(checklistData).flat().length;
  const completedItems = Object.keys(inspections).filter(key => inspections[key]).length;
  const overallCompletion = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="p-fluid p-3">
      {/* Header with Progress */}
      <Card className="mb-4">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-color)' }}>
            Vehicle Inspection Checklist
          </h1>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{overallCompletion}% Complete</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>
              {completedItems} of {totalItems} items inspected
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <ProgressBar 
          value={overallCompletion} 
          style={{ height: '8px' }}
          showValue={false}
        />
      </Card>

      {/* Checklist Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {Object.entries(checklistData).map(([category, items]) => {
          const completion = getCategoryCompletion(category);
          
          return (
            <Card key={category} className="shadow-2">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: 'var(--text-color)' }}>
                  {category}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>
                    {completion}% complete
                  </span>
                  <i className={completion === 100 ? "pi pi-check-circle text-green-500" : "pi pi-circle text-gray-300"}></i>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item) => {
                  const key = `${category}-${item}`;
                  const isInspected = inspections[key];
                  const itemRemarks = remarks[key];

                  return (
                    <div 
                      key={key} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        border: '1px solid var(--surface-300)',
                        borderRadius: '6px',
                        backgroundColor: isInspected ? 'var(--green-50)' : 'var(--surface-0)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <Checkbox
                          checked={isInspected}
                          onChange={() => toggleInspection(category, item)}
                        />
                        <span style={{ 
                          color: isInspected ? 'var(--text-color-secondary)' : 'var(--text-color)',
                          textDecoration: isInspected ? 'line-through' : 'none'
                        }}>
                          {item}
                        </span>
                        {itemRemarks && (
                          <i 
                            className="pi pi-comment text-blue-500 cursor-pointer"
                            onClick={() => addRemarks(category, item)}
                            title="View remarks"
                            style={{ marginLeft: '0.5rem' }}
                          ></i>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Button
                          icon="pi pi-comment"
                          className="p-button-text p-button-sm"
                          onClick={() => addRemarks(category, item)}
                          tooltip="Add remarks"
                        />
                        <i 
                          className={isInspected ? "pi pi-check-circle text-green-500" : "pi pi-circle text-gray-300"} 
                          style={{ fontSize: '1.2rem' }}
                        ></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Remarks Dialog */}
      <Dialog
        header={currentItem ? `Remarks for ${currentItem.item}` : 'Add Remarks'}
        visible={showRemarksDialog}
        onHide={() => setShowRemarksDialog(false)}
        style={{ width: '400px' }}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="remarks" className="font-bold block mb-2">Remarks</label>
            <InputTextarea
              id="remarks"
              value={currentItem ? remarks[currentItem.key] || "" : ""}
              onChange={(e) => {
                if (currentItem) {
                  setRemarks(prev => ({
                    ...prev,
                    [currentItem.key]: e.target.value
                  }));
                }
              }}
              rows={4}
              placeholder="Enter your remarks here..."
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button
              label="Save"
              icon="pi pi-check"
              className="p-button-primary"
              onClick={saveRemarks}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => setShowRemarksDialog(false)}
            />
          </div>
        </div>
      </Dialog>

      {/* Action Buttons */}
      <div style={{ 
        position: 'fixed', 
        bottom: '1.5rem', 
        right: '1.5rem', 
        display: 'flex', 
        gap: '0.5rem',
        zIndex: 1000
      }}>
        <Button
          label="Submit Inspection"
          icon="pi pi-check"
          className="p-button-success"
          disabled={overallCompletion < 100}
          tooltip={overallCompletion < 100 ? "Complete all items to submit" : "Submit inspection"}
        />
        <Button
          label="Save Draft"
          icon="pi pi-save"
          className="p-button-primary"
        />
      </div>
    </div>
  );
}