
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from '@/components/Navbar';
import RepairTicketCard from '@/components/RepairTicket';
import PrintLabel from '@/components/PrintLabel';
import { getCustomerById, getRepairsByCustomerId, Customer as CustomerType, RepairTicket } from '@/data/mockData';
import { FileText, Printer, AlertCircle } from 'lucide-react';

const Customer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [selectedRepair, setSelectedRepair] = useState<RepairTicket | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const foundCustomer = getCustomerById(id);
      const customerRepairs = id ? getRepairsByCustomerId(id) : [];
      
      setCustomer(foundCustomer || null);
      setRepairs(customerRepairs);
      setLoading(false);
    }
  }, [id]);
  
  const handlePrintLabel = (repair: RepairTicket) => {
    if (customer) {
      setSelectedRepair(repair);
      setShowPrintModal(true);
    }
  };
  
  const handlePrint = () => {
    window.print();
    setShowPrintModal(false);
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container py-12 flex-1">
          <p className="text-center">Loading customer details...</p>
        </div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container py-12 flex-1">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Customer not found. The ID "{id}" does not exist in our system.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link to="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="container py-6 flex-1">
        <div className="mb-6">
          <Link to="/" className="text-primary hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{customer.name}</CardTitle>
                  <CardDescription>Customer ID: {customer.id}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link to={`/new-repair?customerId=${customer.id}`} className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      New Repair
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print History
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p>{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                  <p>{customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                  <p>{customer.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Repair History</h2>
          
          {repairs.length > 0 ? (
            <div className="space-y-6">
              {repairs.map((repair) => (
                <RepairTicketCard 
                  key={repair.id} 
                  repair={repair}
                  onPrintLabel={handlePrintLabel}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">No repair history found for this customer</p>
                <Button asChild>
                  <Link to={`/new-repair?customerId=${customer.id}`}>Create First Repair</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {showPrintModal && (
        <PrintLabel
          repair={selectedRepair}
          customer={customer ? { id: customer.id, name: customer.name } : null}
          onPrint={handlePrint}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

export default Customer;
