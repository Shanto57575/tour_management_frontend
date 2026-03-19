import { useUserInfoQuery } from "@/redux/features/user/user.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (isLoading) {
      return null;
    }

    if (!data?.data?.email) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component />;
  };
};

export const withGuest = (Component: ComponentType) => {
  return function GuestWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (isLoading) {
      return null;
    }

    if (data?.data?.email) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  };
};
