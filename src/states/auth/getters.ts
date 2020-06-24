import { Getters } from 'vuex-smart-module';
import { AuthState } from './state';

export class AuthGetters extends Getters<AuthState> {
  isLoggedIn() {
    return Boolean(this.state.user);
  }

  userId() {
    return this.state.tokenPayload?.sub;
  }
}
