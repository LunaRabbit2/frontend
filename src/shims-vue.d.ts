declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

import { IVueState } from '@/store';
import { Store } from 'vuex'
import { Router, _RouteLocationBase } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<IVueState>;
    $toast: any,
    emitter: any,
    $router: Router,
    $route: _RouteLocationBase,
  }
}

declare global {
  interface Blob {
    name: string;
  }
  interface Number {
    formatToBytes(d?: number): string
    ordinalize(): string
  }
  interface String {
    toTitleCase(): string
  }
  interface Object {
    merge<T = any>(...o: any): T
    groupKeys(o: any): object
  }
}
