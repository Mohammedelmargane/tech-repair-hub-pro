
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RepairTicket } from '@/data/mockData';
import { getPartById } from '@/data/mockData';

// Import our new component modules
import RepairTicketHeader from './repair-ticket/RepairTicketHeader';
import RepairDetails from './repair-ticket/RepairDetails';
import ExpandableNotes from './repair-ticket/ExpandableNotes';
import PartsUsedSection from './repair-ticket/PartsUsedSection';
import RepairHistory from './repair-ticket/RepairHistory';
import RepairTicketFooter from './repair-ticket/RepairTicketFooter';

interface RepairTicketCardProps {
  repair: RepairTicket;
  showCustomerLink?: boolean;
  customerName?: string;
  onPrintLabel: (repair: RepairTicket) => void;
}

const RepairTicketCard: React.FC<RepairTicketCardProps> = ({ 
  repair, 
  showCustomerLink = false,
  customerName,
  onPrintLabel 
}) => {
  // Parse repair notes if they exist
  const repairNotes = repair.repairNotes ? JSON.parse(repair.repairNotes) : [];
  
  // Parse parts used if they exist
  const partsUsed = repair.partsUsed ? JSON.parse(repair.partsUsed) : [];
  
  const calculateTotalPartsValue = () => {
    return partsUsed.reduce((total: number, item: { partId: string, quantity: number }) => {
      const part = getPartById(item.partId);
      return total + (part ? part.price * item.quantity : 0);
    }, 0);
  };
  
  return (
    <Card>
      <CardHeader>
        <RepairTicketHeader 
          repair={repair} 
          showCustomerLink={showCustomerLink} 
          customerName={customerName} 
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-semibold mb-1">Problem</p>
          <p className="text-sm text-muted-foreground">{repair.problemDescription}</p>
        </div>
        
        <RepairDetails 
          repair={repair} 
          calculateTotalPartsValue={calculateTotalPartsValue} 
          partsUsed={partsUsed} 
        />
        
        <ExpandableNotes notes={repair.notes} />
        
        <PartsUsedSection 
          partsUsed={partsUsed} 
          calculateTotalPartsValue={calculateTotalPartsValue} 
        />
        
        <RepairHistory repairNotes={repairNotes} />
      </CardContent>
      <CardFooter>
        <RepairTicketFooter repair={repair} onPrintLabel={onPrintLabel} />
      </CardFooter>
    </Card>
  );
};

export default RepairTicketCard;
