
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRepairForm } from '@/contexts/RepairFormContext';

const CostAndStatusSection: React.FC = () => {
  const { formData, handleNumberChange, handleSelectChange, setFormData } = useRepairForm();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
        <Input 
          id="estimatedCost" 
          name="estimatedCost" 
          type="number"
          min="0"
          step="0.01"
          value={formData.estimatedCost}
          onChange={handleNumberChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value: 'pending' | 'in-progress' | 'completed' | 'cancelled') => 
            handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select 
          value={formData.paymentStatus} 
          onValueChange={(value: 'unpaid' | 'partial' | 'paid') => 
            handleSelectChange('paymentStatus', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="partial">Partial Payment</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amountPaid">Amount Paid ($)</Label>
        <Input 
          id="amountPaid" 
          name="amountPaid" 
          type="number"
          min="0"
          step="0.01"
          value={formData.amountPaid}
          onChange={handleNumberChange}
          required
        />
      </div>
      
      {formData.status === 'completed' && (
        <div className="space-y-2">
          <Label htmlFor="finalCost">Final Cost ($)</Label>
          <Input 
            id="finalCost" 
            name="finalCost" 
            type="number"
            min="0"
            step="0.01"
            value={formData.finalCost || ''}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                finalCost: value === '' ? null : parseFloat(value)
              }));
            }}
          />
        </div>
      )}
    </>
  );
};

export default CostAndStatusSection;
