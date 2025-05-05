
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import { useRepairForm } from '@/contexts/RepairFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator"; // Fixed import path

interface RepairNote {
  timestamp: string;
  text: string;
  technician: string;
}

const NotesSection: React.FC = () => {
  const { formData, handleChange, setFormData } = useRepairForm();
  const [newNote, setNewNote] = useState('');
  
  // Parse existing notes or initialize as empty array
  const existingNotes: RepairNote[] = formData.repairNotes 
    ? JSON.parse(formData.repairNotes)
    : [];
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const newNoteObject: RepairNote = {
      timestamp: new Date().toISOString(),
      text: newNote,
      technician: 'Current User', // In a real app, this would be the logged-in user
    };
    
    const updatedNotes = [...existingNotes, newNoteObject];
    
    // Update the form data with the stringified notes
    setFormData({
      ...formData,
      repairNotes: JSON.stringify(updatedNotes)
    });
    
    // Clear the input field
    setNewNote('');
  };
  
  const handleDeleteNote = (index: number) => {
    const updatedNotes = [...existingNotes];
    updatedNotes.splice(index, 1);
    
    setFormData({
      ...formData,
      repairNotes: JSON.stringify(updatedNotes)
    });
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="space-y-2">
        <Label htmlFor="notes">General Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          placeholder="Additional notes about the repair"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Repair History Notes</h3>
        
        <div className="flex gap-2">
          <Textarea 
            placeholder="Add a detailed note about this repair (parts replaced, troubleshooting steps, etc.)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
            className="flex-1"
          />
          <Button 
            type="button" 
            size="icon"
            onClick={handleAddNote}
            className="h-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {existingNotes.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {existingNotes.map((note, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="text-xs text-muted-foreground mb-1">
                      {formatDate(note.timestamp)} - {note.technician}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteNote(index)}
                      className="h-6 w-6 absolute top-1 right-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No repair history notes yet</p>
        )}
      </div>
    </div>
  );
};

export default NotesSection;
