import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const context = useContext(AuthContext);

  if (context?.isLoading) return <div>Cargando...</div>;

  return context?.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
