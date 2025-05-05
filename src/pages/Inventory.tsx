
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from '@/components/Navbar';
import PartsInventory from '@/components/inventory/PartsInventory';
import Suppliers from '@/components/inventory/Suppliers';
import Orders from '@/components/inventory/Orders';

const Inventory: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="container py-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Parts Inventory Management</h1>
        
        <Tabs defaultValue="parts" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Link to="/inventory/new-part" className={buttonVariants({ variant: "outline" })}>
                Add New Part
              </Link>
              <Link to="/inventory/new-order" className={buttonVariants({ variant: "default" })}>
                Create Order
              </Link>
            </div>
          </div>
          
          <TabsContent value="parts" className="space-y-4">
            <PartsInventory />
          </TabsContent>
          
          <TabsContent value="suppliers" className="space-y-4">
            <Suppliers />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Orders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
