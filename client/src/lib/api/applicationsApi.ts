import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface Application {
    id: string;
    applicationDate: string;
    status: "PENDING" | "APPROVED" | "DENIED" | "WITHDRAWN";
    message: string | null;
    moveInDate: string | null;
    name: string;
    email: string;
    phoneNumber: string;
    property: {
        id: string;
        name: string;
        pricePerMonth: number;
        location: { city: string; state: string };
    };
}

export const applicationsApi = createApi({
    reducerPath: "applicationsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Application"],
    endpoints: (builder) => ({
        getApplications: builder.query<{ data: Application[] }, void>({
            query: () => "/applications",
            providesTags: ["Application"],
        }),

        submitApplication: builder.mutation<
            { data: Application },
            {
                propertyId: string;
                name: string;
                email: string;
                phoneNumber: string;
                message?: string;
                moveInDate?: string;
            }
        >({
            query: (body) => ({
                url: "/applications",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Application"],
        }),

        updateApplicationStatus: builder.mutation<
            { data: Application },
            { id: string; status: Application["status"] }
        >({
            query: ({ id, status }) => ({
                url: `/applications/${id}/status`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Application"],
        }),

        withdrawApplication: builder.mutation<{ data: Application }, string>({
            query: (id) => ({
                url: `/applications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Application"],
        }),
    }),
});

export const {
    useGetApplicationsQuery,
    useSubmitApplicationMutation,
    useUpdateApplicationStatusMutation,
    useWithdrawApplicationMutation,
} = applicationsApi;