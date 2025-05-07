import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProjectDetail from "../pages/project/ProjectDetail";
import CreateUserForm from "../pages/users/createUsers";
const Projects = lazy(() => import("../pages/project/Projects"));
const AddProject = lazy(() => import("../pages/project/CreateProjectForm"));
const PositionRates = lazy(() => import("../pages/budget/Budgets"));
const Resources = lazy(() => import("../pages/resource/Resources"));
const RiskManagement = lazy(() => import("../pages/risk/RiskManagement"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const NotFound = lazy(() => import("../pages/notfound"));
const Account = lazy(() => import("../pages/auth/Profile"));
const User= lazy (() => import("../pages/users/users"));
const Task= lazy (() => import("../pages/task/tasks"))
// AppRoutes.tsx
const AppRoutes = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tasks" element= {<Task/>} />
        {/* Common routes for all authenticated users */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "project_manager", "team_member"]} />}>
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/account" element={<Account />} />
        </Route>

        {/* Project management routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "project_manager"]} />}>
          <Route path="/budgets" element={<PositionRates />} />
          <Route path="/risk-management" element={<RiskManagement />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/projects/add" element={<AddProject />} />

          <Route path="/users" element={<User />} />
          <Route path="/users/add" element = {<CreateUserForm/>} />

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
