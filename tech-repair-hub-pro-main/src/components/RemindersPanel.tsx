
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getOverdueRepairs, sendCustomerReminder, Reminder } from '@/data/mockData';

const RemindersPanel: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch reminders
    const fetchReminders = () => {
      const overdueRepairs = getOverdueRepairs();
      setReminders(overdueRepairs);
    };
    
    fetchReminders();
    
    // Refresh reminders every 5 minutes
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSendReminder = (reminderId: string) => {
    try {
      sendCustomerReminder(reminderId);
      toast.success("Reminder sent successfully");
      
      // Update local state to mark reminder as sent
      setReminders(prevReminders => 
        prevReminders.map(reminder => 
          reminder.id === reminderId 
            ? { ...reminder, reminderSent: true } 
            : reminder
        )
      );
    } catch (error) {
      toast.error("Failed to send reminder");
      console.error(error);
    }
  };
  
  const unsentRemindersCount = reminders.filter(r => !r.reminderSent).length;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" size="icon">
          <Bell className="h-5 w-5" />
          {unsentRemindersCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unsentRemindersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Repair Reminders</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4 max-h-[calc(100vh-100px)] overflow-y-auto">
          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">
                      {reminder.customerName}
                    </CardTitle>
                    <Badge 
                      variant={reminder.daysOverdue > 7 ? "destructive" : "default"}
                    >
                      {reminder.daysOverdue} days overdue
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-sm text-muted-foreground">Device: {reminder.deviceType}</p>
                  <p className="text-sm text-muted-foreground">Status: {reminder.status}</p>
                  <div className="mt-2">
                    {reminder.reminderSent ? (
                      <Badge variant="outline">Reminder Sent</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleSendReminder(reminder.id)}
                      >
                        Send Reminder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No outstanding reminders
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RemindersPanel;
