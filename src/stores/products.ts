import { create } from "zustand";
import { deleteData, fetchData,patchData,postData } from "../services/api";

interface AppState {
        
    globalAlertNotification: {
        message: string;
        type: "success" | "error" | "canceled" | null;
      };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Dataproducts: any;
    errorGetProducts: string | null;
    loadingProducts: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productDetails: {
        id: string;
        name: string;
        ref?: string;
        specName?: string;
        description: string;
        ListDescription: Array<{
            id: string;
            description: string;
        }>;
        Category: {
            id: string;
            name: string;
        };
        SubCategory: {
            id: string;
            name: string;
        };
        DynamicProduct: Array<{
            fields: {
                name: string[];
                price: string[];
                category: string[];
            };
        }>;
        ImageProduct: Array<{
            
            image: string;
        }>;
        technicalSheet?: string | File| null; // Assuming technicalSheet is a string URL
        customImages: Array<{
            customImage: {
                id: string;
                name: string;
                image: string;
                type: number; // Assuming type is a number
            };
        }>;
       
    };
    successProductDetails: boolean;
    errorGetProductDetails: string | null;
    loadingProductDetails: boolean;
    dataPatchProduct: unknown;
    loadingPatch:boolean,
    errorPatch:string | null,
    successPatch:boolean,
    dataDeleteProduct: unknown;
    loadingDelete:boolean,
    errorDelete:string | null,
    successDelete:boolean,
    dataAddProduct: unknown;
    loadingAddProduct:boolean,
    errorAddProduct:string | null,
    successAddProduct:boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dynamictable:any,
    loadingDynamicTable:boolean,
    errorDynamicTable:string | null,
    successDynamicTable:boolean,

    fetchDataDynamicTable: (endpoint: string) => Promise<void>;
    
   fetchDataProducts: (endpoint: string) => Promise<void>;
   resetProductDetails: () => void;
   resetDynamicTable: () => void;
    fetchDataProductDetails: (endpoint: string) => Promise<void>;
    patchProduct: (endpoint: string, data: unknown) => Promise<void>;
    deleteProduct: (endpoint: string) => Promise<void>;
    addProduct: (endpoint: string, data: unknown) => Promise<void>;
  
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

const ProductsStore = create<AppState>((set) => ({

    globalAlertNotification: {
        message: "",
        type: null,
      },
    Dataproducts: [],
    errorGetProducts: null,
    loadingProducts: false,
    productDetails: {
        id: "",
        name: "",
        description: "",
        ListDescription: [
            {
                id: "",
                description: "",
            },
        ],
        Category: {
            id: "",
            name: "",
        },
        SubCategory: {
            id: "",
            name: "",
        },
        DynamicProduct: [
            {
                fields: {
                    name: [],
                    price: [],
                    category: [],
                },
            },
        ],
        ImageProduct: [],
        customImages: [],
        technicalSheet: "", // Assuming technicalSheet is a string URL
    },
    successProductDetails: false,
    errorGetProductDetails: null,
    loadingProductDetails: false,
    dataPatchProduct: null,
    loadingPatch: false,
    errorPatch: null,
    successPatch: false,
    dataDeleteProduct: null,
    loadingDelete: false,
    errorDelete: null,
    successDelete: false,
    dataAddProduct: null,
    loadingAddProduct: false,
    errorAddProduct: null,
    successAddProduct: false,

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

    fetchDataProducts: async (endpoint) => {
        try {
            set({ loadingProducts: true, errorGetProducts: null });
            const response = await fetchData(endpoint);
// console.log("products", response.data);
            set({ Dataproducts: response.data, loadingProducts: false });
        } catch (error: unknown) {
            set({ errorGetProducts: error instanceof Error ? error.message : String(error), loadingProducts: false });
        }
    },

    resetProductDetails: () => {
        set({ productDetails: {
            id: "",
            name: "",
            description: "",
            ListDescription: [
                {
                    id: "",
                    description: "",
                },
            ],
            Category: {
                id: "",
                name: "",
            },
            SubCategory: {
                id: "",
                name: "",
            },
            DynamicProduct: [
                {
                    fields: {
                        name: [],
                        price: [],
                        category: [],
                    },
                },
            ],
            ImageProduct: [],
            customImages: [],
            technicalSheet: "", // Assuming technicalSheet is a string URL
           
        }, errorGetProductDetails: null, loadingProductDetails: false });
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

    fetchDataProductDetails: async (endpoint) => {
        try {
            set({ loadingProductDetails: true, errorGetProductDetails: null , successProductDetails: false });
            const response = await fetchData(endpoint);
            set({ productDetails: response.data as AppState["productDetails"], loadingProductDetails: false , successProductDetails: true });
        } catch (error: unknown) {
            set({ errorGetProductDetails: error instanceof Error ? error.message : String(error), loadingProductDetails: false , successProductDetails: false });
        }
    },

    patchProduct: async (endpoint, data) => {
        try {
            set({ loadingPatch: true, errorPatch: null , successPatch: false });
            const response = await patchData(endpoint, data);
            set({ dataPatchProduct: response.data, successPatch: true, loadingPatch: false , globalAlertNotification: { message: "Product updated successfully", type: "success" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        } catch (error: unknown) {
            set({ errorPatch: error instanceof Error ? error.message : String(error), loadingPatch: false, successPatch: false, globalAlertNotification: { message: "Failed to update product", type: "error" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        }
    },

    deleteProduct: async (endpoint) => {
        try {
            set({ loadingDelete: true, errorDelete: null ,successDelete: false});
            const response = await deleteData(endpoint);
            set({ dataDeleteProduct: response.data, successDelete: true, loadingDelete: false , globalAlertNotification: { message: "Product deleted successfully", type: "success" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        } catch (error: unknown) {
            set({ errorDelete: error instanceof Error ? error.message : String(error), loadingDelete: false , successDelete: false, globalAlertNotification: { message: "Failed to delete product", type: "error" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        }
    },

    addProduct: async (endpoint, data) => {
        try {
            set({ loadingAddProduct: true, errorAddProduct: null, successAddProduct: false });
            const response = await postData(endpoint, data);
            set({ dataAddProduct: response.data, successAddProduct: true, loadingAddProduct: false , globalAlertNotification: { message: "Product added successfully", type: "success" } });
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);
        } catch (error: unknown) {
            set({ errorAddProduct: error instanceof Error ? error.message : String(error), loadingAddProduct: false, globalAlertNotification: { message: "Failed to add product", type: "error" } });
        
            setTimeout(() => {
                set({ globalAlertNotification: { message: "", type: null } });
            }, 2000);}
    },
}));

export default ProductsStore;
