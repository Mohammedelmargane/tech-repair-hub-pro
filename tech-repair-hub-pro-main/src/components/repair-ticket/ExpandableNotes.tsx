
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

interface ExpandableNotesProps {
  notes: string;
  internalNotes?: string;
  showInternalNotes?: boolean;
}

const ExpandableNotes: React.FC<ExpandableNotesProps> = ({ 
  notes, 
  internalNotes = "", 
  showInternalNotes = false 
}) => {
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [showFullInternalNotes, setShowFullInternalNotes] = useState(false);
  const { user } = useAuth();
  
  // Only technicians, customer service, and admins can see internal notes
  const canViewInternalNotes = user?.role === 'technician' || 
                               user?.role === 'customer_service' || 
                               user?.role === 'admin';
  
  if (!notes && (!internalNotes || !canViewInternalNotes)) return null;

  return (
    <div className="space-y-4">
      {notes && (
        <div>
          <p className="font-semibold mb-1">Customer Notes</p>
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
      )}
      
      {canViewInternalNotes && internalNotes && showInternalNotes && (
        <div>
          <p className="font-semibold mb-1 text-primary">Internal Notes</p>
          <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
            {showFullInternalNotes || internalNotes.length <= 100 
              ? internalNotes 
              : `${internalNotes.substring(0, 100)}...`}
            {internalNotes.length > 100 && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setShowFullInternalNotes(!showFullInternalNotes)}
                className="px-0 h-auto"
              >
                {showFullInternalNotes ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpandableNotes;
