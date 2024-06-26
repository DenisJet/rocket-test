import 'ant-design-vue/dist/reset.css';
import './assets/main.css';
import Antd from 'ant-design-vue';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import router from './router';
import App from '@/App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(Antd).mount('#app');
