
import React from 'react';
import Navbar from '@/components/Navbar';
import BarcodeSearch from '@/components/BarcodeSearch';

const BarcodeSearchPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="container py-12 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6">Customer Lookup</h1>
        <BarcodeSearch />
      </div>
    </div>
  );
};

export default BarcodeSearchPage;
