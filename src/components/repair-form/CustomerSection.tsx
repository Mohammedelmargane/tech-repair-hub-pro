
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRepairForm } from '@/contexts/RepairFormContext';
import { Customer, customers } from '@/data/mockData';

const CustomerSection: React.FC = () => {
  const { formData, handleSelectChange, isEditing } = useRepairForm();

  return (
    <div className="space-y-2">
      <Label htmlFor="customerId">Customer</Label>
      <Select 
        value={formData.customerId} 
        onValueChange={(value) => handleSelectChange('customerId', value)}
        disabled={isEditing}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((customer: Customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} ({customer.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomerSection;
