
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { 
  Customer, 
  RepairTicket,
  addRepair, 
  updateRepair,
  customers
} from '@/data/mockData';

interface RepairFormProps {
  customerId?: string;
  repairToEdit?: RepairTicket;
}

const RepairForm: React.FC<RepairFormProps> = ({ customerId, repairToEdit }) => {
  const navigate = useNavigate();
  const isEditing = !!repairToEdit;
  
  const [formData, setFormData] = useState<{
    customerId: string;
    deviceType: string;
    brand: string;
    model: string;
    serialNumber: string;
    problemDescription: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    estimatedCost: number;
    finalCost: number | null;
    notes: string;
  }>({
    customerId: customerId || '',
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    problemDescription: '',
    status: 'pending',
    estimatedCost: 0,
    finalCost: null,
    notes: ''
  });

  useEffect(() => {
    if (repairToEdit) {
      setFormData({
        ...repairToEdit
      });
    }
  }, [repairToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && repairToEdit) {
        const updatedRepair = updateRepair({
          ...repairToEdit,
          ...formData
        });
        toast.success("Repair ticket updated");
        navigate(`/customer/${updatedRepair.customerId}`);
      } else {
        const newRepair = addRepair(formData);
        toast.success("Repair ticket created");
        navigate(`/customer/${newRepair.customerId}`);
      }
    } catch (error) {
      toast.error(isEditing ? "Failed to update repair" : "Failed to create repair");
      console.error(error);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Update Repair Ticket' : 'Create New Repair Ticket'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!customerId && (
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
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="problemDescription">Problem Description</Label>
              <Textarea 
                id="problemDescription" 
                name="problemDescription" 
                placeholder="Describe the issue with the device"
                value={formData.problemDescription}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
            
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
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                placeholder="Additional notes about the repair"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Repair' : 'Create Repair'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RepairForm;
