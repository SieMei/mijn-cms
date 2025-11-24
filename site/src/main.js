import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue'
import Article from './pages/Article.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/post/:slug', component: Article, props: true }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).mount('#app')