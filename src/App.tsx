import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; 
import Login from './pages/auth/Login';
import DashboardLayout from './components/layouts/dashboard/DashboardLayout';
import AppRoutes from './routes/AppRoutes';
import { fetchUserProfile } from './features/auth/api/authService';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('jwt'); 
      if (token) {
        try {
          await fetchUserProfile(); 
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
          Cookies.remove('jwt'); 
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <h1>Loading...</h1>; 

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
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
