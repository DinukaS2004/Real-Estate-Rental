import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    isSearchMapOpen: boolean;
    searchFilters: {
        city: string;
        minPrice: string;
        maxPrice: string;
        beds: string;
        baths: string;
        propertyType: string;
    };
}

const initialState: UIState = {
    isSearchMapOpen: false,
    searchFilters: {
        city: "",
        minPrice: "",
        maxPrice: "",
        beds: "",
        baths: "",
        propertyType: "",
    },
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSearchMap: (state) => {
            state.isSearchMapOpen = !state.isSearchMapOpen;
        },
        setSearchFilters: (
            state,
            action: PayloadAction<Partial<UIState["searchFilters"]>>
        ) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },
        clearSearchFilters: (state) => {
            state.searchFilters = initialState.searchFilters;
        },
    },
});

export const { toggleSearchMap, setSearchFilters, clearSearchFilters } =
    uiSlice.actions;
export default uiSlice.reducer;