import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Import Button and buttonVariants
import { Button, buttonVariants } from "@/components/ui/button"; // Keep buttonVariants import
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Customer, customers } from "@/data/mockData";
// Keep cn import if you use it elsewhere, otherwise it could be removed
import { cn } from '@/lib/utils';

const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <Card className="w-full">
      <CardHeader className="bg-muted/50">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-start sm:items-baseline gap-2">
          <CardTitle className="whitespace-nowrap mr-4">Customers</CardTitle>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 flex-1 min-w-0 sm:max-w-48 md:max-w-60"
            />
            {/* --- Simplified className using buttonVariants --- */}
            <Link
              to="/new-repair"
              className={buttonVariants({ variant: 'default' })} // Apply directly
            >
              Add Customer
            </Link>
            {/* --- End of changed button --- */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-right">
                      {/* --- Simplified className using buttonVariants --- */}
                      <Link
                        to={`/customer/${customer.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })} // Apply directly
                      >
                        View Details
                      </Link>
                      {/* --- End of changed button --- */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No customers found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;