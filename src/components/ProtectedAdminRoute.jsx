import { Navigate, useLocation } from 'react-router-dom';

/**
 * Wraps admin routes. Redirects to /admin/login if the user
 * has not authenticated this session.
 */
export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const isAuth = sessionStorage.getItem('admin_auth') === 'true';

  if (!isAuth) {
    // Redirect to login, preserving the attempted URL
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
