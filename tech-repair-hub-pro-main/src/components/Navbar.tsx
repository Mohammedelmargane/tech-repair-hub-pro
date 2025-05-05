// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
// Import Button and buttonVariants if needed (though not used directly here anymore)
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SearchIcon,
  Home,
  Users, // +++ IMPORT THE Users ICON +++
  Settings,
  Barcode,
  Package,
  FileText // Keep FileText if still used for Finance link
} from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext'; // Optional for role checks

const Navbar: React.FC = () => {
  const location = useLocation();
  // const { user } = useAuth(); // Optional
  // const isAdmin = user?.role === 'admin'; // Optional

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/customers' && location.pathname.startsWith('/customer/')); // Highlight for customer detail too
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">RepairShop</span>
        </Link>

        {/* Search Input - Assuming it's okay */}
        <div className="w-96 hidden md:flex">
           {/* ... search input structure ... */}
           <div className="relative w-full">
             <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
               type="search"
               placeholder="Search..."
               className="w-full pl-8" // Simplified classes might be okay here too
             />
           </div>
        </div>

        <nav className="flex flex-1 items-center justify-center space-x-1 md:space-x-2 md:justify-end">
          {/* Dashboard Link */}
          <Link
            to="/"
            className={cn(buttonVariants({ variant: isActive('/') ? 'secondary' : 'ghost', size: 'sm' }), "h-8")}
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {/* +++ ADD THE NEW CUSTOMERS LINK HERE +++ */}
          <Link
             to="/customers"
             className={cn(buttonVariants({ variant: isActive('/customers') ? 'secondary' : 'ghost', size: 'sm' }), "h-8")}
          >
            <Users className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Customers</span>
          </Link>
          {/* +++ END OF NEW CUSTOMERS LINK +++ */}

          {/* Barcode Link */}
          <Link
             to="/barcode-search"
             className={cn(buttonVariants({ variant: isActive('/barcode-search') ? 'secondary' : 'ghost', size: 'sm' }), "h-8")}
           >
            <Barcode className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Barcode</span>
          </Link>

          {/* Inventory Link */}
          <Link
            to="/inventory"
            className={cn(buttonVariants({ variant: isActive('/inventory') ? 'secondary' : 'ghost', size: 'sm' }), "h-8")}
          >
            <Package className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Inventory</span>
          </Link>

          {/* Finance Report Link */}
          {/* {isAdmin && ( // Optional role check */}
          <Link
             to="/finance-report"
             className={cn(buttonVariants({ variant: isActive('/finance-report') ? 'secondary' : 'ghost', size: 'sm' }), "h-8")}
           >
            <FileText className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Finance</span>
          </Link>
          {/* )} */}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;