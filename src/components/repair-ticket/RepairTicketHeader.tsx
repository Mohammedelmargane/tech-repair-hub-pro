
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './StatusBadges';

interface RepairTicketHeaderProps {
  repair: {
    id: string;
    deviceType: string;
    brand: string;
    model: string;
    status: string;
    priority?: string;
    customerId: string;
  };
  showCustomerLink?: boolean;
  customerName?: string;
}

const RepairTicketHeader: React.FC<RepairTicketHeaderProps> = ({ 
  repair, 
  showCustomerLink, 
  customerName 
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-lg">{repair.deviceType} - {repair.brand} {repair.model}</CardTitle>
        <CardDescription>Ticket: {repair.id}</CardDescription>
        {showCustomerLink && customerName && (
          <CardDescription>
            Customer: <Link to={`/customer/${repair.customerId}`} className="text-primary hover:underline">
              {customerName}
            </Link>
          </CardDescription>
        )}
      </div>
      <div className="flex gap-2">
        {repair.priority && (
          <PriorityBadge priority={repair.priority} />
        )}
        <StatusBadge status={repair.status} />
      </div>
    </div>
  );
};

export default RepairTicketHeader;
