import { QueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import Axios from "axios";

import LocalServices from "../local";

const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       *The gc time must equal or higher than the persist query client maxAge 
       @default 24 hours
       if you want to set lower pls set also in persist client maxAge
       */
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1 * 60 * 1000,
    },
  },
});

const AXIOS_INSTANCE = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  //Ignore authorization header for login and register api
  if (config.url === "/register" || config.url === "/login") {
    config.headers.Authorization = null;
    return config;
  }

  const storageTokenData = LocalServices.getItem("ACCESS_TOKEN");
  if (storageTokenData) {
    config.headers.Authorization = `Bearer ${storageTokenData}`;
  }

  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  },
);

export const axiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;
