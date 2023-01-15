import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import router from './router'
import './assets/index.scss';
import store from './store';

const emitter = mitt();
const app = createApp(App)

app.config.globalProperties.emitter = emitter;

app.use(router)
  .use(store)
  .use(PrimeVue, { ripple: true })

app.component('Dialog', Dialog);
app.component('Button', Button);
app.component('InputNumber', InputNumber);

app.mount('#app')
