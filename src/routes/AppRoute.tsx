import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};
