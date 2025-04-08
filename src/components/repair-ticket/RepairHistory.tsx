
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { History } from 'lucide-react';
import { formatDetailedDate } from './DateFormatters';

interface RepairHistoryProps {
  repairNotes: any[];
}

const RepairHistory: React.FC<RepairHistoryProps> = ({ repairNotes }) => {
  const [showAllRepairNotes, setShowAllRepairNotes] = useState(false);
  
  if (repairNotes.length === 0) return null;
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-semibold mb-1">Repair History</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllRepairNotes(!showAllRepairNotes)}
          className="text-xs h-auto py-1"
        >
          <History className="h-3 w-3 mr-1" />
          {showAllRepairNotes ? 'Hide History' : 'Show History'}
        </Button>
      </div>
      
      {showAllRepairNotes && (
        <div className="space-y-2 pl-2 border-l-2 border-muted mt-2">
          {repairNotes.map((note, index) => (
            <div key={index} className="text-sm">
              <p className="text-xs text-muted-foreground">
                {formatDetailedDate(note.timestamp)} - {note.technician}
              </p>
              <p>{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepairHistory;
