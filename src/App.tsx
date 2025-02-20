import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/layouts/auth/Login';
import DashboardLayout from './components/layouts/dashboard/DashboardLayout';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Fake auth state
  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />


        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <AppRoutes />
              </DashboardLayout>
            ) 
             : 
             (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
