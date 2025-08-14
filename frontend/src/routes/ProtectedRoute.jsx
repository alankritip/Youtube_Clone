// Route wrapper that only renders children if user is logged in
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ redirectTo = '/auth' }) {
  const { user } = useAuth()
  // If user is logged in, render nested routes. Else redirect to auth page
  return user ? <Outlet /> : <Navigate to={redirectTo} replace />
}
