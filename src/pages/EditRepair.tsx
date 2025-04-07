
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import RepairForm from '@/components/RepairForm';
import { getRepairById, RepairTicket } from '@/data/mockData';
import { AlertCircle } from 'lucide-react';

const EditRepair: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [repair, setRepair] = useState<RepairTicket | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const foundRepair = getRepairById(id);
      setRepair(foundRepair);
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container py-12 flex-1">
          <p className="text-center">Loading repair details...</p>
        </div>
      </div>
    );
  }
  
  if (!repair) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container py-12 flex-1">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Repair not found. The ID "{id}" does not exist in our system.
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
        <Link to={`/customer/${repair.customerId}`} className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to Customer
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Edit Repair Ticket</h1>
        
        <RepairForm repairToEdit={repair} />
      </div>
    </div>
  );
};

export default EditRepair;
