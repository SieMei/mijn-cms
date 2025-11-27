import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import PostDetail from "../pages/PostDetail.vue"
import Article from "../pages/Article.vue"

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/post/:id", component: PostDetail }
    { path: "/:slug", component: Article }
  ]
})