import { isAuthenticated } from "@/lib/utils";
import { Navigate, Outlet } from "react-router";

const AuthWrapper = ({}: {}) => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default AuthWrapper;
