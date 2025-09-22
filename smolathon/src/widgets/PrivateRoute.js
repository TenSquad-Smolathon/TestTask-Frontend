import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';

export const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
}