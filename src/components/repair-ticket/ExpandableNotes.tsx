
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface ExpandableNotesProps {
  notes: string;
}

const ExpandableNotes: React.FC<ExpandableNotesProps> = ({ notes }) => {
  const [showFullNotes, setShowFullNotes] = useState(false);

  if (!notes) return null;

  return (
    <div>
      <p className="font-semibold mb-1">Notes</p>
      <p className="text-sm text-muted-foreground">
        {showFullNotes || notes.length <= 100 
          ? notes 
          : `${notes.substring(0, 100)}...`}
        {notes.length > 100 && (
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => setShowFullNotes(!showFullNotes)}
            className="px-0 h-auto"
          >
            {showFullNotes ? 'Show Less' : 'Show More'}
          </Button>
        )}
      </p>
    </div>
  );
};

export default ExpandableNotes;
