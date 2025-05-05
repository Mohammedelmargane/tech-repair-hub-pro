
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from 'lucide-react';
import { getPartById } from '@/data/mockData';

interface PartsUsedSectionProps {
  partsUsed: any[];
  calculateTotalPartsValue: () => number;
}

const PartsUsedSection: React.FC<PartsUsedSectionProps> = ({ 
  partsUsed,
  calculateTotalPartsValue
}) => {
  const [showPartsUsed, setShowPartsUsed] = useState(false);
  
  if (partsUsed.length === 0) return null;
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-semibold mb-1">Parts Used</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPartsUsed(!showPartsUsed)}
          className="text-xs h-auto py-1"
        >
          <Package className="h-3 w-3 mr-1" />
          {showPartsUsed ? 'Hide Parts' : 'Show Parts'}
        </Button>
      </div>
      
      {showPartsUsed && (
        <div className="mt-2 space-y-2 text-sm">
          {partsUsed.map((item, index) => {
            const part = getPartById(item.partId);
            if (!part) return null;
            
            return (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="font-medium">{part.name}</p>
                  <p className="text-xs text-muted-foreground">{part.sku}</p>
                </div>
                <div className="text-right">
                  <p>{item.quantity} × ${part.price.toFixed(2)}</p>
                  <p className="font-medium">${(item.quantity * part.price).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total Parts Value:</span>
            <span>${calculateTotalPartsValue().toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartsUsedSection;
