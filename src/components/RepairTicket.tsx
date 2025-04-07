
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RepairTicket } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'pending': return 'repair-status-pending';
      case 'in-progress': return 'repair-status-in-progress';
      case 'completed': return 'repair-status-completed';
      case 'cancelled': return 'repair-status-cancelled';
      default: return '';
    }
  };
  
  const formatDateTime = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card>
      <CardHeader>
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
          <Badge className={getStatusClass(repair.status)}>
            {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-semibold mb-1">Problem</p>
          <p className="text-sm text-muted-foreground">{repair.problemDescription}</p>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Serial Number</p>
            <p className="text-sm">{repair.serialNumber}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Cost Estimate</p>
            <p className="text-sm">${repair.estimatedCost.toFixed(2)}</p>
          </div>
          
          {repair.finalCost !== null && (
            <div>
              <p className="text-xs text-muted-foreground">Final Cost</p>
              <p className="text-sm">${repair.finalCost.toFixed(2)}</p>
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
        
        {repair.notes && (
          <div>
            <p className="font-semibold mb-1">Notes</p>
            <p className="text-sm text-muted-foreground">{repair.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
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
      </CardFooter>
    </Card>
  );
};

export default RepairTicketCard;
