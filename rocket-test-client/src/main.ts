import 'ant-design-vue/dist/reset.css';
import './assets/main.css';
import Antd from 'ant-design-vue';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(Antd).mount('#app');
