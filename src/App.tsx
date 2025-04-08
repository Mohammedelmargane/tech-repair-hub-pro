
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Customer from "./pages/Customer";
import NewRepair from "./pages/NewRepair";
import EditRepair from "./pages/EditRepair";
import BarcodeSearchPage from "./pages/BarcodeSearchPage";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/customer/:id" element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            } />
            <Route path="/new-repair" element={
              <ProtectedRoute allowedRoles={['admin', 'technician', 'customer_service']}>
                <NewRepair />
              </ProtectedRoute>
            } />
            <Route path="/edit-repair/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'technician']}>
                <EditRepair />
              </ProtectedRoute>
            } />
            <Route path="/barcode-search" element={
              <ProtectedRoute>
                <BarcodeSearchPage />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute allowedRoles={['admin', 'technician']}>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
