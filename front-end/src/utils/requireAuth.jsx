import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  console.log('load is authen', isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to={"/login"}/>;
  }
  return <Outlet />;
};
export default RequireAuth;
