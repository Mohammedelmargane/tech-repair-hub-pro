
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRepairForm } from '@/contexts/RepairFormContext';

const NotesSection: React.FC = () => {
  const { formData, handleChange } = useRepairForm();

  return (
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
  );
};

export default NotesSection;
