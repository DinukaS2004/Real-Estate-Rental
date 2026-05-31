"use client";

import { useAuthContext } from "@asgardeo/auth-react";
import { useAppSelector } from "./redux";

export const useAuth = () => {
    const { signIn, signOut, state } = useAuthContext();
    const { user, token, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    return {
        // From Asgardeo
        signIn,
        signOut,
        isLoading: state.isLoading,

        // From Redux (synced from DB)
        user,
        token,
        isAuthenticated,
        isManager: user?.role === "MANAGER",
        isTenant: user?.role === "TENANT",
    };
};