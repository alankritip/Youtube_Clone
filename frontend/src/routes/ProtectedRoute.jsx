import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ redirectTo = '/auth' }) {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
