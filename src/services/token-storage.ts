import JwtDecode from 'jwt-decode';

export type JwtTokenPayload = {
  b64info: string; // ""
  exp: number; // 1568877670
  iat: number; // 1568877370
  info: string; // ""
  sub: string; // "6ba7b810-9dad-11d1-80b4-11c04fd430c8"
};

export class TokenStorageService {
  public static readonly key: string = 'authToken';
  public static readonly registerKey: string = 'registerToken';

  public static setToken(token: string): void {
    localStorage.setItem(this.key, token);
  }

  public static getToken(): string {
    return localStorage.getItem(this.key);
  }

  public static removeToken(): void {
    localStorage.removeItem(this.key);
  }

  public static setRegisterToken(token: string): void {
    localStorage.setItem(this.registerKey, token);
  }

  public static getRegisterToken(): string {
    return localStorage.getItem(this.registerKey);
  }

  public static removeRegisterToken(): void {
    localStorage.removeItem(this.registerKey);
  }

  public static getTokenPayload(token: string, options?: JwtDecode.Options): JwtTokenPayload {
    return JwtDecode<JwtTokenPayload>(token, options);
  }
}
