
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Barcode, FileText, Search } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <FileText className="h-6 w-6 mr-2" />
          <Link to="/" className="text-xl font-bold">PC Repair Hub Pro</Link>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="secondary" asChild>
            <Link to="/" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <Button variant="secondary" asChild>
            <Link to="/new-repair" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              New Repair
            </Link>
          </Button>
          
          <Button variant="secondary" asChild>
            <Link to="/barcode-search" className="flex items-center">
              <Barcode className="h-4 w-4 mr-2" />
              Barcode Search
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
