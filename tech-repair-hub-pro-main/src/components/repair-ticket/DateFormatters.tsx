
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

export const formatDateTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDetailedDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

interface DateDisplayProps {
  date?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  return (
    <p className="text-sm flex items-center">
      <Clock className="h-3 w-3 mr-1" />
      {formatDate(date)}
    </p>
  );
};
