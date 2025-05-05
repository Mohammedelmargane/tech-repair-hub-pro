
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRepairForm } from '@/contexts/RepairFormContext';

const DeviceInfoSection: React.FC = () => {
  const { formData, handleChange } = useRepairForm();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="deviceType">Device Type</Label>
        <Input 
          id="deviceType" 
          name="deviceType" 
          placeholder="Laptop, Desktop, etc."
          value={formData.deviceType}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input 
          id="brand" 
          name="brand" 
          placeholder="Dell, HP, Apple, etc."
          value={formData.brand}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input 
          id="model" 
          name="model" 
          placeholder="XPS 15, ThinkPad X1, etc."
          value={formData.model}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="serialNumber">Serial Number</Label>
        <Input 
          id="serialNumber" 
          name="serialNumber" 
          placeholder="SN12345678"
          value={formData.serialNumber}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );
};

export default DeviceInfoSection;
