<template>
  <div class="home">
    <h1>Recente artikelen</h1>
    <div v-if="loading">Laden...</div>
    <div v-else-if="posts.length > 0" class="grid">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <img v-if="post.image" :src="`http://localhost:3000${post.image}`" alt="" />
        <h2>{{ post.title }}</h2>
        <p>{{ post.excerpt }}</p>
        <router-link :to="`/post/${post.slug}`">Lees meer</router-link>
      </div>
    </div>
    <div v-else>
      <p>Er zijn nog geen artikelen gevonden. Maak je eerste artikel aan in de admin-omgeving!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Hier verbinden we met jouw lokale backend
    const response = await fetch('http://localhost:3000/posts')
    posts.value = await response.json()
  } catch (error) {
    console.error('Fout bij ophalen posts:', error)
  } finally {
    loading.value = false
  }
})
</script>