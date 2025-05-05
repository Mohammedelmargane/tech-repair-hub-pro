
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RepairTicket } from '@/data/mockData';
import { Printer, Clock } from 'lucide-react';

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
  if (!repair || !customer) {
    return null;
  }
  
  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Card className="w-[400px] p-4">
          <div className="p-4 border-2 border-dashed border-gray-300 mb-4">
            <div className="text-center mb-4">
              <h2 className="font-bold text-xl">PC Repair Hub Pro</h2>
              <p className="text-sm text-muted-foreground">Repair Ticket</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-semibold">{customer.name} ({customer.id})</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Ticket ID</p>
                <p className="font-semibold">{repair.id}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge className={getPriorityClass(repair.priority || 'medium')}>
                    {repair.priority ? repair.priority.toUpperCase() : 'MEDIUM'}
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
              
              <div>
                <p className="text-xs text-muted-foreground">Device</p>
                <p className="font-semibold">{repair.deviceType} - {repair.brand} {repair.model}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Serial Number</p>
                <p className="font-medium text-sm">{repair.serialNumber}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm">{new Date(repair.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="border-t border-gray-300 pt-2">
                <p className="text-xs text-muted-foreground">Issue Description</p>
                <p className="text-sm">{repair.problemDescription}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
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
