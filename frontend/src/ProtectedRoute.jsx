import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children, adminOnly}){
    const {user} = useContext(AuthContext);

    if ( !user){
        return <Navigate to="/login" replace />;
    }
    if (adminOnly && !user.is_staff) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
