import { create } from "zustand";
import { deleteData, fetchData,patchData,postData } from "../services/api";

interface AppState {
        
    globalAlertNotification: {
        message: string;
        type: "success" | "error" | "canceled" | null;
      };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataImages: any;
    errorGetImages: string | null;
    loadingImages: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    imageDetails: {
        id: string;
        name: string;
        image: string;
        type: number;
    }
    successImageDetails: boolean;
    errorGetImageDetails: string | null;
    loadingImageDetails: boolean;
    dataPatchImage: unknown;
    loadingPatch:boolean,
    errorPatch:string | null,
    successPatch:boolean,
    dataDeleteImage: unknown;
    loadingDelete:boolean,
    errorDelete:string | null,
    successDelete:boolean,
    dataAddImage: unknown;
    loadingAddImage:boolean,
    errorAddImage:string | null,
    successAddImage:boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dynamictable:any,
    loadingDynamicTable:boolean,
    errorDynamicTable:string | null,
    successDynamicTable:boolean,

    fetchDataDynamicTable: (endpoint: string) => Promise<void>;
    
   fetchDataImages: (endpoint: string) => Promise<void>;
   resetImageDetails: () => void;
   resetDynamicTable: () => void;
    fetchDataImageDetails: (endpoint: string) => Promise<void>;
    patchImage: (endpoint: string, data: unknown) => Promise<void>;
    deleteImage: (endpoint: string) => Promise<void>;
    addImage: (endpoint: string, data: unknown) => Promise<void>;
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
dataCategories: any;
loadingCategories: boolean;
errorGetCategories: string | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
dataSubcategories: any;
loadingSubcategories: boolean;
errorGetSubcategories: string | null;

fetchDataCategories: (endpoint: string) => Promise<void>;
fetchDataSubcategories: (endpoint: string) => Promise<void>;
 

}

const ImagesStore = create<AppState>((set) => ({

    globalAlertNotification: {
        message: "",
        type: null,
      },
    dataImages: [],
    errorGetImages: null,
    loadingImages: false,
    imageDetails: {
        id: "",
        name: "",
        image: "",
        type: 0, // Assuming type is a number, adjust if necessary
    },
    successImageDetails: false,
    errorGetImageDetails: null,
    loadingImageDetails: false,
    dataPatchImage: null,
    loadingPatch: false,
    errorPatch: null,
    successPatch: false,
    dataDeleteImage: null,
    loadingDelete: false,
    errorDelete: null,
    successDelete: false,
    dataAddImage: null,
    loadingAddImage: false,
    errorAddImage: null,
    successAddImage: false,

    dataCategories: [],
    loadingCategories: false,
    errorGetCategories: null,

    dataSubcategories: [],
    loadingSubcategories: false,
    errorGetSubcategories: null,

    dynamictable: {},
    loadingDynamicTable: false,
    errorDynamicTable: null,
    successDynamicTable: false,

    fetchDataCategories: async (endpoint) => {
        try {
            set({ loadingCategories: true, errorGetCategories: null });
            const response = await fetchData(endpoint);
            set({ dataCategories: response.data, loadingCategories: false });
        } catch (error: unknown) {
            set({ errorGetCategories: error instanceof Error ? error.message : String(error), loadingCategories: false });
        }
    },

    fetchDataSubcategories: async (endpoint) => {
        try {
            // console.log("walid ");
            set({ loadingSubcategories: true, errorGetSubcategories: null });
            const response = await fetchData(endpoint);
            set({ dataSubcategories: response.data, loadingSubcategories: false });
        } catch (error: unknown) {
            set({ errorGetSubcategories: error instanceof Error ? error.message : String(error), loadingSubcategories: false });
        }
    },

    fetchDataImages: async (endpoint) => {
        try {
            set({ loadingImages: true, errorGetImages: null });
            const response = await fetchData(endpoint);
console.log("images", response.data);
            set({ dataImages: response.data, loadingImages: false });
        } catch (error: unknown) {
            set({ errorGetImages: error instanceof Error ? error.message : String(error), loadingImages: false });
        }
    },

    resetImageDetails: () => {
        set({ imageDetails: {
            id: "",
            name: "",
            image: "",
            type: 0, // Assuming type is a number, adjust if necessary
          }, errorGetImageDetails: null, successImageDetails: false, loadingImageDetails: false });
    },
    
    resetDynamicTable: () => {
        set({ dynamictable: {}, errorDynamicTable: null, loadingDynamicTable: false });
    },

    fetchDataDynamicTable: async (endpoint) => {
        try {
            set({ loadingDynamicTable: true, errorDynamicTable: null });
            const response = await fetchData(endpoint);

            set({ dynamictable: response.data, loadingDynamicTable: false });
        } catch (error: unknown) {
            set({ errorDynamicTable: error instanceof Error ? error.message : String(error), loadingDynamicTable: false });
        }
    },

    fetchDataImageDetails: async (endpoint) => {
        try {
            set({ loadingImageDetails: true, errorGetImageDetails: null , successImageDetails: false });
            const response = await fetchData(endpoint);
            set({ imageDetails: response.data as AppState["imageDetails"], loadingImageDetails: false , successImageDetails: true });
        } catch (error: unknown) {
            set({ errorGetImageDetails: error instanceof Error ? error.message : String(error), loadingImageDetails: false , successImageDetails: false });
        }
    },

    patchImage: async (endpoint, data) => {
        try {
            set({ loadingPatch: true, errorPatch: null , successPatch: false });
            const response = await patchData(endpoint, data);
            set({ dataPatchImage: response.data, successPatch: true, loadingPatch: false , globalAlertNotification: { message: "Image updated successfully", type: "success" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        } catch (error: unknown) {
            set({ errorPatch: error instanceof Error ? error.message : String(error), loadingPatch: false, successPatch: false, globalAlertNotification: { message: "Failed to update image", type: "error" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        }
    },

    deleteImage: async (endpoint) => {
        try {
            set({ loadingDelete: true, errorDelete: null ,successDelete: false});
            const response = await deleteData(endpoint);
            set({ dataDeleteImage: response.data, successDelete: true, loadingDelete: false , globalAlertNotification: { message: "Image deleted successfully", type: "success" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        } catch (error: unknown) {
            set({ errorDelete: error instanceof Error ? error.message : String(error), loadingDelete: false , successDelete: false, globalAlertNotification: { message: "Failed to delete image", type: "error" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        }
    },

    addImage: async (endpoint, data) => {
        try {
            set({ loadingAddImage: true, errorAddImage: null, successAddImage: false });
            const response = await postData(endpoint, data);
            set({ dataAddImage: response.data, successAddImage: true, loadingAddImage: false , globalAlertNotification: { message: "Image added successfully", type: "success" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        } catch (error: unknown) {
            set({ errorAddImage: error instanceof Error ? error.message : String(error), loadingAddImage: false, globalAlertNotification: { message: "Failed to add image", type: "error" } });
        
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);}
    },
}));

export default ImagesStore;
