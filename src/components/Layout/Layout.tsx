import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Outlet />
    </div>
  );
};
