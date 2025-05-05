// src/pages/FinanceReportPage.tsx
import React, { useState, useMemo } from 'react'; // Removed useEffect, using useMemo
import { Link } from 'react-router-dom';
import { repairs as mockRepairs, customers as mockCustomers, Customer, RepairTicket } from '@/data/mockData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker"; // Assumes date-picker.tsx is in ui folder
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'; // Date functions
import { Calendar as CalendarIcon } from "lucide-react"; // Icon

// Interface for table data
interface FinanceReportEntry {
  repairId: string;
  customerName: string;
  amountPaid: number;
  technicianCommission: number;
  completedDate: Date | null; // Added date for potential sorting later
}

// Helper to format currency
const formatCurrency = (amount: number | null | undefined) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

// Helper to get customer name
const getCustomerName = (customerId: string): string => {
  const customer = mockCustomers.find(c => c.id === customerId);
  return customer ? customer.name : 'Unknown Customer';
};

// Helper to parse date safely
const parseDateSafe = (dateString: string): Date | null => {
     try {
         return parseISO(dateString);
     } catch (e) {
         console.error("Error parsing date:", dateString, e);
         return null;
     }
}

// The Page Component
export function FinanceReportPage() {
  // State for Date Range
  const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(endOfMonth(new Date()));

  // Calculate filtered data based on dates using useMemo
  const filteredReportData = useMemo(() => {
    // Start with completed and paid repairs
    const allCompletedAndPaid = mockRepairs.filter(
      (repair) => repair.status === 'completed' && repair.paymentStatus === 'paid' && repair.amountPaid && repair.amountPaid > 0
    );

    // Filter by the selected date range (using 'updatedAt', adjust if needed)
    const dateFiltered = allCompletedAndPaid.filter((repair) => {
      const repairDate = parseDateSafe(repair.updatedAt); // Use safe parsing
      if (!repairDate) return false; // Skip if date is invalid

      // Create interval checking end of day for endDate
      let interval: Interval | null = null;
      if (startDate && endDate) {
          const endOfDayEndDate = new Date(endDate);
          endOfDayEndDate.setHours(23, 59, 59, 999);
          interval = { start: startDate, end: endOfDayEndDate };
      } else if (startDate) {
          interval = { start: startDate, end: new Date(9999, 11, 31) }; // Effectively no end date
      } else if (endDate) {
          const endOfDayEndDate = new Date(endDate);
          endOfDayEndDate.setHours(23, 59, 59, 999);
          interval = { start: new Date(0), end: endOfDayEndDate }; // Effectively no start date
      }

      // Apply filter if interval is defined
      return interval ? isWithinInterval(repairDate, interval) : true;
    });

    // Map to the report entry structure
    return dateFiltered.map((repair): FinanceReportEntry => {
      const amountPaid = repair.amountPaid || 0;
      const commission = amountPaid * 0.30;
      return {
        repairId: repair.id,
        customerName: getCustomerName(repair.customerId),
        amountPaid: amountPaid,
        technicianCommission: commission,
        completedDate: parseDateSafe(repair.updatedAt) // Store parsed date
      };
    });
  }, [startDate, endDate]); // Recalculate only when dates change

  // Calculate totals based on the filtered data
  const totalPaid = filteredReportData.reduce((sum, entry) => sum + entry.amountPaid, 0);
  const totalCommission = filteredReportData.reduce((sum, entry) => sum + entry.technicianCommission, 0);

  // --- RENDER ---
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container py-6 flex-1">

        {/* Back to Dashboard Link */}
        <div className="mb-4">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              "text-sm"
            )}
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <Card className="w-full mx-auto">
          <CardHeader>
             {/* Header with Title and Date Pickers */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <CardTitle>Finance Report</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 items-center flex-wrap">
                 <DatePicker date={startDate} setDate={setStartDate} placeholder="Start Date" />
                 <span className="text-muted-foreground hidden sm:inline">-</span>
                 <DatePicker date={endDate} setDate={setEndDate} placeholder="End Date" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Showing completed & paid repairs updated between selected dates.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repair ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead className="text-right">Amount Paid</TableHead>
                    <TableHead className="text-right">Tech Commission (30%)</TableHead>
                    {/* Optional: Add Date Completed column */}
                    {/* <TableHead className="text-right">Date Completed</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReportData.length > 0 ? (
                    // Use filteredReportData for mapping
                    filteredReportData.map((entry) => (
                      <TableRow key={entry.repairId}>
                        <TableCell>{entry.repairId}</TableCell>
                        <TableCell>{entry.customerName}</TableCell>
                        <TableCell className="text-right">{formatCurrency(entry.amountPaid)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(entry.technicianCommission)}</TableCell>
                        {/* Optional: Render Date Completed */}
                         {/* <TableCell className="text-right">{entry.completedDate?.toLocaleDateString('en-US') ?? 'N/A'}</TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No results found for the selected period.
                      </TableCell>
                    </TableRow>
                  )}
                   {/* Totals Row */}
                   {filteredReportData.length > 0 && ( // Only show totals if there's data
                     <TableRow className="font-bold border-t bg-muted/50">
                        <TableCell colSpan={2}>Totals for Period</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalPaid)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalCommission)}</TableCell>
                        {/* Optional: Span totals row if date column is added */}
                        {/* <TableCell></TableCell>  */}
                     </TableRow>
                   )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination Controls Will Go Here */}
            <div className="mt-4 text-center text-muted-foreground">
                Pagination coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// If this is the main export for the page route:
// export default FinanceReportPage;