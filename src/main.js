import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './mock/index.js'
import router from './router/index.js'
import permission from './directives/permission.js';

const app = createApp(App)
app.use(router).use(Antd)
app.directive("permission", permission)
app.mount('#app')



