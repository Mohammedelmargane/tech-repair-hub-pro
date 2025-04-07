
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RepairTicket } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { Printer, AlertCircle, Clock, CreditCard, History, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhatsAppMessage from './WhatsAppMessage';

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
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [showAllRepairNotes, setShowAllRepairNotes] = useState(false);

  // Parse repair notes if they exist
  const repairNotes = repair.repairNotes ? JSON.parse(repair.repairNotes) : [];
  
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'pending': return 'repair-status-pending';
      case 'in-progress': return 'repair-status-in-progress';
      case 'completed': return 'repair-status-completed';
      case 'cancelled': return 'repair-status-cancelled';
      default: return '';
    }
  };

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusClass = (status: string): string => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'unpaid': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const formatDateTime = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
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

  const formatDetailedDate = (dateString: string) => {
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
          <div className="flex gap-2">
            {repair.priority && (
              <Badge className={getPriorityClass(repair.priority)}>
                {repair.priority.charAt(0).toUpperCase() + repair.priority.slice(1)} Priority
              </Badge>
            )}
            <Badge className={getStatusClass(repair.status)}>
              {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
            </Badge>
          </div>
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
          
          <div className="flex items-center">
            <p className="text-xs text-muted-foreground mr-1">Payment</p>
            <Badge className={getPaymentStatusClass(repair.paymentStatus || 'unpaid')}>
              {repair.paymentStatus ? (repair.paymentStatus.charAt(0).toUpperCase() + repair.paymentStatus.slice(1)) : 'Unpaid'}
            </Badge>
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
            <p className="text-sm text-muted-foreground">
              {showFullNotes || repair.notes.length <= 100 
                ? repair.notes 
                : `${repair.notes.substring(0, 100)}...`}
              {repair.notes.length > 100 && (
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
        
        {repairNotes.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <p className="font-semibold mb-1">Repair History</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllRepairNotes(!showAllRepairNotes)}
                className="text-xs h-auto py-1"
              >
                <History className="h-3 w-3 mr-1" />
                {showAllRepairNotes ? 'Hide History' : 'Show History'}
              </Button>
            </div>
            
            {showAllRepairNotes && (
              <div className="space-y-2 pl-2 border-l-2 border-muted mt-2">
                {repairNotes.map((note: any, index: number) => (
                  <div key={index} className="text-sm">
                    <p className="text-xs text-muted-foreground">
                      {formatDetailedDate(note.timestamp)} - {note.technician}
                    </p>
                    <p>{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
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
      </CardFooter>
    </Card>
  );
};

export default RepairTicketCard;
