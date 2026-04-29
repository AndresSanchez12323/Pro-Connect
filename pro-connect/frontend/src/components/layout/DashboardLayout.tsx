// Layout Wrapper for Authenticated Users
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function DashboardLayout({ children, showSidebar = true }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="pt-20 px-3 sm:px-6 pb-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left Sidebar (Profile & Navigation) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
             {showSidebar && <Sidebar />}
          </div>

          {/* Main Content */}
           <div className="col-span-1 md:col-span-9 lg:col-span-9 space-y-4 sm:space-y-6">
             {children}
          </div>
          
        </div>
      </main>
    </div>
  );
}
