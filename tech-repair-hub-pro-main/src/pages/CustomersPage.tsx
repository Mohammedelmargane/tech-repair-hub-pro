// src/pages/CustomersPage.tsx
import React from 'react';
import CustomerList from '@/components/CustomerList'; // Import the existing list component
import Navbar from '@/components/Navbar'; // Import Navbar for consistent layout

const CustomersPage: React.FC = () => {
  return (
    // Use the same overall flex column structure as other pages
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container py-6 flex-1">
        {/* You could add a page title here if desired */}
        {/* <h1 className="text-2xl font-bold mb-6">Manage Customers</h1> */}

        {/* Render the CustomerList component */}
        <CustomerList />
      </div>
    </div>
  );
};

export default CustomersPage;