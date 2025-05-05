
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRepairForm } from '@/contexts/RepairFormContext';
import { parts, getPartById } from '@/data/mockData';
import { Package, X } from 'lucide-react';
import PartSelector from '../inventory/PartSelector';

const PartsUsedSection = () => {
  const { formData, setFormData } = useRepairForm();
  
  // Parse existing parts from the form data
  const parsedPartsUsed = formData.partsUsed 
    ? JSON.parse(formData.partsUsed) 
    : [];

  const handleSelectParts = (selectedParts: Array<{partId: string, quantity: number}>) => {
    // Combine with existing parts, avoiding duplicates
    const existingParts = parsedPartsUsed || [];
    
    const updatedParts = [...existingParts];
    
    selectedParts.forEach(newPart => {
      const existingIndex = updatedParts.findIndex(p => p.partId === newPart.partId);
      if (existingIndex >= 0) {
        // Update existing part quantity
        updatedParts[existingIndex].quantity += newPart.quantity;
      } else {
        // Add new part
        updatedParts.push(newPart);
      }
    });
    
    // Update form data
    setFormData({
      ...formData,
      partsUsed: JSON.stringify(updatedParts)
    });
  };
  
  const handleRemovePart = (partId: string) => {
    const updatedParts = parsedPartsUsed.filter(
      (part: { partId: string }) => part.partId !== partId
    );
    
    setFormData({
      ...formData,
      partsUsed: JSON.stringify(updatedParts)
    });
  };
  
  const calculateTotalPartsValue = () => {
    return parsedPartsUsed.reduce((total: number, item: { partId: string, quantity: number }) => {
      const part = parts.find(p => p.id === item.partId);
      return total + (part ? part.price * item.quantity : 0);
    }, 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <h3 className="text-lg font-medium">Parts Used</h3>
        <PartSelector onSelectParts={handleSelectParts} />
      </div>
      
      {parsedPartsUsed.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedPartsUsed.map((item: { partId: string, quantity: number }) => {
                const part = getPartById(item.partId);
                if (!part) return null;
                
                return (
                  <TableRow key={item.partId}>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell className="font-mono text-xs">{part.sku}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${part.price.toFixed(2)}</TableCell>
                    <TableCell>${(part.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRemovePart(item.partId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <div className="text-right">
              <div className="flex items-center justify-between gap-8">
                <span className="font-medium">Total Parts Value:</span>
                <span className="text-lg font-semibold">${calculateTotalPartsValue().toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Parts will be deducted from inventory when the repair is completed
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="py-6 text-center text-muted-foreground border border-dashed rounded-md">
          <Package className="h-8 w-8 mx-auto opacity-50" />
          <p className="mt-2">No parts selected for this repair</p>
          <p className="text-sm">Click "Add Parts to Repair" to select parts from inventory</p>
        </div>
      )}
    </div>
  );
};

export default PartsUsedSection;
