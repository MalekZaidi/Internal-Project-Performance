import  { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Projects = lazy(() => import('../pages/project/Projects'));
const AddProject = lazy(() => import('../pages/project/CreateProjectForm')); // Import AddProject page
const Budgets = lazy(() => import('../pages/budget/Budgets'));
const Resources = lazy(() => import('../pages/resource/Resources'));
const RiskManagement = lazy(() => import('../pages/risk/RiskManagement'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Reports = lazy(() => import('../pages/reports/Reports'));
const NotFound = lazy(() => import('../pages/notfound'));
const Account = lazy(()=> import ('../pages/auth/Profile'))
const AppRoutes = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/add" element={<AddProject />} /> 
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/risk-management" element={<RiskManagement />} />
        <Route path="/Account" element={<Account/>}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
