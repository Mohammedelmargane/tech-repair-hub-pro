
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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { parts, getSupplierById, updatePart, Part } from '@/data/mockData';
import { Package, Search, AlertCircle, Truck } from "lucide-react";

const PartsInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  
  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getLowStockStatus = (part: Part) => {
    if (part.stockQuantity === 0) {
      return "out-of-stock";
    } else if (part.stockQuantity <= part.minStockLevel) {
      return "low-stock";
    } else {
      return "in-stock";
    }
  };
  
  const handleUsePart = (partId: string) => {
    try {
      updatePart({
        ...selectedPart!,
        stockQuantity: Math.max(0, selectedPart!.stockQuantity - 1)
      });
      
      toast.success("Part used successfully");
      setSelectedPart(null);
    } catch (error) {
      toast.error("Failed to update part stock");
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search parts by name, SKU, or category..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Table>
        <TableCaption>Current inventory parts list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredParts.length > 0 ? (
            filteredParts.map((part) => {
              const stockStatus = getLowStockStatus(part);
              const supplier = getSupplierById(part.supplierId);
              
              return (
                <TableRow key={part.id}>
                  <TableCell className="font-mono">{part.sku}</TableCell>
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell>{part.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`
                          ${stockStatus === "out-of-stock" ? "border-red-500 text-red-500" : ""}
                          ${stockStatus === "low-stock" ? "border-yellow-500 text-yellow-500" : ""}
                          ${stockStatus === "in-stock" ? "border-green-500 text-green-500" : ""}
                        `}
                      >
                        {part.stockQuantity}
                      </Badge>
                      {stockStatus === "low-stock" && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      {stockStatus === "out-of-stock" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${part.price.toFixed(2)}</TableCell>
                  <TableCell>{supplier?.name || 'Unknown'}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPart(part)}
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Part Details</DialogTitle>
                          <DialogDescription>
                            {part.sku} - {part.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Category</p>
                              <p>{part.category}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Location</p>
                              <p>{part.location || 'Not specified'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Description</p>
                            <p className="text-sm">{part.description}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Stock</p>
                              <p>{part.stockQuantity}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Min Level</p>
                              <p>{part.minStockLevel}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Cost</p>
                              <p>${part.cost.toFixed(2)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Supplier</p>
                            <p>{supplier?.name} ({supplier?.phone})</p>
                          </div>
                        </div>
                        <DialogFooter className="flex items-center justify-between">
                          <Button 
                            variant="outline"
                            size="sm"
                            disabled={part.stockQuantity <= 0}
                            onClick={() => handleUsePart(part.id)}
                          >
                            Use 1 Part
                          </Button>
                          <Link to={`/inventory/edit-part/${part.id}`}>
                            <Button size="sm">
                              Edit Part
                            </Button>
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
              <TableCell colSpan={7} className="h-24 text-center">
                No parts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="pt-4">
        <h3 className="text-lg font-medium mb-2">Low Stock Parts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts
            .filter(part => part.stockQuantity <= part.minStockLevel)
            .map(part => {
              const supplier = getSupplierById(part.supplierId);
              return (
                <div 
                  key={part.id} 
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{part.name}</h4>
                    <Badge variant="outline" className={part.stockQuantity === 0 ? "border-red-500 text-red-500" : "border-yellow-500 text-yellow-500"}>
                      {part.stockQuantity === 0 ? "Out of stock" : "Low stock"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{part.sku}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">Current: {part.stockQuantity} / Min: {part.minStockLevel}</p>
                    <Link to={`/inventory/new-order?partId=${part.id}`}>
                      <Button size="sm" variant="outline">
                        <Truck className="h-3.5 w-3.5 mr-1" />
                        Order
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          {parts.filter(part => part.stockQuantity <= part.minStockLevel).length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No low stock parts at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartsInventory;
