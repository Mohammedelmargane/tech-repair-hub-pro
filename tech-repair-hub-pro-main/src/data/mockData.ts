export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface RepairTicket {
  id: string;
  customerId: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  problemDescription: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  estimatedCost: number;
  finalCost: number | null;
  createdAt: string;
  updatedAt: string;
  notes: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedCompletionDate?: string;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  amountPaid?: number;
  repairNotes?: string; // JSON string containing repair notes
  partsUsed?: string; // JSON string containing parts used in the repair
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  supplierId: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  notes?: string;
}

export interface PartOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  status: 'pending' | 'ordered' | 'shipped' | 'delivered' | 'cancelled';
  totalCost: number;
  deliveryDate?: string;
  notes?: string;
  items: OrderItem[];
}

export interface OrderItem {
  partId: string;
  quantity: number;
  unitPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'customer_service' | 'cashier';
  password: string; // In a real app, this would be hashed
}

export const customers: Customer[] = [
  {
    id: "C001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 12345"
  },
  {
    id: "C002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Somecity, CA 67890"
  },
  {
    id: "C003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "555-456-7890",
    address: "789 Pine Rd, Anothercity, CA 45678"
  }
];

export const repairs: RepairTicket[] = [
  {
    id: "R001",
    customerId: "C001",
    deviceType: "Laptop",
    brand: "Dell",
    model: "XPS 15",
    serialNumber: "DL-XPS15-123456",
    problemDescription: "Will not power on. Battery may need replacement.",
    status: "in-progress",
    estimatedCost: 150,
    finalCost: null,
    createdAt: "2025-04-05T10:30:00Z",
    updatedAt: "2025-04-05T14:20:00Z",
    notes: "Diagnosed as faulty power supply. Ordered replacement part.",
    priority: "medium",
    estimatedCompletionDate: "2025-04-08",
    paymentStatus: "unpaid",
    amountPaid: 0,
    repairNotes: JSON.stringify([
      {
        timestamp: "2025-04-05T10:45:00Z",
        text: "Initial diagnosis: power button responsive but no boot sequence. Tested with external power supply without battery - no response.",
        technician: "John Tech"
      },
      {
        timestamp: "2025-04-05T14:15:00Z",
        text: "Opened laptop case. Found corroded connector on power board. Ordered replacement part #DL-758-PWR.",
        technician: "John Tech"
      }
    ])
  },
  {
    id: "R002",
    customerId: "C001",
    deviceType: "Desktop",
    brand: "HP",
    model: "Pavilion",
    serialNumber: "HP-PAV-789012",
    problemDescription: "Blue screen errors. Possible RAM issue.",
    status: "completed",
    estimatedCost: 120,
    finalCost: 95,
    createdAt: "2025-03-28T09:15:00Z",
    updatedAt: "2025-03-29T16:45:00Z",
    notes: "Replaced faulty RAM stick. System now stable.",
    priority: "low",
    estimatedCompletionDate: "2025-03-30",
    paymentStatus: "paid",
    amountPaid: 95,
    repairNotes: JSON.stringify([
      {
        timestamp: "2025-03-28T10:00:00Z",
        text: "Ran memory diagnostic. Detected errors in DIMM slot 2. Removed RAM stick and system booted without errors.",
        technician: "Sarah Tech"
      },
      {
        timestamp: "2025-03-29T11:30:00Z",
        text: "Installed new 8GB DDR4 RAM stick. Ran stress test for 2 hours - no errors detected.",
        technician: "Sarah Tech"
      },
      {
        timestamp: "2025-03-29T16:30:00Z",
        text: "Final testing complete. System stable under load. Ready for pickup.",
        technician: "Sarah Tech"
      }
    ])
  },
  {
    id: "R003",
    customerId: "C002",
    deviceType: "Laptop",
    brand: "Apple",
    model: "MacBook Pro",
    serialNumber: "AP-MBP-345678",
    problemDescription: "Keyboard not working properly. Several keys stuck.",
    status: "pending",
    estimatedCost: 250,
    finalCost: null,
    createdAt: "2025-04-06T13:20:00Z",
    updatedAt: "2025-04-06T13:20:00Z",
    notes: "Awaiting customer approval for keyboard replacement.",
    priority: "high",
    estimatedCompletionDate: "2025-04-10",
    paymentStatus: "partial",
    amountPaid: 100,
    repairNotes: JSON.stringify([
      {
        timestamp: "2025-04-06T13:30:00Z",
        text: "Initial assessment: multiple keys (J, K, L, ;) not responding. Compressed air cleaning did not resolve issue.",
        technician: "Mike Tech"
      },
      {
        timestamp: "2025-04-06T14:15:00Z",
        text: "Contacted customer with quote for keyboard replacement ($250). Customer requested time to consider options.",
        technician: "Mike Tech"
      }
    ])
  }
];

