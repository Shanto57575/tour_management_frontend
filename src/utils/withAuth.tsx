import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!data?.data.email && !isLoading) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" />;
    }

    if (requiredRole && !isLoading) return <Component />;
  };
};
