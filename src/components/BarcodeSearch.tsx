
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { getCustomerById } from '@/data/mockData';
import { Barcode } from 'lucide-react';

const BarcodeSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus on the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      toast.warning("Please enter a customer ID");
      return;
    }
    
    // Check if customer exists
    const customer = getCustomerById(searchId);
    
    if (customer) {
      toast.success(`Found customer: ${customer.name}`);
      navigate(`/customer/${customer.id}`);
    } else {
      toast.error("No customer found with that ID");
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Barcode className="h-12 w-12 mx-auto text-primary mb-2" />
        <CardTitle>Barcode Customer Search</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchId">Customer ID</Label>
            <Input 
              id="searchId" 
              ref={inputRef}
              placeholder="Enter or scan customer ID (e.g. C001)" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="text-center text-lg"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Search
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BarcodeSearch;
