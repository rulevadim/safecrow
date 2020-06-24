import { Mutations } from 'vuex-smart-module';
import { PageBreakpointName, PageState, PageError } from './state';

export class PageMutations extends Mutations<PageState> {
  setIsLoading(isLoading: boolean) {
    this.state.isLoading = isLoading;
  }

  setError(errorPayload: PageError) {
    this.state.error = errorPayload;
  }

  clearError() {
    this.state.error = null;
  }

  setPageBreakpoint(payload: { name: PageBreakpointName }) {
    this.state.breakpointName = payload.name;
  }
}
