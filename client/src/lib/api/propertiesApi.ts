import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface Property {
    id: string;
    name: string;
    description: string;
    pricePerMonth: number;
    securityDeposit: number;
    applicationFee: number;
    photoUrls: string[];
    isPetsAllowed: boolean;
    isParkingIncluded: boolean;
    beds: number;
    baths: number;
    squareFeet: number | null;
    propertyType: string;
    averageRating: number | null;
    numberOfReviews: number;
    isAvailable: boolean;
    location: {
        id: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        latitude: number | null;
        longitude: number | null;
    };
    amenities: { id: string; type: string }[];
}

export interface PropertyFilters {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    propertyType?: string;
    isPetsAllowed?: boolean;
    isParkingIncluded?: boolean;
}

export interface CreatePropertyArgs {
    name: string;
    description: string;
    pricePerMonth: number;
    securityDeposit: number;
    applicationFee: number;
    isPetsAllowed: boolean;
    isParkingIncluded: boolean;
    beds: number;
    baths: number;
    propertyType: string;
    photoUrls?: string[];
    squareFeet?: number;
    isAvailable?: boolean;
    location?: Partial<Omit<Property["location"], "id">>;
    amenities?: { type: string }[];
}

export const propertiesApi = createApi({
    reducerPath: "propertiesApi",
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
    tagTypes: ["Property"],
    endpoints: (builder) => ({
        getProperties: builder.query<{ data: Property[]; count: number }, PropertyFilters>({
            query: (filters = {}) => {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        params.append(key, String(value));
                    }
                });
                return `/properties?${params.toString()}`;
            },
            providesTags: ["Property"],
        }),

        getPropertyById: builder.query<{ data: Property }, string>({
            query: (id) => `/properties/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Property", id }],
        }),

        createProperty: builder.mutation<{ data: Property }, CreatePropertyArgs>({
            query: (body) => ({
                url: "/properties",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Property"],
        }),

        updateProperty: builder.mutation<
            { data: Property },
            { id: string; body: Partial<CreatePropertyArgs> }
        >({
            query: ({ id, body }) => ({
                url: `/properties/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Property", id }],
        }),

        deleteProperty: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/properties/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Property"],
        }),
    }),
});

export const {
    useGetPropertiesQuery,
    useGetPropertyByIdQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
} = propertiesApi;