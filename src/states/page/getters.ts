import { Getters } from 'vuex-smart-module';
import { PageState } from './state';

export class PageGetters extends Getters<PageState> {
  isLoggedIn() {
    return this.state.error;
  }

  getIsLoading() {
    return this.state.isLoading;
  }
}
