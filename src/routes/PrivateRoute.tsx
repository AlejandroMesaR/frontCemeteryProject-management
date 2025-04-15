import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
