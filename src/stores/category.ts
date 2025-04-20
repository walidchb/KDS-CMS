import { create } from "zustand";
import { deleteData, fetchData, patchData, postData } from "../services/api";

interface CategoryState {
    // Categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataCategories: any;
    loadingCategories: boolean;
    errorCategories: string | null;
    successCategories: boolean;

    // Subcategories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSubcategories: any;
    loadingSubcategories: boolean;
    errorSubcategories: string | null;
    successSubcategories: boolean;

    // CRUD states for Categories
    dataAddCategory: unknown;
    loadingAddCategory: boolean;
    errorAddCategory: string | null;
    successAddCategory: boolean;

    dataDeleteCategory: unknown;
    loadingDeleteCategory: boolean;
    errorDeleteCategory: string | null;
    successDeleteCategory: boolean;

    dataPatchCategory: unknown;
    loadingPatchCategory: boolean;
    errorPatchCategory: string | null;
    successPatchCategory: boolean;

    // CRUD states for Subcategories
    dataAddSubcategory: unknown;
    loadingAddSubcategory: boolean;
    errorAddSubcategory: string | null;
    successAddSubcategory: boolean;

    dataDeleteSubcategory: unknown;
    loadingDeleteSubcategory: boolean;
    errorDeleteSubcategory: string | null;
    successDeleteSubcategory: boolean;

    dataPatchSubcategory: unknown;
    loadingPatchSubcategory: boolean;
    errorPatchSubcategory: string | null;
    successPatchSubcategory: boolean;

    // Methods
    fetchCategories: (endpoint: string) => Promise<void>;
    fetchSubcategories: (endpoint: string) => Promise<void>;

    addCategory: (endpoint: string, data: unknown) => Promise<void>;
    deleteCategory: (endpoint: string) => Promise<void>;
    patchCategory: (endpoint: string, data: unknown) => Promise<void>;

    addSubcategory: (endpoint: string, data: unknown) => Promise<void>;
    deleteSubcategory: (endpoint: string) => Promise<void>;
    patchSubcategory: (endpoint: string, data: unknown) => Promise<void>;
}

const CategoryStore = create<CategoryState>((set) => ({
    // Initial states
    dataCategories: [],
    loadingCategories: false,
    errorCategories: null,
    successCategories: false,

    dataSubcategories: [],
    loadingSubcategories: false,
    errorSubcategories: null,
    successSubcategories: false,

    dataAddCategory: null,
    loadingAddCategory: false,
    errorAddCategory: null,
    successAddCategory: false,

    dataDeleteCategory: null,
    loadingDeleteCategory: false,
    errorDeleteCategory: null,
    successDeleteCategory: false,

    dataPatchCategory: null,
    loadingPatchCategory: false,
    errorPatchCategory: null,
    successPatchCategory: false,

    dataAddSubcategory: null,
    loadingAddSubcategory: false,
    errorAddSubcategory: null,
    successAddSubcategory: false,

    dataDeleteSubcategory: null,
    loadingDeleteSubcategory: false,
    errorDeleteSubcategory: null,
    successDeleteSubcategory: false,

    dataPatchSubcategory: null,
    loadingPatchSubcategory: false,
    errorPatchSubcategory: null,
    successPatchSubcategory: false,

    // Fetch categories
    fetchCategories: async (endpoint) => {
        try {
            set({ loadingCategories: true, errorCategories: null });
            const response = await fetchData(endpoint);
            set({ dataCategories: response.data, loadingCategories: false, successCategories: true });
        } catch (error: unknown) {
            set({ errorCategories: error instanceof Error ? error.message : String(error), loadingCategories: false });
        }
    },

    // Fetch subcategories
    fetchSubcategories: async (endpoint) => {
        try {
            set({ loadingSubcategories: true, errorSubcategories: null });
            const response = await fetchData(endpoint);
            set({ dataSubcategories: response.data, loadingSubcategories: false, successSubcategories: true });
        } catch (error: unknown) {
            set({ errorSubcategories: error instanceof Error ? error.message : String(error), loadingSubcategories: false });
        }
    },

    // Add category
    addCategory: async (endpoint, data) => {
        try {
            set({ loadingAddCategory: true, errorAddCategory: null });
            const response = await postData(endpoint, data);
            set({ dataAddCategory: response.data, successAddCategory: true, loadingAddCategory: false });
        } catch (error: unknown) {
            set({ errorAddCategory: error instanceof Error ? error.message : String(error), loadingAddCategory: false });
        }
    },

    // Delete category
    deleteCategory: async (endpoint) => {
        try {
            set({ loadingDeleteCategory: true, errorDeleteCategory: null });
            const response = await deleteData(endpoint);
            set({ dataDeleteCategory: response.data, successDeleteCategory: true, loadingDeleteCategory: false });
        } catch (error: unknown) {
            set({ errorDeleteCategory: error instanceof Error ? error.message : String(error), loadingDeleteCategory: false });
        }
    },

    // Patch category
    patchCategory: async (endpoint, data) => {
        try {
            set({ loadingPatchCategory: true, errorPatchCategory: null });
            const response = await patchData(endpoint, data);
            set({ dataPatchCategory: response.data, successPatchCategory: true, loadingPatchCategory: false });
        } catch (error: unknown) {
            set({ errorPatchCategory: error instanceof Error ? error.message : String(error), loadingPatchCategory: false });
        }
    },

    // Add subcategory
    addSubcategory: async (endpoint, data) => {
        try {
            set({ loadingAddSubcategory: true, errorAddSubcategory: null });
            const response = await postData(endpoint, data);
            set({ dataAddSubcategory: response.data, successAddSubcategory: true, loadingAddSubcategory: false });
        } catch (error: unknown) {
            set({ errorAddSubcategory: error instanceof Error ? error.message : String(error), loadingAddSubcategory: false });
        }
    },

    // Delete subcategory
    deleteSubcategory: async (endpoint) => {
        try {
            set({ loadingDeleteSubcategory: true, errorDeleteSubcategory: null });
            const response = await deleteData(endpoint);
            set({ dataDeleteSubcategory: response.data, successDeleteSubcategory: true, loadingDeleteSubcategory: false });
        } catch (error: unknown) {
            set({ errorDeleteSubcategory: error instanceof Error ? error.message : String(error), loadingDeleteSubcategory: false });
        }
    },

    // Patch subcategory
    patchSubcategory: async (endpoint, data) => {
        try {
            set({ loadingPatchSubcategory: true, errorPatchSubcategory: null });
            const response = await patchData(endpoint, data);
            set({ dataPatchSubcategory: response.data, successPatchSubcategory: true, loadingPatchSubcategory: false });
        } catch (error: unknown) {
            set({ errorPatchSubcategory: error instanceof Error ? error.message : String(error), loadingPatchSubcategory: false });
        }
    },
}));

export default CategoryStore;
