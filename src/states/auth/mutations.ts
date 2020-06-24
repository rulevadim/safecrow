import { Mutations } from 'vuex-smart-module';
import { AuthState } from './state';

export class AuthMutations extends Mutations<AuthState> {
  setUser(user: AuthState['user']) {
    this.state.user = user;
  }

  setToken(token: AuthState['token']) {
    this.state.token = token;
  }

  setTokenPayload(tokenPayload: AuthState['tokenPayload']) {
    this.state.tokenPayload = tokenPayload;
  }
}
