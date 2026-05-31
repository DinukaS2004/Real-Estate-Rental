"use client";

import { useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setCredentials, clearCredentials } from "@/lib/store/authSlice";
import axios from "axios";

export default function AuthSync() {
    const { state, getAccessToken } = useAuthContext();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const sync = async () => {
            if (state.isAuthenticated) {
                try {
                    const token = await getAccessToken();

                    // Sync user with your database
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const dbUser = response.data.data;

                    dispatch(
                        setCredentials({
                            user: {
                                id: dbUser.id,
                                email: dbUser.email,
                                name: dbUser.name,
                                role: dbUser.role,
                            },
                            token,
                        })
                    );
                } catch (err) {
                    console.error("Auth sync failed:", err);
                }
            } else {
                dispatch(clearCredentials());
            }
        };

        sync();
    }, [state.isAuthenticated, getAccessToken]);

    return null; // renders nothing — just syncs state
}