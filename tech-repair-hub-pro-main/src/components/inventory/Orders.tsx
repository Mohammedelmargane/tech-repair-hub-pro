
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { partOrders, getSupplierById, getPartById, updatePartOrder, updatePartStock, PartOrder } from '@/data/mockData';
import { Search, PackageCheck, Calendar, FileCheck } from "lucide-react";

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOrders = partOrders.filter(order => {
    const supplier = getSupplierById(order.supplierId);
    return (
      supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'ordered': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleReceiveOrder = (order: PartOrder) => {
    try {
      // Update order status to delivered
      updatePartOrder({
        ...order,
        status: 'delivered',
        deliveryDate: new Date().toISOString()
      });
      
      // Update inventory quantities for each item
      order.items.forEach(item => {
        updatePartStock(item.partId, item.quantity);
      });
      
      toast.success("Order marked as received and inventory updated");
    } catch (error) {
      toast.error("Failed to process order");
      console.error(error);
    }
  };
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders by supplier, ID, or status..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/inventory/new-order">
          <Button>New Order</Button>
        </Link>
      </div>
      
      <Table>
        <TableCaption>List of part orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const supplier = getSupplierById(order.supplierId);
              
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{supplier?.name || 'Unknown'}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.totalCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                          <DialogDescription>
                            Order ID: {order.id}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Supplier</p>
                              <p>{supplier?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Status</p>
                              <Badge className={getStatusBadgeClass(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Order Date</p>
                              <p className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {formatDate(order.orderDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Delivery Date</p>
                              <p>{order.deliveryDate ? formatDate(order.deliveryDate) : 'Not delivered'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Items Ordered</p>
                            <div className="border rounded-md">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Part</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, index) => {
                                    const part = getPartById(item.partId);
                                    return (
                                      <TableRow key={`${order.id}-item-${index}`}>
                                        <TableCell>{part?.name || 'Unknown Part'}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                                        <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Total Cost</p>
                            <p className="text-lg font-semibold">${order.totalCost.toFixed(2)}</p>
                          </div>
                          
                          {order.notes && (
                            <div>
                              <p className="text-sm font-medium mb-1">Notes</p>
                              <p className="text-sm">{order.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <DialogFooter className="flex space-x-2">
                          {(order.status === 'ordered' || order.status === 'shipped') && (
                            <Button 
                              onClick={() => handleReceiveOrder(order)}
                              variant="default"
                            >
                              <PackageCheck className="h-4 w-4 mr-1" />
                              Mark as Received
                            </Button>
                          )}
                          {order.status === 'pending' && (
                            <Link to={`/inventory/edit-order/${order.id}`}>
                              <Button>Edit Order</Button>
                            </Link>
                          )}
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
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Orders;
