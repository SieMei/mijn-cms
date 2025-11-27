<template>
  <div>
    <h1>Artikelen</h1>

    <ul>
      <li v-for="post in posts" :key="post.id">
        <router-link :to="`/post/${post.slug}`">
          {{ typeof post.title === "object" ? post.title.rendered : post.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return { posts: [] };
  },
  async mounted() {
    this.posts = await api.getPosts();
  },
};
</script>