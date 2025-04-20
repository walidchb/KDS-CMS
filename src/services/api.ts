import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "/api";
// const BASE_URL = "https://admin-backend.ghk49.net/api/";

// const BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND;



const api = axios.create({
  baseURL: BASE_URL,
});







const retryRequest = async <T>(requestFunc: () => Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> => {
  try {
    
    return await requestFunc();
  } catch (error) {
  //  logoutUser();
    throw error;
  }
};

export const fetchData = async <T>(endpoint: string, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T>> => {
  
  try {
    return await api.get<T>(endpoint, config);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      return retryRequest(() => api.get<T>(endpoint, config));
    }
    throw error;
  }
};

export const postData = async <T, K = unknown>(endpoint: string, data: T, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T, K>> => {
  
  try {
    return await api.post<T, AxiosResponse<T, K>>(endpoint, data, config);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      return retryRequest(() => api.post<T, AxiosResponse<T, K>>(endpoint, data, config));
    }
    throw error;
  }
};

export const putData = async <T>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> => {
  
  try {
    return await api.put<T>(endpoint, data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      return retryRequest(() => api.put<T>(endpoint, data));
    }
    throw error;
  }
};

export const patchData = async <T, K = unknown>(endpoint: string, data?: unknown, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T, K>> => {
  
  try {
    return await api.patch<T, AxiosResponse<T, K>>(endpoint, data, config);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      return retryRequest(() => api.patch<T, AxiosResponse<T, K>>(endpoint, data, config));
    }
    throw error;
  }
};

export const deleteData = async <T>(endpoint: string): Promise<AxiosResponse<T>> => {
  
  try {
    return await api.delete<T>(endpoint);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      return retryRequest(() => api.delete<T>(endpoint));
    }
    throw error;
  }
};
