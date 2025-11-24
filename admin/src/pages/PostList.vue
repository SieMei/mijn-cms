<template>
  <div class="page">
    <h1>Posts</h1>

    <button @click="goNew" class="btn">Nieuwe post</button>

    <ul class="post-list">
      <li v-for="post in posts" :key="post.id" @click="goEdit(post.id)">
        <h3>{{ post.title }}</h3>
        <small>{{ post.date }}</small>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      posts: []
    }
  },
  async mounted() {
    this.posts = await api.getPosts()
  },
  methods: {
    goEdit(id) {
      this.$router.push(`/posts/${id}`)
    },
    goNew() {
      this.$router.push(`/posts/new`)
    }
  }
}
</script>

<style>
.page { padding: 2rem; }
.post-list { list-style: none; padding: 0; }
.post-list li { padding: 1rem; cursor: pointer; border-bottom: 1px solid #ddd; }
.btn {
  padding: 0.5rem 1rem;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
}
</style>