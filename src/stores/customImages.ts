
import { create } from "zustand";
import {  fetchData } from "../services/api";

interface AppState {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataCustomImages: any;
    errorGetCustomImages: string | null;
    loadingCustomImages: boolean;

    fetchDataCustomImages: (endpoint: string) => Promise<void>;

}

const CustomImagesStore = create<AppState>((set) => ({

   
    dataCustomImages: [],
    errorGetCustomImages: null,
    loadingCustomImages: false,
   
    fetchDataCustomImages: async (endpoint) => {
        try {
            set({ loadingCustomImages: true, errorGetCustomImages: null });
            const response = await fetchData(endpoint);
console.log("customImages", response.data);
            set({ dataCustomImages: response.data, loadingCustomImages: false });
        } catch (error: unknown) {
            set({ errorGetCustomImages: error instanceof Error ? error.message : String(error), loadingCustomImages: false });
        }
    },

   
}));

export default CustomImagesStore;
