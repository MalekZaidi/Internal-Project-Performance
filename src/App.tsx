import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./stores/store";
import { fetchUserProfile } from "./features/auth/api/authSlice";
import Login from "./pages/auth/Login";
import DashboardLayout from "./components/layouts/dashboard/DashboardLayout";
import AppRoutes from "./routes/AppRoutes";
const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user,  token } = useSelector((state: RootState) => state.auth);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile()).finally(() => setInitialLoad(false));
    } else {
      setInitialLoad(false);
    }
  }, [dispatch, token, user]);
  

   if (initialLoad) return <h1> Waiting</h1> ;

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route
          path="/*"
          element={
            user || token ? ( 
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
