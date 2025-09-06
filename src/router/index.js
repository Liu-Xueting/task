import { createMemoryHistory, createRouter } from 'vue-router'

import Login from '../views/Login.vue'
import Main from '../views/Main.vue'

const routes = [
    { path: '/', component: Main },
    { path: '/login', component: Login }
]


const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (to.path === '/' && !user) {
        next({ path: '/login' });
    } else {
        next();
    }
});

export default router;