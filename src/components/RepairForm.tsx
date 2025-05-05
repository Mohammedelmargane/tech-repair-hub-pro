
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { RepairTicket, addRepair, updateRepair, updatePartStock } from '@/data/mockData';
import { RepairFormProvider, useRepairForm } from '@/contexts/RepairFormContext';

// Import form sections
import CustomerSection from './repair-form/CustomerSection';
import DeviceInfoSection from './repair-form/DeviceInfoSection';
import PriorityAndDateSection from './repair-form/PriorityAndDateSection';
import ProblemDescriptionSection from './repair-form/ProblemDescriptionSection';
import CostAndStatusSection from './repair-form/CostAndStatusSection';
import NotesSection from './repair-form/NotesSection';
import PartsUsedSection from './repair-form/PartsUsedSection';

interface RepairFormProps {
  customerId?: string;
  repairToEdit?: RepairTicket;
}

// Inner component that uses the context
const RepairFormContent: React.FC = () => {
  const navigate = useNavigate();
  const { formData, isEditing } = useRepairForm();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        const updatedRepair = updateRepair({
          ...formData as RepairTicket
        });
        
        // If repair is completed, deduct parts from inventory
        if (updatedRepair.status === 'completed' && updatedRepair.partsUsed) {
          try {
            const partsUsed = JSON.parse(updatedRepair.partsUsed);
            partsUsed.forEach((item: { partId: string, quantity: number }) => {
              // Negative quantity because we're removing from stock
              updatePartStock(item.partId, -item.quantity);
            });
            toast.success("Inventory updated");
          } catch (error) {
            console.error("Error updating inventory:", error);
            toast.error("Failed to update inventory");
          }
        }
        
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
          {!formData.customerId && <CustomerSection />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DeviceInfoSection />
            <PriorityAndDateSection />
            <ProblemDescriptionSection />
            <CostAndStatusSection />
          </div>
          
          <PartsUsedSection />
          
          <NotesSection />
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

// The main component that provides the context
const RepairForm: React.FC<RepairFormProps> = ({ customerId, repairToEdit }) => {
  return (
    <RepairFormProvider customerId={customerId} repairToEdit={repairToEdit}>
      <RepairFormContent />
    </RepairFormProvider>
  );
};

export default RepairForm;