export const parts: Part[] = [
  {
    id: "P001",
    name: "Laptop Battery - Dell XPS Series",
    sku: "BAT-DELL-XPS",
    category: "Batteries",
    description: "Replacement battery for Dell XPS series laptops",
    price: 89.99,
    cost: 45.00,
    stockQuantity: 8,
    minStockLevel: 5,
    supplierId: "S001",
    location: "Shelf A-1",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-03-15T10:00:00Z"
  },
  {
    id: "P002",
    name: "MacBook Pro Keyboard Replacement",
    sku: "KEY-MAC-PRO",
    category: "Keyboards",
    description: "Replacement keyboard for MacBook Pro (2018-2022)",
    price: 149.99,
    cost: 95.00,
    stockQuantity: 3,
    minStockLevel: 2,
    supplierId: "S002",
    location: "Shelf B-2",
    createdAt: "2025-03-20T11:30:00Z",
    updatedAt: "2025-03-20T11:30:00Z"
  },
  {
    id: "P003",
    name: "16GB DDR4 RAM",
    sku: "RAM-16GB-DDR4",
    category: "Memory",
    description: "16GB DDR4 3200MHz RAM stick for laptops",
    price: 65.99,
    cost: 40.00,
    stockQuantity: 12,
    minStockLevel: 6,
    supplierId: "S003",
    location: "Shelf C-1",
    createdAt: "2025-03-18T09:15:00Z",
    updatedAt: "2025-04-01T14:20:00Z"
  },
  {
    id: "P004",
    name: "500GB SSD - Samsung",
    sku: "SSD-500GB-SAM",
    category: "Storage",
    description: "Samsung 500GB Solid State Drive",
    price: 79.99,
    cost: 50.00,
    stockQuantity: 7,
    minStockLevel: 4,
    supplierId: "S003",
    location: "Shelf C-2",
    createdAt: "2025-03-25T13:45:00Z",
    updatedAt: "2025-03-25T13:45:00Z"
  }
];

export const suppliers: Supplier[] = [
  {
    id: "S001",
    name: "TechParts Inc.",
    contactName: "Michael Smith",
    email: "michael@techparts.com",
    phone: "555-789-1230",
    address: "456 Supply St, Parts City, CA 98765",
    website: "https://techparts.com"
  },
  {
    id: "S002",
    name: "Apple Authorized Parts",
    contactName: "Sarah Johnson",
    email: "sarah@appleparts.com",
    phone: "555-234-5678",
    address: "789 Apple Rd, Cupertino, CA 95014",
    website: "https://appleauthorizedparts.com"
  },
  {
    id: "S003",
    name: "PC Components Supply",
    contactName: "David Wilson",
    email: "david@pccomponents.com",
    phone: "555-456-7890",
    address: "123 Computer Dr, Tech Valley, CA 91234",
    website: "https://pccomponents.com"
  }
];

