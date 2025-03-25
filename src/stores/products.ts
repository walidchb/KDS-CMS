import { create } from "zustand";
import { deleteData, fetchData,patchData,postData } from "../services/api";

interface AppState {
    products: unknown;
    errorGetProducts: string | null;
    loadingProducts: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productDetails: any;
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
    
   fetchDataProducts: (endpoint: string) => Promise<void>;
    fetchDataProductDetails: (endpoint: string) => Promise<void>;
    patchProduct: (endpoint: string, data: unknown) => Promise<void>;
    deleteProduct: (endpoint: string) => Promise<void>;
    addProduct: (endpoint: string, data: unknown) => Promise<void>;
  
 

}

const ProductsStore = create<AppState>((set) => ({
    products: [],
    errorGetProducts: null,
    loadingProducts: false,
    productDetails: [],
    errorGetProductDetails: null,
    loadingProductDetails: false,
    dataPatchProduct: [],
    loadingPatch:false,
    errorPatch:null,
    successPatch:false,
    dataDeleteProduct: [],
    loadingDelete:false,
    errorDelete:null,
    successDelete:false,
    dataAddProduct: [],
    loadingAddProduct:false,
    errorAddProduct:null,
    successAddProduct:false,

    fetchDataProducts: async (endpoint) => {
        try {
            set({ loadingProducts: true, errorGetProducts: null });
            const response = await fetchData(endpoint);
            console.log("products list")

            console.log(response)
            set({ products: response.data, loadingProducts: false });
        } catch (error: unknown) {
            set({ errorGetProducts: error instanceof Error ? error.message : String(error), loadingProducts: false });
        }
    },

    fetchDataProductDetails: async (endpoint) => {
        try {
            set({ loadingProductDetails: true, errorGetProductDetails: null });
            const response = await fetchData(endpoint);
            console.log("products details")

            console.log(response)
            set({ productDetails: response.data, loadingProductDetails: false });
        } catch (error: unknown) {
            set({ errorGetProductDetails: error instanceof Error ? error.message : String(error), loadingProductDetails: false });
        }
    },

    patchProduct: async (endpoint, data) => {
        try {
            set({ loadingPatch: true, errorPatch: null });
            const response = await patchData(endpoint, data);
            set({ dataPatchProduct:response.data, successPatch: true, loadingPatch: false });
        } catch (error: unknown) {
            set({ errorPatch: error instanceof Error ? error.message : String(error), loadingPatch: false });
        }
    },

    deleteProduct: async (endpoint) => {
        try {
            set({ loadingDelete: true, errorDelete: null });
            const response = await deleteData(endpoint);
            set({ dataDeleteProduct:response.data, successDelete: true, loadingDelete: false });
        } catch (error: unknown) {
            set({ errorDelete: error instanceof Error ? error.message : String(error), loadingDelete: false });
        }
    },

    addProduct: async (endpoint, data) => {
        try {
            set({ loadingAddProduct: true, errorAddProduct: null });
            const response = await postData(endpoint, data);
            set({ dataAddProduct:response.data, successAddProduct: true, loadingAddProduct: false });
        } catch (error: unknown) {
            set({ errorAddProduct: error instanceof Error ? error.message : String(error), loadingAddProduct: false });
        }
    },
 

  
 

 
}));

export default ProductsStore;
