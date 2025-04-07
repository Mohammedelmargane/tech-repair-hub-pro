
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRepairForm } from '@/contexts/RepairFormContext';

const ProblemDescriptionSection: React.FC = () => {
  const { formData, handleChange } = useRepairForm();

  return (
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
  );
};

export default ProblemDescriptionSection;