export const partOrders: PartOrder[] = [
  {
    id: "O001",
    supplierId: "S001",
    orderDate: "2025-03-28T09:00:00Z",
    status: "delivered",
    totalCost: 225.00,
    deliveryDate: "2025-04-02T14:30:00Z",
    notes: "Regular monthly battery order",
    items: [
      {
        partId: "P001",
        quantity: 5,
        unitPrice: 45.00
      }
    ]
  },
  {
    id: "O002",
    supplierId: "S002",
    orderDate: "2025-04-05T10:15:00Z",
    status: "ordered",
    totalCost: 190.00,
    notes: "Expedited shipping requested",
    items: [
      {
        partId: "P002",
        quantity: 2,
        unitPrice: 95.00
      }
    ]
  }
];

export const users: User[] = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@repairshop.com',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'user2',
    name: 'Tech Support',
    email: 'tech@repairshop.com',
    role: 'technician',
    password: 'tech123',
  },
  {
    id: 'user3',
    name: 'Customer Service',
    email: 'service@repairshop.com',
    role: 'customer_service',
    password: 'service123',
  },
  {
    id: 'user4',
    name: 'Cashier',
    email: 'cashier@repairshop.com',
    role: 'cashier',
    password: 'cashier123',
  },
];

export function loginUser(email: string, password: string): User | null {
  const user = users.find(u => u.email === email && u.password === password);
  return user ? { ...user, password: '*****' } : null;
}

export function getUserById(id: string): User | null {
  const user = users.find(u => u.id === id);
  return user ? { ...user, password: '*****' } : null;
}

export interface EmployeePerformance {
  userId: string;
  repairsCompleted: number;
  avgRepairTime: number; // in days
  customerSatisfaction: number; // out of 5
}

export const employeePerformance: EmployeePerformance[] = [
  {
    userId: 'user1',
    repairsCompleted: 45,
    avgRepairTime: 1.8,
    customerSatisfaction: 4.8,
  },
  {
    userId: 'user2',
    repairsCompleted: 87,
    avgRepairTime: 2.1,
    customerSatisfaction: 4.5,
  },
  {
    userId: 'user3',
    repairsCompleted: 32,
    avgRepairTime: 2.4,
    customerSatisfaction: 4.7,
  },
  {
    userId: 'user4',
    repairsCompleted: 12,
    avgRepairTime: 3.2,
    customerSatisfaction: 4.3,
  },
];

export interface Reminder {
  id: string;
  repairId: string;
  customerId: string;
  customerName: string;
  deviceType: string;
  status: string;
  daysOverdue: number;
  reminderSent: boolean;
}

export const reminders: Reminder[] = [
  {
    id: 'rem1',
    repairId: 'rep2',
    customerId: 'cus2',
    customerName: 'Jane Smith',
    deviceType: 'Laptop',
    status: 'Completed',
    daysOverdue: 5,
    reminderSent: false
  },
  {
    id: 'rem2',
    repairId: 'rep4',
    customerId: 'cus4',
    customerName: 'Carlos Rodriguez',
    deviceType: 'Smartphone',
    status: 'Completed',
    daysOverdue: 8,
    reminderSent: false
  },
  {
    id: 'rem3',
    repairId: 'rep6',
    customerId: 'cus6',
    customerName: 'Emily Johnson',
    deviceType: 'Tablet',
    status: 'Completed',
    daysOverdue: 3,
    reminderSent: true
  },
];

export function getOverdueRepairs(): Reminder[] {
  return reminders;
}

export function sendCustomerReminder(reminderId: string): boolean {
  const reminder = reminders.find(r => r.id === reminderId);
  if (!reminder) return false;
  
  reminder.reminderSent = true;
  return true;
}

export interface SalesReportData {
  totalSales: number;
  percentChange: number;
  chartData: Array<{ name: string; repairs: number; parts: number }>;
  categoryBreakdown: Array<{ name: string; amount: number; percentage: number }>;
}

