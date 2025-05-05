// src/components/PrintLabel.tsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RepairTicket } from '@/data/mockData';
import { Printer, Clock } from 'lucide-react';
import { cn } from '@/lib/utils'; // Make sure this import is present

interface PrintLabelProps {
  repair: RepairTicket | null;
  customer: {
    id: string;
    name: string;
  } | null;
  onPrint: () => void;
  onClose: () => void;
}

const PrintLabel: React.FC<PrintLabelProps> = ({ repair, customer, onPrint, onClose }) => {

  // Early return if data is missing
  if (!repair || !customer) {
    return null; // Just return null, don't render anything
  }

  // Helper functions defined inside the component
  const getPriorityClass = (priority?: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500'; // Default or fallback color
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not set';
    try {
      // Format as MM/DD/YYYY
      return new Date(dateString).toLocaleDateString('en-US');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const formatCreationDate = (dateString: string): string => {
     try {
      // Format as MM/DD/YYYY
      return new Date(dateString).toLocaleDateString('en-US');
    } catch (error) {
      console.error("Error formatting creation date:", error);
      return 'Invalid date';
    }
  }

  // Main component return
  return (
    <>
      {/* Overlay - hidden during print */}
      <div className="fixed inset-0 bg-black/50 z-40 no-print" onClick={onClose}></div>

      {/* Modal Container - hidden during print */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 no-print">
        <Card className="w-[400px] p-4">

          {/* --- This is the section that WILL be printed --- */}
          <div id="printable-label-area" className="p-4 border-2 border-dashed border-gray-300 mb-4">
            <div className="text-center mb-4">
              <h2 className="font-bold text-xl">PC Repair Hub Pro</h2>
              <p className="text-sm text-muted-foreground">Repair Ticket</p>
            </div>

            <div className="space-y-2 mb-4">
              {/* Customer Info */}
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-semibold">{customer.name} ({customer.id})</p>
              </div>

              {/* Ticket ID */}
              <div>
                <p className="text-xs text-muted-foreground">Ticket ID</p>
                <p className="font-semibold">{repair.id}</p>
              </div>

              {/* Priority and Est. Completion */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge className={cn(getPriorityClass(repair.priority), 'text-white print:border print:border-black print:bg-transparent print:text-black')}>
                    {(repair.priority || 'MEDIUM').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Completion</p>
                  <p className="font-medium text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(repair.estimatedCompletionDate)}
                  </p>
                </div>
              </div>

              {/* Device Info */}
              <div>
                <p className="text-xs text-muted-foreground">Device</p>
                <p className="font-semibold">{repair.deviceType} - {repair.brand} {repair.model}</p>
              </div>

              {/* Serial Number */}
              <div>
                <p className="text-xs text-muted-foreground">Serial Number</p>
                <p className="font-medium text-sm">{repair.serialNumber || 'N/A'}</p>
              </div>

              {/* Creation Date */}
              <div>
                <p className="text-xs text-muted-foreground">Date Created</p>
                <p className="text-sm">{formatCreationDate(repair.createdAt)}</p>
              </div>

              {/* Issue Description */}
              <div className="border-t border-gray-300 pt-2">
                <p className="text-xs text-muted-foreground">Issue Description</p>
                <p className="text-sm">{repair.problemDescription}</p>
              </div>
            </div>
          </div>
          {/* --- End of printable section --- */}

          {/* Buttons Container - hidden during print */}
          <div className="flex justify-between no-print">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onPrint} className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Print Label
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PrintLabel;