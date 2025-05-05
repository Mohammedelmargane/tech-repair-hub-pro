
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { getCustomerById } from '@/data/mockData';
import { MessageSquare } from 'lucide-react';

interface WhatsAppMessageProps {
  customerId: string;
  repairId: string;
}

const WhatsAppMessage: React.FC<WhatsAppMessageProps> = ({ customerId, repairId }) => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  
  const customer = getCustomerById(customerId);
  
  if (!customer) {
    return null;
  }
  
  // Format phone number for WhatsApp
  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-numeric characters
    const numericOnly = phone.replace(/\D/g, '');
    // Ensure it has a country code (add +1 if not present)
    return numericOnly.startsWith('1') ? numericOnly : `1${numericOnly}`;
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    try {
      const formattedPhone = formatPhoneForWhatsApp(customer.phone);
      const encodedMessage = encodeURIComponent(
        `${message}\n\n(Regarding repair ticket: #${repairId})`
      );
      
      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
      
      toast.success("WhatsApp opened with your message");
      setMessage('');
      setOpen(false);
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      toast.error("Failed to open WhatsApp");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          Message Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Message</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium mb-1">Customer</p>
            <p>{customer.name}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Phone</p>
            <p>{customer.phone}</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message to the customer..."
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendMessage} type="submit">
            Send via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppMessage;
