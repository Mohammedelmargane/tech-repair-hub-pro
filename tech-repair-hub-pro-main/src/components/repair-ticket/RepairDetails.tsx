
import React from 'react';
import { PaymentStatusBadge } from './StatusBadges';
import { formatDateTime, formatDate } from './DateFormatters';
import { Clock } from 'lucide-react';

interface RepairDetailsProps {
  repair: {
    serialNumber: string;
    paymentStatus?: string;
    estimatedCompletionDate?: string;
    estimatedCost: number;
    amountPaid?: number;
    finalCost: number | null;
    createdAt: string;
    updatedAt: string;
  };
  calculateTotalPartsValue: () => number;
  partsUsed: any[];
}

const RepairDetails: React.FC<RepairDetailsProps> = ({ 
  repair, 
  calculateTotalPartsValue,
  partsUsed
}) => {
  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <p className="text-xs text-muted-foreground">Serial Number</p>
        <p className="text-sm">{repair.serialNumber}</p>
      </div>
      
      <div className="flex items-center">
        <p className="text-xs text-muted-foreground mr-1">Payment</p>
        <PaymentStatusBadge paymentStatus={repair.paymentStatus || 'unpaid'} />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Est. Completion</p>
        <p className="text-sm flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {formatDate(repair.estimatedCompletionDate)}
        </p>
      </div>
      
      <div>
        <p className="text-xs text-muted-foreground">Cost Estimate</p>
        <p className="text-sm">${repair.estimatedCost.toFixed(2)}</p>
      </div>
      
      {repair.paymentStatus === 'partial' && (
        <div>
          <p className="text-xs text-muted-foreground">Amount Paid</p>
          <p className="text-sm">${repair.amountPaid?.toFixed(2) || '0.00'}</p>
        </div>
      )}
      
      {repair.finalCost !== null && (
        <div>
          <p className="text-xs text-muted-foreground">Final Cost</p>
          <p className="text-sm">${repair.finalCost.toFixed(2)}</p>
        </div>
      )}
      
      {partsUsed.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground">Parts Value</p>
          <p className="text-sm">${calculateTotalPartsValue().toFixed(2)}</p>
        </div>
      )}
      
      <div>
        <p className="text-xs text-muted-foreground">Created</p>
        <p className="text-sm">{formatDateTime(repair.createdAt)}</p>
      </div>
      
      <div>
        <p className="text-xs text-muted-foreground">Updated</p>
        <p className="text-sm">{formatDateTime(repair.updatedAt)}</p>
      </div>
    </div>
  );
};

export default RepairDetails;
