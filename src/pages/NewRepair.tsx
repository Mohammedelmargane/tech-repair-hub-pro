import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import CustomerForm from '@/components/CustomerForm';
import RepairForm from '@/components/RepairForm';

const NewRepair: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('existing');
  
  // Check if a customerId was passed in the URL
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('customerId');
  
  useEffect(() => {
    // If customerId is provided, we're creating a repair for an existing customer
    if (customerId) {
      setActiveTab('repair');
    }
  }, [customerId]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="container py-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Create New Repair</h1>
        
        {customerId ? (
          // If we have a customerId, just show the repair form
          <RepairForm customerId={customerId} />
        ) : (
          // Otherwise, show tabs to choose between existing or new customer
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="existing">Existing Customer</TabsTrigger>
              <TabsTrigger value="new">New Customer</TabsTrigger>
              <TabsTrigger value="repair" disabled={!customerId}>
                Repair Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="space-y-4">
              <p className="text-muted-foreground">
                Please select an existing customer from the dashboard, or create a new customer.
              </p>
            </TabsContent>
            
            <TabsContent value="new">
              <CustomerForm />
            </TabsContent>
            
            <TabsContent value="repair">
              <RepairForm customerId={customerId || ''} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default NewRepair;
