import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RepairTicket } from '@/data/mockData';

type RepairFormData = {
  customerId: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  problemDescription: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  estimatedCost: number;
  finalCost: number | null;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCompletionDate: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  amountPaid: number;
  repairNotes?: string;
};

type RepairFormContextType = {
  formData: RepairFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<RepairFormData>>;
  isEditing: boolean;
};

const defaultFormData: RepairFormData = {
  customerId: '',
  deviceType: '',
  brand: '',
  model: '',
  serialNumber: '',
  problemDescription: '',
  status: 'pending',
  estimatedCost: 0,
  finalCost: null,
  notes: '',
  priority: 'medium',
  estimatedCompletionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  paymentStatus: 'unpaid',
  amountPaid: 0,
  repairNotes: '[]'
};

const RepairFormContext = createContext<RepairFormContextType | undefined>(undefined);

export const useRepairForm = () => {
  const context = useContext(RepairFormContext);
  if (!context) {
    throw new Error('useRepairForm must be used within a RepairFormProvider');
  }
  return context;
};

interface RepairFormProviderProps {
  children: ReactNode;
  customerId?: string;
  repairToEdit?: RepairTicket;
}

export const RepairFormProvider: React.FC<RepairFormProviderProps> = ({
  children,
  customerId,
  repairToEdit
}) => {
  const isEditing = !!repairToEdit;
  
  const [formData, setFormData] = useState<RepairFormData>(() => {
    if (repairToEdit) {
      return {
        ...repairToEdit,
        priority: repairToEdit.priority || 'medium',
        estimatedCompletionDate: repairToEdit.estimatedCompletionDate || 
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentStatus: repairToEdit.paymentStatus || 'unpaid',
        amountPaid: repairToEdit.amountPaid || 0,
        repairNotes: repairToEdit.repairNotes || '[]'
      };
    }
    
    return {
      ...defaultFormData,
      customerId: customerId || ''
    };
  });

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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  return (
    <RepairFormContext.Provider
      value={{
        formData,
        handleChange,
        handleSelectChange,
        handleNumberChange,
        setFormData,
        isEditing
      }}
    >
      {children}
    </RepairFormContext.Provider>
  );
};
