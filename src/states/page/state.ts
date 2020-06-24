export type PageError = {
  statusCode: number;
  componentName?: string;
  componentProps?: { [key: string]: any };
};

export type PageBreakpointName = 'xs' | 'sm' | 'xl';

export class PageState {
  error: PageError = null;
  isLoading = false;
  breakpointName: PageBreakpointName = null;
}
