
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from '@/components/Navbar';
import CustomerList from '@/components/CustomerList';
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
  
  const handlePrint = () => {
    window.print();
    setShowPrintModal(false);
  };
  
  // Check if user has permission to see reports
  const canAccessReports = user?.role === 'admin';
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="container py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          <div className="flex gap-2 items-center">
            {/* Only show reminders to those who need to see them */}
            {(user?.role === 'admin' || user?.role === 'customer_service') && (
              <RemindersPanel />
            )}
            
            {/* Only show reports link to admins */}
            {canAccessReports && (
              <Link to="/reports" className={buttonVariants({ variant: "outline" })}>
                Reports & Analytics
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle>Active Repairs</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold">
                    {pendingRepairs.length}
                  </p>
                  <p className="text-muted-foreground">
                    {pendingRepairs.filter(r => r.status === 'in-progress').length} in progress
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle>Completed Repairs</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold">
                    {completedRepairs.length}
                  </p>
                  <p className="text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="active">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="active">Active Repairs</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                {/* Only show new repair button to authorized roles */}
                {(user?.role === 'admin' || user?.role === 'technician' || user?.role === 'customer_service') && (
                  <Link to="/new-repair" className={buttonVariants({ variant: "default" })}>
                    New Repair
                  </Link>
                )}
              </div>
              
              <TabsContent value="active" className="space-y-6">
                {pendingRepairs.length > 0 ? (
                  pendingRepairs.map((repair) => {
                    const customer = getCustomerById(repair.customerId);
                    return (
                      <RepairTicketCard 
                        key={repair.id} 
                        repair={repair} 
                        showCustomerLink={true}
                        customerName={customer?.name}
                        onPrintLabel={handlePrintLabel}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No active repairs
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-6">
                {completedRepairs.length > 0 ? (
                  completedRepairs.map((repair) => {
                    const customer = getCustomerById(repair.customerId);
                    return (
                      <RepairTicketCard 
                        key={repair.id} 
                        repair={repair} 
                        showCustomerLink={true}
                        customerName={customer?.name}
                        onPrintLabel={handlePrintLabel}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No completed repairs
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-4">
            <CustomerList />
          </div>
        </div>
      </div>
      
      {showPrintModal && (
        <PrintLabel
          repair={selectedRepair}
          customer={selectedCustomer}
          onClose={() => setShowPrintModal(false)}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default Dashboard;
