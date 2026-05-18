import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const context = useContext(AuthContext);

  if (context?.isLoading) return <div>Cargando...</div>;

  if (!context?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && context.user && !allowedRoles.includes(context.user.role)) {
    return <Navigate to="/scanner" replace />;
  }

  return <Outlet />;
};
