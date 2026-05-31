"use client";

import { AuthProvider } from "@asgardeo/auth-react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { asgardeoConfig } from "@/lib/asgardeo";
import AuthSync from "./AuthSync";

export default function Providers({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider config={asgardeoConfig}>
            <Provider store={store}>
                <AuthSync />
                {children}
            </Provider>
        </AuthProvider>
    );
}