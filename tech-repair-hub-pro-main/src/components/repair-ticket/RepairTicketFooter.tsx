
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Printer, MessageSquare } from 'lucide-react';
import WhatsAppMessage from '../WhatsAppMessage';
import { RepairTicket } from '@/data/mockData';

interface RepairTicketFooterProps {
  repair: RepairTicket;
  onPrintLabel: (repair: RepairTicket) => void;
}

const RepairTicketFooter: React.FC<RepairTicketFooterProps> = ({ 
  repair, 
  onPrintLabel 
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <WhatsAppMessage customerId={repair.customerId} repairId={repair.id} />
      
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onPrintLabel(repair)}
      >
        <Printer className="h-4 w-4" />
        Print Label
      </Button>
      
      <Button size="sm" asChild>
        <Link to={`/edit-repair/${repair.id}`}>Update Status</Link>
      </Button>
    </div>
  );
};

export default RepairTicketFooter;
