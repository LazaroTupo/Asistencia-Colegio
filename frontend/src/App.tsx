import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Scanner } from './pages/Scanner';
import { Dashboard } from './pages/Dashboard';
import { AdminWhatsApp } from './pages/AdminWhatsApp';
import { Students } from './pages/Students';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

const AppLayout = () => {
  const context = useContext(AuthContext);
  return (
    <>
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/scanner" element={<Scanner />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
            <Route path="/admin/students" element={<Students />} />
          </Route>
          <Route path="*" element={<Navigate to={context?.isAuthenticated ? "/scanner" : "/login"} />} />
        </Routes>
      </div>
      {context?.isAuthenticated && <Navbar />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
