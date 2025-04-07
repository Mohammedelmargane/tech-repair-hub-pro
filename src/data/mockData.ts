
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
}

// Demo data
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
    amountPaid: 0
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
    amountPaid: 95
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
    amountPaid: 100
  }
];

// Helper functions for data manipulation
export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

export const getRepairsByCustomerId = (customerId: string): RepairTicket[] => {
  return repairs.filter(repair => repair.customerId === customerId);
};

export const getRepairById = (id: string): RepairTicket | undefined => {
  return repairs.find(repair => repair.id === id);
};

// In a real app, these would be API calls
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
