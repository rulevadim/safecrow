import { Actions } from 'vuex-smart-module';
import { PageGetters } from './getters';
import { PageMutations } from './mutations';
import { PageState, PageError, PageBreakpointName } from './state';

export class PageActions extends Actions<PageState, PageGetters, PageMutations, PageActions> {
  setIsLoading(isLoading: boolean) {
    this.mutations.setIsLoading(isLoading);
    return Promise.resolve();
  }

  setError(payload: PageError) {
    if (!payload) {
      this.dispatch('clearError');
      return Promise.resolve();
    }
    this.mutations.setError(payload);
    return Promise.resolve();
  }

  clearError() {
    this.mutations.clearError();
    return Promise.resolve();
  }

  setPageBreakpoint(payload: { name: PageBreakpointName }) {
    this.mutations.setPageBreakpoint(payload);
    return Promise.resolve();
  }
}
