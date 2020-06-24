import Vue from 'vue';
import Router, { RawLocation } from 'vue-router';
import store from './store';
import { PageModule } from './states/page';
import { AuthModule } from './states/auth';
import { OrdersListModule } from './views/orders/vuex';
import { RequisitesModule } from './views/requisites/vuex';
import { OrderShowModule } from './views/order-show/vuex';

Vue.use(Router);

export enum RoutesNamesEnum {
  authLogin = 'auth-login',
  oAuthLoginCallback = 'oauth-login-callback',
  home = 'home',
  orders = 'orders',
  orderNew = 'order-new',
  orderShow = 'order-show',
  orderShowShort = 'order-show-short',
  orderTerms = 'order-terms',
  orderAdminAction = 'order-admin-action',
  requisites = 'requisites',
  block = 'block',
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // login
    {
      path: '/login',
      name: RoutesNamesEnum.authLogin,
      meta: {
        requiresNotAuth: true,
      },
      component: () => import('./views/auth-login/auth-login.vue'),
    },

    // login/callback
    {
      path: '/login/callback',
      name: RoutesNamesEnum.oAuthLoginCallback,
      meta: {
        requiresNotAuth: true,
      },
      component: { template: '<page-layout />' },
      beforeEnter(to, from, next) {
        const stateQueryParameter = Array.isArray(to.query.state) ? to.query.state[0] : to.query.state;
        const match = stateQueryParameter.match(/redirect=(?<redirectPath>[^&]+)/);
        const successRedirectPath = match
          ? match.groups.redirectPath
          : router.resolve({ name: RoutesNamesEnum.home }).href;
        const errorRedirectRoute = {
          name: RoutesNamesEnum.authLogin,
          query: { redirect: successRedirectPath },
        };

        const code = Array.isArray(to.query.code) ? to.query.code[0] : to.query.code;
        if (!code) {
          next(errorRedirectRoute);
          return;
        }

        return AuthModule.context(store)
          .actions.oauthLoginUser({ auth: code })
          .then(() => {
            next(successRedirectPath);
          })
          .catch(() => {
            next(errorRedirectRoute);
          });
      },
    },

    // /
    {
      path: '/',
      name: RoutesNamesEnum.home,
      redirect: { name: RoutesNamesEnum.orderNew },
      // component: () => import("./views/home/home.vue"),
    },

    // orders
    {
      path: '/orders',
      meta: {
        requiresAuth: true,
      },
      name: RoutesNamesEnum.orders,
      component: () => import('./views/orders/orders.vue'),
      beforeEnter: async (to, from, next) => {
        await OrdersListModule.context(store).actions.init();
        next();
      },
    },

    // orders/new
    {
      path: '/orders/new',
      name: RoutesNamesEnum.orderNew,
      meta: {
        requiresAuth: process.env.VUE_APP_PARTNER === 'alfabank-ru' ? false : true,
      },
      component: () => import('./views/order-new/order-new.vue'),
    },

    // orders/:id
    {
      path: '/orders/:id',
      name: RoutesNamesEnum.orderShow,
      meta: {
        requiresAuth: true,
      },
      component: () => import('./views/order-show/order-show.vue'),
      props: route => ({
        orderId: route.params.id,
      }),
      beforeEnter: async (to, from, next) => {
        await Promise.all([
          RequisitesModule.context(store).actions.init(),
          OrderShowModule.context(store).actions.init({ id: to.params.id }),
        ]);
        next();
      },
    },

    // admin/orders/:id/actions/:adminActionName
    {
      path: '/admin/orders/:id/actions/:adminActionName',
      name: RoutesNamesEnum.orderAdminAction,
      component: () => import('./views/order-admin-action/order-admin-action.vue'),
    },

    // requisites
    {
      path: '/requisites',
      name: RoutesNamesEnum.requisites,
      meta: {
        requiresAuth: true,
      },
      component: () => import('@/views/requisites/requisites.vue'),
      beforeEnter: async (to, from, next) => {
        await RequisitesModule.context(store).actions.init();
        next();
      },
    },

    // o/:shortURL
    {
      path: '/o/:shortURL',
      name: RoutesNamesEnum.orderShowShort,
      meta: {
        requiresAuth: false,
      },
      component: () => import('./views/order-show/order-show.vue'),
      props: route => ({
        orderShortURL: route.params.shortURL,
      }),
      beforeEnter: async (to, from, next) => {
        await Promise.all([
          RequisitesModule.context(store).actions.init(),
          OrderShowModule.context(store).actions.init({
            shortURL: to.params.shortURL,
          }),
        ]);
        next();
      },
    },

    // about
    {
      path: '/about',
      name: RoutesNamesEnum.orderTerms,
      meta: {
        requiresAuth: false,
      },
      component: () => import('./views/about/about.vue'),
    },

    // block
    {
      path: '/block',
      name: RoutesNamesEnum.block,
      meta: {
        requiresAuth: false,
      },
      component: () => import('./views/block/block.vue'),
    },

    // *
    {
      path: '*',
      component: () => import('@/components/page-layout/page-layout.vue'),
      beforeEnter: async (to, from, next) => {
        await PageModule.context(store).actions.setError({ statusCode: 404 });
        next();
      },
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// for single init action
let authInitAction: Promise<any>;
let loadingTimer: number;
router.beforeEach(async (to, from, next) => {
  await PageModule.context(store).actions.clearError();

  clearTimeout(loadingTimer);
  loadingTimer = window.setTimeout(() => {
    PageModule.context(store).actions.setIsLoading(true);
  }, 250);

  authInitAction = authInitAction || AuthModule.context(store).actions.init();
  try {
    await authInitAction;
  } catch (e) {
    // silence
  }

  //Если пользователь не залогинен и маршрут это требует то перекидывает
  // на страницу логина c сохранением редиректа,
  // если залогинен и маршрут этого не требует то кидает на home
  // т.е. если авторизован и переход на логин, кинет на home
  const isLoggedIn = AuthModule.context(store).getters.isLoggedIn();
  let nextRoute: RawLocation;
  // .some because we need to stop iterations when some condition is true
  to.matched.some(route => {
    if (!isLoggedIn && route.meta.requiresAuth) {
      nextRoute = {
        name: RoutesNamesEnum.authLogin,
        query: { redirect: to.path },
      };
    }
    if (isLoggedIn && route.meta.requiresNotAuth) {
      nextRoute = {
        name: RoutesNamesEnum.home,
      };
    }
    return Boolean(nextRoute);
  });

  // Если есть nextRoute (см.выше),
  // если нет то пропускает по маршруту.
  if (nextRoute) {
    next(nextRoute);
  } else {
    next();
  }
});

router.afterEach(() => {
  clearTimeout(loadingTimer);
  PageModule.context(store).actions.setIsLoading(false);
});

export default router;
