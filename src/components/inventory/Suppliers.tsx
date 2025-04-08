
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { suppliers, getPartsBySupplier } from '@/data/mockData';
import { Search, Box, Phone, Mail } from "lucide-react";

const Suppliers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers by name or contact person..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/inventory/new-supplier">
          <Button>Add Supplier</Button>
        </Link>
      </div>
      
      <Table>
        <TableCaption>List of parts suppliers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Parts Supplied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => {
              const suppliedParts = getPartsBySupplier(supplier.id);
              
              return (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactName}</TableCell>
                  <TableCell>
                    <a href={`mailto:${supplier.email}`} className="flex items-center text-primary hover:underline">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {supplier.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${supplier.phone}`} className="flex items-center hover:underline">
                      <Phone className="h-3.5 w-3.5 mr-1" />
                      {supplier.phone}
                    </a>
                  </TableCell>
                  <TableCell>{suppliedParts.length}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>{supplier.name}</DialogTitle>
                          <DialogDescription>
                            Supplier ID: {supplier.id}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Contact Person</p>
                              <p>{supplier.contactName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Phone</p>
                              <p>{supplier.phone}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Email</p>
                            <p>{supplier.email}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Address</p>
                            <p>{supplier.address}</p>
                          </div>
                          
                          {supplier.website && (
                            <div>
                              <p className="text-sm font-medium mb-1">Website</p>
                              <a 
                                href={supplier.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {supplier.website}
                              </a>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Supplied Parts</p>
                            {suppliedParts.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {suppliedParts.map(part => (
                                  <div key={part.id} className="flex items-center p-2 border rounded">
                                    <Box className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                    <div className="truncate">
                                      <p className="text-sm font-medium">{part.name}</p>
                                      <p className="text-xs text-muted-foreground">{part.sku}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No parts from this supplier</p>
                            )}
                          </div>
                        </div>
                        
                        <DialogFooter className="flex space-x-2">
                          <Link to={`/inventory/new-order?supplierId=${supplier.id}`}>
                            <Button variant="outline">Create Order</Button>
                          </Link>
                          <Link to={`/inventory/edit-supplier/${supplier.id}`}>
                            <Button>Edit Supplier</Button>
                          </Link>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No suppliers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Suppliers;
