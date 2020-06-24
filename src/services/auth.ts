import HTTP, { ExtendedAxiosRequestConfig, setAuthHeader } from '@/services/http-common';
import { AxiosPromise } from 'axios';

export type V1LoginRequestData = {
  auth: string; // token from notification
};
export type V1LoginResponseData = {
  token: string; // JWT token
};

export class V1AuthService {
  public static URLs: Readonly<Record<string, (...args: any[]) => string>> = {
    register: () => '/api/v1/auth/signup',
    login: () => '/api/v1/auth/signin',
    refresh: () => '/api/v1/auth/refresh',
    check: () => '/api/v1/auth/check',
    oAuthOpenRu: () => '/api/v1/auth/oauth',
  };

  public static register(data: V1LoginRequestData): AxiosPromise<V1LoginResponseData> {
    return HTTP.post(this.URLs.register(), data);
  }

  public static login(data: V1LoginRequestData, config: ExtendedAxiosRequestConfig): AxiosPromise<V1LoginResponseData> {
    return HTTP.post(this.URLs.login(), data, config);
  }

  public static refresh(): AxiosPromise<V1LoginResponseData> {
    return HTTP.get(this.URLs.refresh());
  }

  public static check({ token }: { token: V1LoginResponseData['token'] }): AxiosPromise<null> {
    const config: ExtendedAxiosRequestConfig = { headers: {} };
    setAuthHeader(config, token);
    return HTTP.get(this.URLs.check(), config);
  }

  public static oAuthOpenRuLoginLink(): AxiosPromise<{ link: string }> {
    return HTTP.get(this.URLs.oAuthOpenRu());
  }

  public static oAuthOpenRuLogin(data: { auth: string }): AxiosPromise<V1LoginResponseData> {
    return HTTP.post(this.URLs.oAuthOpenRu(), data);
  }
}
