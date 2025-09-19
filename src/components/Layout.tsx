
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';
import { useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-[80]">
        <Navbar currentPath={location.pathname} />
      </div>
      <main className="flex-grow pt-20 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNavbar />
    </div>
  );
};

export default Layout;
