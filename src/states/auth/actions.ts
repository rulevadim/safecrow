import { Actions } from 'vuex-smart-module';
import router, { RoutesNamesEnum } from '@/router';

import { AuthState } from './state';
import { AuthGetters } from './getters';
import { AuthMutations } from './mutations';

import { V1AuthService } from '@/services/auth';
import { TokenStorageService } from '@/services/token-storage';
import { setAuthHeader } from '@/services/http-common';

let delayedTokenRefreshRequestTimerId: number;

export class AuthActions extends Actions<AuthState, AuthGetters, AuthMutations, AuthActions> {
  init(): any {
    const token = TokenStorageService.getToken();
    if (!token) {
      return;
    }
    return V1AuthService.check({ token })
      .then(() => {
        return this.dispatch('setToken', { token });
      })
      .then(() => {
        this.mutations.setUser({ id: null, email: null });
      });
  }

  setToken(payload?: { token: AuthState['token'] }) {
    if (payload?.token) {
      try {
        const tokenPayload = TokenStorageService.getTokenPayload(payload.token);
        TokenStorageService.setToken(payload.token);
        this.mutations.setToken(payload.token);
        this.mutations.setTokenPayload(tokenPayload);
        const delay = (tokenPayload.exp * 1000 - Number(Date.now())) * 0.7;
        clearTimeout(delayedTokenRefreshRequestTimerId);
        delayedTokenRefreshRequestTimerId = window.setTimeout(() => {
          this.dispatch('refreshToken');
        }, delay);
      } catch (e) {
        // if token is broken
        this.dispatch('logoutUser');
        throw e;
      }
    } else {
      this.dispatch('logoutUser');
    }
  }

  loginUser(payload: { auth: string; registerToken: string }): any {
    const config = { headers: {} };
    if (payload.registerToken) {
      setAuthHeader(config, payload.registerToken);
    }
    return V1AuthService.login({ auth: payload.auth }, config).then(resp => {
      return this.dispatch('setToken', { token: resp.data.token }).then(() => {
        TokenStorageService.removeRegisterToken();
        this.mutations.setUser({ id: null, email: null });
        return resp;
      });
    });
  }

  oauthLoginUser(payload: { auth: string }): any {
    return V1AuthService.oAuthOpenRuLogin({ auth: payload.auth }).then(resp => {
      return this.dispatch('setToken', { token: resp.data.token }).then(() => {
        this.mutations.setUser({ id: null, email: null });
        return resp;
      });
    });
  }

  refreshToken() {
    return V1AuthService.refresh().then(resp => {
      this.dispatch('setToken', { token: resp.data.token });
      return resp;
    });
  }

  registerUser(payload: { auth: string }) {
    return (
      V1AuthService.register({ auth: payload.auth })
        .then(resp => {
          TokenStorageService.setRegisterToken(resp.data.token);
          return resp;
        })
        // eslint-disable-next-line no-console
        .catch((error: Error) => console.log(error))
    );
  }

  loadRegisterToken() {
    const registerToken = TokenStorageService.getRegisterToken();
    if (!registerToken) {
      return Promise.reject('Register token is not found.');
    }
    let registerTokenPayload;
    try {
      registerTokenPayload = TokenStorageService.getTokenPayload(registerToken);
    } catch (e) {
      return Promise.reject(e);
    }
    if (registerTokenPayload.exp < Number(Date.now()) / 1000) {
      return Promise.reject('Register token is expired.');
    }
    return { registerToken, registerTokenPayload };
  }

  logoutUser(payload: { disableCheckRoute: boolean } = { disableCheckRoute: false }) {
    clearTimeout(delayedTokenRefreshRequestTimerId);
    this.mutations.setToken(null);
    this.mutations.setTokenPayload(null);
    this.mutations.setUser(null);
    TokenStorageService.removeToken();

    if (!payload.disableCheckRoute && (router.currentRoute.meta || {}).requiresAuth) {
      router.push({
        name: process.env.VUE_APP_PARTNER === 'alfabank-ru' ? RoutesNamesEnum.home : RoutesNamesEnum.authLogin,
      });
    }
  }
}
