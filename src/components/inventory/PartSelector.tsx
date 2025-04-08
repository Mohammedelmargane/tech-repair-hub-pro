
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { parts, Part } from '@/data/mockData';
import { Search, Package, Plus } from "lucide-react";

interface PartSelectorProps {
  onSelectParts: (selectedParts: Array<{partId: string, quantity: number}>) => void;
  buttonText?: string;
}

const PartSelector: React.FC<PartSelectorProps> = ({ 
  onSelectParts,
  buttonText = "Add Parts to Repair"
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParts, setSelectedParts] = useState<Array<{partId: string, quantity: number}>>([]);
  
  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectPart = (part: Part) => {
    // Check if part is already selected
    const existingIndex = selectedParts.findIndex(item => item.partId === part.id);
    
    if (existingIndex >= 0) {
      // Part is already selected, increment quantity if stock allows
      const newSelectedParts = [...selectedParts];
      if (newSelectedParts[existingIndex].quantity < part.stockQuantity) {
        newSelectedParts[existingIndex].quantity += 1;
        setSelectedParts(newSelectedParts);
      } else {
        toast.error("Cannot add more units than available in stock");
      }
    } else {
      // Part is not selected yet, add it with quantity of 1
      if (part.stockQuantity > 0) {
        setSelectedParts([...selectedParts, { partId: part.id, quantity: 1 }]);
      } else {
        toast.error("This part is out of stock");
      }
    }
  };
  
  const handleRemovePart = (partId: string) => {
    setSelectedParts(selectedParts.filter(item => item.partId !== partId));
  };
  
  const handleChangeQuantity = (partId: string, quantity: number) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return;
    
    // Ensure quantity is within stock limits
    const validQuantity = Math.min(Math.max(1, quantity), part.stockQuantity);
    
    const newSelectedParts = [...selectedParts];
    const index = newSelectedParts.findIndex(item => item.partId === partId);
    if (index >= 0) {
      newSelectedParts[index].quantity = validQuantity;
      setSelectedParts(newSelectedParts);
    }
  };
  
  const handleConfirmSelection = () => {
    onSelectParts(selectedParts);
    setOpen(false);
  };
  
  const getTotalSelectedPartsValue = () => {
    return selectedParts.reduce((total, item) => {
      const part = parts.find(p => p.id === item.partId);
      return total + (part ? part.price * item.quantity : 0);
    }, 0);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Package className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Parts for Repair</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 overflow-hidden max-h-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search parts by name, SKU, or category..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-y-auto pr-2" style={{ maxHeight: "40vh" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.length > 0 ? (
                  filteredParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-mono text-xs">{part.sku}</TableCell>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>${part.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={part.stockQuantity === 0 ? "text-red-500" : ""}>
                          {part.stockQuantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSelectPart(part)}
                          disabled={part.stockQuantity === 0}
                        >
                          <Plus className="h-4 w-4" />
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No parts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {selectedParts.length > 0 && (
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Selected Parts</h3>
              <div className="space-y-2">
                {selectedParts.map((item) => {
                  const part = parts.find(p => p.id === item.partId);
                  if (!part) return null;
                  
                  return (
                    <div key={item.partId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{part.name}</p>
                        <p className="text-sm text-muted-foreground">{part.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="px-2"
                            onClick={() => handleChangeQuantity(item.partId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="px-2"
                            onClick={() => handleChangeQuantity(item.partId, item.quantity + 1)}
                            disabled={item.quantity >= part.stockQuantity}
                          >
                            +
                          </Button>
                        </div>
                        <div className="w-20 text-right">${(part.price * item.quantity).toFixed(2)}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="px-2"
                          onClick={() => handleRemovePart(item.partId)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between items-center text-right">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-semibold">${getTotalSelectedPartsValue().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSelection} 
            disabled={selectedParts.length === 0}
          >
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartSelector;
