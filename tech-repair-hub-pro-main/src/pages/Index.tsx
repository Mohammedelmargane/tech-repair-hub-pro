// src/pages/Index.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from '@/components/Navbar';
// --- CustomerList import is no longer needed here ---
// import CustomerList from '@/components/CustomerList';
import RepairTicketCard from '@/components/RepairTicket';
import PrintLabel from '@/components/PrintLabel';
import RemindersPanel from '@/components/RemindersPanel';
import { useAuth } from '@/contexts/AuthContext';
import { repairs, getCustomerById, RepairTicket } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedRepair, setSelectedRepair] = useState<RepairTicket | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const pendingRepairs = repairs.filter(r => r.status === 'pending' || r.status === 'in-progress')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const completedRepairs = repairs.filter(r => r.status === 'completed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handlePrintLabel = (repair: RepairTicket) => {
    const customer = getCustomerById(repair.customerId);
    if (customer) {
      setSelectedRepair(repair);
      setSelectedCustomer({
        id: customer.id,
        name: customer.name
      });
      setShowPrintModal(true);
    }
  };

  // Iframe print function
  const handlePrint = () => {
    const labelContentElement = document.getElementById('printable-label-area');
    if (labelContentElement) {
      const printWindow = document.createElement('iframe');
      // Hide iframe
      printWindow.style.position = 'absolute'; printWindow.style.width = '0'; printWindow.style.height = '0'; printWindow.style.border = '0'; printWindow.style.overflow = 'hidden';
      document.body.appendChild(printWindow);
      // Write content
      printWindow.contentDocument?.write(`<!DOCTYPE html><html><head><title>Print Label</title><link rel="stylesheet" type="text/css" href="/src/index.css"><style>body { margin: 0; padding: 0; background-color: white; font-family: sans-serif; } @page { margin: 10mm; size: auto; } #printable-label-area { border: 2px solid black !important; padding: 5mm !important; background-color: white !important; color: black !important; width: calc(100% - 10mm); box-sizing: border-box; display: block !important; } #printable-label-area *, #printable-label-area p, #printable-label-area h2 { color: black !important; background-color: transparent !important; text-shadow: none !important; } #printable-label-area [data-radix-collection-item] { border: 1px solid black !important; background-color: transparent !important; color: black !important; padding: 1px 3px !important; display: inline-block !important; margin-left: 4px; }</style></head><body>${labelContentElement.innerHTML}</body></html>`);
      printWindow.contentDocument?.close();
      // Print and cleanup
      setTimeout(() => { /* ... print and cleanup logic ... */
         let printed = false; try { if (printWindow.contentWindow) { printWindow.contentWindow.focus(); printWindow.contentWindow.print(); printed = true; } else { throw new Error("Cannot access iframe content window."); } } catch (error) { console.error("Error printing iframe:", error); alert("Could not print the label due to an error."); } finally { requestAnimationFrame(() => { if (printWindow.parentNode === document.body) { document.body.removeChild(printWindow); } setShowPrintModal(false); }); }
       }, 500);
    } else { console.error("Could not find 'printable-label-area' element."); alert("Error preparing label for printing. Element not found."); setShowPrintModal(false); }
  };


  const canAccessReports = user?.role === 'admin';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2 items-center">
            {(user?.role === 'admin' || user?.role === 'customer_service') && (<RemindersPanel />)}
            {canAccessReports && (<Link to="/reports" className={buttonVariants({ variant: "outline" })}>Reports & Analytics</Link>)}
          </div>
        </div>

        {/* --- UPDATED GRID --- */}
        {/* Removed outer grid, let the content flow naturally or adjust as needed */}
        {/* If you still want columns, uncomment the grid div and adjust spans */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"> */}

          {/* Repair Info Section - Changed lg:col-span-8 to lg:col-span-12 if using grid */}
          {/* <div className="lg:col-span-12"> */}
          <div> {/* Using a simple div now */}
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="bg-muted/50"><CardTitle>Active Repairs</CardTitle></CardHeader>
                <CardContent className="pt-6"><p className="text-3xl font-bold">{pendingRepairs.length}</p><p className="text-muted-foreground">{pendingRepairs.filter(r => r.status === 'in-progress').length} in progress</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="bg-muted/50"><CardTitle>Completed Repairs</CardTitle></CardHeader>
                <CardContent className="pt-6"><p className="text-3xl font-bold">{completedRepairs.length}</p><p className="text-muted-foreground">This month</p></CardContent>
              </Card>
            </div>

             {/* Repair Tabs */}
            <Tabs defaultValue="active">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="active">Active Repairs</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                {(user?.role === 'admin' || user?.role === 'technician' || user?.role === 'customer_service') && (<Link to="/new-repair" className={buttonVariants({ variant: "default" })}>New Repair</Link>)}
              </div>
              {/* Active Repairs Tab */}
              <TabsContent value="active" className="space-y-6">
                 {pendingRepairs.length > 0 ? ( pendingRepairs.map((repair) => { const customer = getCustomerById(repair.customerId); return (<RepairTicketCard key={repair.id} repair={repair} showCustomerLink={true} customerName={customer?.name} onPrintLabel={handlePrintLabel} />); }) ) : ( <div className="text-center py-12 text-muted-foreground">No active repairs</div> )}
              </TabsContent>
              {/* Completed Repairs Tab */}
              <TabsContent value="completed" className="space-y-6">
                {completedRepairs.length > 0 ? ( completedRepairs.map((repair) => { const customer = getCustomerById(repair.customerId); return (<RepairTicketCard key={repair.id} repair={repair} showCustomerLink={true} customerName={customer?.name} onPrintLabel={handlePrintLabel} />); }) ) : ( <div className="text-center py-12 text-muted-foreground">No completed repairs</div> )}
              </TabsContent>
            </Tabs>
          </div>
          {/* --- END OF REPAIR INFO SECTION --- */}


          {/* --- CUSTOMER LIST COLUMN REMOVED --- */}
          {/*
          <div className="lg:col-span-4">
            <CustomerList />
          </div>
          */}
          {/* --- END OF REMOVED SECTION --- */}

        {/* </div> */} {/* End of the main grid div (if you keep it) */}
      </div>

      {/* PrintLabel Modal */}
      {showPrintModal && selectedRepair && selectedCustomer && (
        <PrintLabel
          repair={selectedRepair}
          customer={selectedCustomer}
          onClose={() => setShowPrintModal(false)}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}; // End of Dashboard component

export default Dashboard;