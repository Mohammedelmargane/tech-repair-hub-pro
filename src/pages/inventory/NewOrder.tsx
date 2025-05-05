
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { addPartOrder, suppliers, getPartById, parts } from "@/data/mockData";
import { Plus, Trash } from "lucide-react";

interface OrderItem {
  partId: string;
  quantity: number;
  unitPrice: number;
}

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPartId = searchParams.get("partId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  
  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: new Date().toISOString().split("T")[0],
    status: "pending" as const,
    notes: "",
    items: [] as OrderItem[]
  });
  
  useEffect(() => {
    if (initialPartId) {
      const part = getPartById(initialPartId);
      if (part) {
        setOrderItems([{
          partId: part.id,
          quantity: 1,
          unitPrice: part.cost
        }]);
        
        if (part.supplierId) {
          setFormData(prev => ({
            ...prev,
            supplierId: part.supplierId
          }));
        }
      }
    } else {
      setOrderItems([{
        partId: "",
        quantity: 1,
        unitPrice: 0
      }]);
    }
  }, [initialPartId]);
  
  useEffect(() => {
    // Calculate total cost whenever order items change
    const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setTotalCost(total);
  }, [orderItems]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...orderItems];
    
    if (field === 'partId' && typeof value === 'string') {
      const part = getPartById(value);
      updatedItems[index] = {
        ...updatedItems[index],
        partId: value,
        unitPrice: part ? part.cost : 0
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
    }
    
    setOrderItems(updatedItems);
  };
  
  const addItem = () => {
    setOrderItems([...orderItems, {
      partId: "",
      quantity: 1,
      unitPrice: 0
    }]);
  };
  
  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      const updatedItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(updatedItems);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplierId) {
      toast.error("Please select a supplier");
      return;
    }
    
    if (orderItems.some(item => !item.partId)) {
      toast.error("Please select a part for each item");
      return;
    }
    
    setIsLoading(true);
    
    try {
      addPartOrder({
        ...formData,
        items: orderItems,
        totalCost: totalCost
      });
      
      toast.success("Order created successfully");
      navigate("/inventory");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="container py-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierId">Supplier</Label>
                  <Select
                    value={formData.supplierId}
                    onValueChange={(value) => handleSelectChange("supplierId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input
                    id="orderDate"
                    name="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Order Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5 space-y-1">
                        <Label htmlFor={`part-${index}`}>Part</Label>
                        <Select
                          value={item.partId}
                          onValueChange={(value) => handleItemChange(index, 'partId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a part" />
                          </SelectTrigger>
                          <SelectContent>
                            {parts.map((part) => (
                              <SelectItem key={part.id} value={part.id}>
                                {part.name} ({part.sku})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="col-span-2 space-y-1">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      
                      <div className="col-span-3 space-y-1">
                        <Label htmlFor={`unitPrice-${index}`}>Unit Price ($)</Label>
                        <Input
                          id={`unitPrice-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeItem(index)}
                          disabled={orderItems.length === 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <div className="p-4 bg-muted/20 rounded-md">
                    <p className="font-medium">Total Cost: ${totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any additional information about this order..."
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate("/inventory")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Order"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewOrder;
