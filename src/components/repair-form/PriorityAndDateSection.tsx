
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRepairForm } from '@/contexts/RepairFormContext';

const PriorityAndDateSection: React.FC = () => {
  const { formData, handleChange, handleSelectChange } = useRepairForm();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select 
          value={formData.priority} 
          onValueChange={(value: 'low' | 'medium' | 'high') => 
            handleSelectChange('priority', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedCompletionDate">Estimated Completion Date</Label>
        <Input 
          id="estimatedCompletionDate" 
          name="estimatedCompletionDate" 
          type="date"
          value={formData.estimatedCompletionDate}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );
};

export default PriorityAndDateSection;
