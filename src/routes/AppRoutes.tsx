import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages
const Projects = lazy(() => import('../pages/project/Projects'));
const Budgets = lazy(() => import('../pages/budget/Budgets'));
const Resources = lazy(() => import('../pages/resource/Resources'));
const RiskManagement = lazy(() => import('../pages/risk/RiskManagement'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Reports = lazy(() => import('../pages/reports/Reports'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/risk-management" element={<RiskManagement />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
