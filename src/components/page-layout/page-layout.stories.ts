import { storiesOf } from '@storybook/vue';

import store from '@/store';
import router from '@/router';
import PageLayout from './page-layout';
import { PageModule } from '@/states/page';

storiesOf('PageLayout', module)
  .add('403', () => {
    return {
      components: { PageLayout },
      template: '<page-layout />',
      store,
      router,
      beforeCreate(): void {
        PageModule.context(store).actions.setError({ statusCode: 403 });
      },
    };
  })
  .add('404', () => {
    return {
      components: { PageLayout },
      template: '<page-layout />',
      store,
      router,
      beforeCreate(): void {
        PageModule.context(store).actions.setError({ statusCode: 404 });
      },
    };
  })
  .add('500', () => {
    return {
      components: { PageLayout },
      template: '<page-layout />',
      store,
      router,
      beforeCreate(): void {
        PageModule.context(store).actions.setError({ statusCode: 500 });
      },
    };
  })
  .add('loading', () => {
    return {
      components: { PageLayout },
      template: '<page-layout />',
      store,
      router,
      beforeCreate(): void {
        PageModule.context(store).actions.setIsLoading(true);
      },
    };
  })
  .add('hide header', () => {
    return {
      components: { PageLayout },
      template: `<page-layout :hide-header="true">Some content</page-layout>`,
      store,
      router,
    };
  })
  .add('hide footer', () => {
    return {
      components: { PageLayout },
      template: `<page-layout :hide-footer="true">Some content</page-layout>`,
      store,
      router,
    };
  });
