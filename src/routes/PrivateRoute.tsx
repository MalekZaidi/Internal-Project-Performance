import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../features/auth/hooks/useProfile';

interface PrivateRouteProps {
  element: React.ReactNode;
  requiredRole: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredRole }) => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <h1>Loading...</h1>; // Show loading while checking the role
  }

  if (error || !profile) {
    return <Navigate to="/login" />;
  }

  if (profile.role !== requiredRole && requiredRole !== "any") {
    return <Navigate to="/dashboard" />; // Redirect if user doesn't have the required role
  }

  return <>{element}</>;
};

export default PrivateRoute;
