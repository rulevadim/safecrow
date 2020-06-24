import { configure } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins
import '../src/css/index.css';
import { RoutesNamesEnum } from "../src/router";

Vue.use(Vuex);
Vue.prototype.$routesNames = RoutesNamesEnum;

const req = require.context('../src', true, /\.stories\.ts$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
