import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - sticky on md and above, absolute on mobile */}
      <div className="md:sticky md:top-0 md:z-[80]">
        <Navbar currentPath={location.pathname} />
      </div>
      
      {/* Main content with padding only on mobile to account for absolute navbar */}
      <main className="flex-grow pt-20 pb-16 md:pt-0 md:pb-0">
        {children}
      </main>
      
      <Footer />
      <BottomNavbar />
    </div>
  );
};

export default Layout;