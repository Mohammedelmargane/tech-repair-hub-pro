
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  SearchIcon, 
  Home,
  Users,
  Settings,
  Barcode,
  Package
} from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">RepairShop</span>
        </Link>
        
        <div className="w-96 hidden md:flex">
          <div className="relative w-full">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8"
            />
          </div>
        </div>
        
        <nav className="flex flex-1 items-center justify-center space-x-1 md:space-x-2 md:justify-end">
          <Link to="/">
            <Button 
              variant={isActive('/') ? "secondary" : "ghost"}
              size="sm"
              className="h-8"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link to="/barcode-search">
            <Button 
              variant={isActive('/barcode-search') ? "secondary" : "ghost"}
              size="sm"
              className="h-8"
            >
              <Barcode className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Barcode</span>
            </Button>
          </Link>
          <Link to="/inventory">
            <Button 
              variant={isActive('/inventory') ? "secondary" : "ghost"}
              size="sm"
              className="h-8"
            >
              <Package className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Inventory</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
