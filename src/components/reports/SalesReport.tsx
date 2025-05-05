
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SalesReportData } from '@/data/mockData';

interface SalesReportProps {
  data: SalesReportData;
}

const SalesReport: React.FC<SalesReportProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="repairs" fill="#8884d8" name="Repair Services" />
                <Bar dataKey="parts" fill="#82ca9d" name="Parts Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.categoryBreakdown.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>${category.amount.toFixed(2)}</TableCell>
                  <TableCell>{category.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReport;
