import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '@/store';
import { AuthModule } from '@/states/auth';
import router, { RoutesNamesEnum } from '@/router';

export type ExtendedAxiosRequestConfig = AxiosRequestConfig;

// Вставляет в заголовок запроса `Bearer JWT Token`
export function setAuthHeader(config: ExtendedAxiosRequestConfig, token: string) {
  const headers = config.headers.common || config.headers;
  headers['Authorization'] = `Bearer ${token}`;
  return config;
}

function interceptorBeforeRequestIsSent(
  this: AxiosInstance,
  config: ExtendedAxiosRequestConfig
): ExtendedAxiosRequestConfig | Promise<ExtendedAxiosRequestConfig> {
  // Do something before request is sent
  const token = (config.headers.common || config.headers || {})['Authorization'];
  if (!token && store.state.auth.token) {
    setAuthHeader(config, store.state.auth.token);
  }
  return config;
}

function interceptorWithRequestError(this: AxiosInstance, error: any): Promise<never> {
  // Do something with request error
  return Promise.reject(error);
}

function interceptorWithResponseSuccess(
  this: AxiosInstance,
  response: AxiosResponse
): AxiosResponse | Promise<AxiosResponse> {
  // Do something with response data
  return response;
}

function interceptorWithResponseError(this: AxiosInstance, error: any): Promise<never> {
  // Do something with response error
  if (
    error.response &&
    error.response.data &&
    error.response.data.message &&
    error.response.data.message.includes('banned')
  ) {
    router.replace({
      name: RoutesNamesEnum.block,
    });
  }
  if (error.response?.status === 401) {
    AuthModule.context(store).actions.logoutUser();
  }
  return Promise.reject(error);
}

const AxiosConfig: ExtendedAxiosRequestConfig = {
  baseURL: process.env.VUE_APP_BASE_API_URL,
};

const defaultAxiosInstance = axios.create(AxiosConfig);

defaultAxiosInstance.interceptors.request.use(
  interceptorBeforeRequestIsSent.bind(defaultAxiosInstance),
  interceptorWithRequestError.bind(defaultAxiosInstance)
);
defaultAxiosInstance.interceptors.response.use(
  interceptorWithResponseSuccess.bind(defaultAxiosInstance),
  interceptorWithResponseError.bind(defaultAxiosInstance)
);

export default defaultAxiosInstance;
