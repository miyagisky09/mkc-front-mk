import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useConnection } from "../../context/connected_context";
import { useCallback, useEffect } from "react";
import { getMe } from "../../apis/backendAPI";


const ProtectedRoute = () => {
  const { isConnected, connectedWallet, setUser } = useConnection();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
