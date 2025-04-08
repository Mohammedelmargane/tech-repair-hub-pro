
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from '@/components/Navbar';
import { 
  generateSalesReport, 
  generateRepairReport,
  generateEmployeeReport 
} from '@/data/mockData';
import SalesReport from '@/components/reports/SalesReport';
import RepairsReport from '@/components/reports/RepairsReport';
import EmployeeReport from '@/components/reports/EmployeeReport';

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('this-month');
  const [salesData, setSalesData] = useState(generateSalesReport(timeRange));
  const [repairData, setRepairData] = useState(generateRepairReport(timeRange));
  const [employeeData, setEmployeeData] = useState(generateEmployeeReport(timeRange));
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setSalesData(generateSalesReport(value));
    setRepairData(generateRepairReport(value));
    setEmployeeData(generateEmployeeReport(value));
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="container py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">${salesData.totalSales.toFixed(2)}</p>
              <p className="text-muted-foreground">
                {salesData.percentChange > 0 ? '+' : ''}{salesData.percentChange}% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle>Completed Repairs</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{repairData.totalRepairs}</p>
              <p className="text-muted-foreground">
                Avg. time: {repairData.avgRepairTime} days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle>Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{repairData.avgSatisfaction}/5</p>
              <p className="text-muted-foreground">
                Based on {repairData.totalFeedbacks} feedbacks
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="repairs">Repair Reports</TabsTrigger>
            <TabsTrigger value="employees">Employee Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <SalesReport data={salesData} />
          </TabsContent>
          
          <TabsContent value="repairs" className="space-y-4">
            <RepairsReport data={repairData} />
          </TabsContent>
          
          <TabsContent value="employees" className="space-y-4">
            <EmployeeReport data={employeeData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