export interface RepairReportData {
  totalRepairs: number;
  avgRepairTime: number;
  avgSatisfaction: number;
  totalFeedbacks: number;
  repairTypes: Array<{ name: string; value: number }>;
  repairTimeData: Array<{ name: string; time: number }>;
  commonIssues: Array<{ name: string; count: number; avgTime: number; avgCost: number }>;
}

export interface EmployeeReportData {
  performanceData: Array<{ name: string; completed: number; satisfaction: number }>;
  employeeData: Array<{
    name: string;
    role: string;
    repairsCompleted: number;
    avgRepairTime: number;
    satisfaction: number;
    status: 'Excellent' | 'Good' | 'Needs Improvement';
  }>;
}

export function generateSalesReport(timeRange: string): SalesReportData {
  return {
    totalSales: 15670.50,
    percentChange: 12.3,
    chartData: [
      { name: 'Jan', repairs: 4000, parts: 2400 },
      { name: 'Feb', repairs: 3000, parts: 1398 },
      { name: 'Mar', repairs: 2000, parts: 9800 },
      { name: 'Apr', repairs: 2780, parts: 3908 },
      { name: 'May', repairs: 1890, parts: 4800 },
      { name: 'Jun', repairs: 2390, parts: 3800 },
    ],
    categoryBreakdown: [
      { name: 'Screen Repairs', amount: 5320.00, percentage: 34 },
      { name: 'Battery Replacements', amount: 2840.50, percentage: 18 },
      { name: 'Water Damage', amount: 2210.00, percentage: 14 },
      { name: 'Parts Sales', amount: 3560.00, percentage: 23 },
      { name: 'Other Services', amount: 1740.00, percentage: 11 },
    ],
  };
}

export function generateRepairReport(timeRange: string): RepairReportData {
  return {
    totalRepairs: 187,
    avgRepairTime: 2.3,
    avgSatisfaction: 4.7,
    totalFeedbacks: 142,
    repairTypes: [
      { name: 'Smartphones', value: 98 },
      { name: 'Laptops', value: 45 },
      { name: 'Tablets', value: 28 },
      { name: 'Desktops', value: 10 },
      { name: 'Other', value: 6 },
    ],
    repairTimeData: [
      { name: 'Screen Repair', time: 1.5 },
      { name: 'Battery Replace', time: 0.8 },
      { name: 'Water Damage', time: 3.2 },
      { name: 'Data Recovery', time: 2.7 },
      { name: 'Motherboard Fix', time: 4.5 },
    ],
    commonIssues: [
      { name: 'Cracked Screen', count: 68, avgTime: 1.5, avgCost: 120.50 },
      { name: 'Battery Issues', count: 42, avgTime: 0.8, avgCost: 75.20 },
      { name: 'Water Damage', count: 35, avgTime: 3.2, avgCost: 210.75 },
      { name: 'Slow Performance', count: 22, avgTime: 2.1, avgCost: 95.00 },
      { name: 'Charging Problems', count: 20, avgTime: 1.3, avgCost: 85.50 },
    ],
  };
}

export function generateEmployeeReport(timeRange: string): EmployeeReportData {
  return {
    performanceData: users.map((user, index) => {
      const performance = employeePerformance.find(e => e.userId === user.id) || {
        repairsCompleted: 0,
        avgRepairTime: 0,
        customerSatisfaction: 0
      };
      
      return {
        name: user.name,
        completed: performance.repairsCompleted,
        satisfaction: performance.customerSatisfaction * 10, // Scale up for chart
      };
    }),
    employeeData: users.map((user) => {
      const performance = employeePerformance.find(e => e.userId === user.id) || {
        repairsCompleted: 0,
        avgRepairTime: 0,
        customerSatisfaction: 0
      };
      
      let status: 'Excellent' | 'Good' | 'Needs Improvement' = 'Good';
      if (performance.customerSatisfaction >= 4.5) {
        status = 'Excellent';
      } else if (performance.customerSatisfaction < 4.0) {
        status = 'Needs Improvement';
      }
      
      return {
        name: user.name,
        role: user.role,
        repairsCompleted: performance.repairsCompleted,
        avgRepairTime: performance.avgRepairTime,
        satisfaction: performance.customerSatisfaction,
        status
      };
    }),
  };
}

