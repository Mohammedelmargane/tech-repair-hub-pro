
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'pending': return 'repair-status-pending';
      case 'in-progress': return 'repair-status-in-progress';
      case 'completed': return 'repair-status-completed';
      case 'cancelled': return 'repair-status-cancelled';
      default: return '';
    }
  };

  return (
    <Badge className={getStatusClass(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Badge className={getPriorityClass(priority)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </Badge>
  );
};

interface PaymentStatusBadgeProps {
  paymentStatus: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ paymentStatus }) => {
  const getPaymentStatusClass = (status: string): string => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'unpaid': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Badge className={getPaymentStatusClass(paymentStatus)}>
      {paymentStatus ? (paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)) : 'Unpaid'}
    </Badge>
  );
};
