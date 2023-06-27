import { createPinia } from 'pinia';
import { markRaw } from 'vue';
import router from '../router';
import type { Router } from 'vue-router';

const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}

export default pinia;