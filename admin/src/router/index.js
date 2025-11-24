import { createRouter, createWebHistory } from 'vue-router'
import PostList from '../pages/PostList.vue'
import PostEdit from '../pages/PostEdit.vue'

const routes = [
  { path: '/', redirect: '/posts' },
  { path: '/posts', name: 'posts', component: PostList },
  { path: '/posts/:id', name: 'post-edit', component: PostEdit, props: true },
  { path: '/posts/new', name: 'post-new', component: PostEdit }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})