export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

export const getRepairsByCustomerId = (customerId: string): RepairTicket[] => {
  return repairs.filter(repair => repair.customerId === customerId);
};

export const getRepairById = (id: string): RepairTicket | undefined => {
  return repairs.find(repair => repair.id === id);
};

export const getPartById = (id: string): Part | undefined => {
  return parts.find(part => part.id === id);
};

export const getSupplierById = (id: string): Supplier | undefined => {
  return suppliers.find(supplier => supplier.id === id);
};

export const getPartsBySupplier = (supplierId: string): Part[] => {
  return parts.filter(part => part.supplierId === supplierId);
};

export const getOrderById = (id: string): PartOrder | undefined => {
  return partOrders.find(order => order.id === id);
};

export const getOrdersBySupplier = (supplierId: string): PartOrder[] => {
  return partOrders.filter(order => order.supplierId === supplierId);
};

export const getLowStockParts = (): Part[] => {
  return parts.filter(part => part.stockQuantity <= part.minStockLevel);
};

export const addCustomer = (customer: Omit<Customer, 'id'>): Customer => {
  const newId = `C${String(customers.length + 1).padStart(3, '0')}`;
  const newCustomer = { ...customer, id: newId };
  customers.push(newCustomer);
  return newCustomer;
};

export const addRepair = (repair: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt'>): RepairTicket => {
  const newId = `R${String(repairs.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();
  const newRepair = { 
    ...repair, 
    id: newId,
    createdAt: now,
    updatedAt: now
  };
  repairs.push(newRepair);
  return newRepair;
};

export const updateRepair = (repair: RepairTicket): RepairTicket => {
  const index = repairs.findIndex(r => r.id === repair.id);
  if (index !== -1) {
    repairs[index] = {
      ...repair,
      updatedAt: new Date().toISOString()
    };
    return repairs[index];
  }
  throw new Error(`Repair with ID ${repair.id} not found`);
};

export const addPart = (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>): Part => {
  const newId = `P${String(parts.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();
  const newPart = { 
    ...part, 
    id: newId,
    createdAt: now,
    updatedAt: now
  };
  parts.push(newPart);
  return newPart;
};

export const updatePart = (part: Part): Part => {
  const index = parts.findIndex(p => p.id === part.id);
  if (index !== -1) {
    parts[index] = {
      ...part,
      updatedAt: new Date().toISOString()
    };
    return parts[index];
  }
  throw new Error(`Part with ID ${part.id} not found`);
};

export const updatePartStock = (partId: string, quantity: number): Part => {
  const index = parts.findIndex(p => p.id === partId);
  if (index !== -1) {
    parts[index] = {
      ...parts[index],
      stockQuantity: Math.max(0, parts[index].stockQuantity + quantity),
      updatedAt: new Date().toISOString()
    };
    return parts[index];
  }
  throw new Error(`Part with ID ${partId} not found`);
};

export const addSupplier = (supplier: Omit<Supplier, 'id'>): Supplier => {
  const newId = `S${String(suppliers.length + 1).padStart(3, '0')}`;
  const newSupplier = { ...supplier, id: newId };
  suppliers.push(newSupplier);
  return newSupplier;
};

export const addPartOrder = (order: Omit<PartOrder, 'id'>): PartOrder => {
  const newId = `O${String(partOrders.length + 1).padStart(3, '0')}`;
  const newOrder = { ...order, id: newId };
  partOrders.push(newOrder);
  return newOrder;
};

export const updatePartOrder = (order: PartOrder): PartOrder => {
  const index = partOrders.findIndex(o => o.id === order.id);
  if (index !== -1) {
    partOrders[index] = order;
    return partOrders[index];
  }
  throw new Error(`Order with ID ${order.id} not found`);
};
