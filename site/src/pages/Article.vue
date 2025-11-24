<template>
  <div v-if="post" class="article">
    <h1>{{ post.title }}</h1>
    <div v-html="post.content"></div> </div>
  <div v-else>Artikel niet gevonden of laden...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref(null)

onMounted(async () => {
  // In een echte productie-app zou je een specifiek endpoint aanroepen
  const response = await fetch('http://localhost:3000/posts')
  const allPosts = await response.json()
  
  // Zoek de post die overeenkomt met de slug uit de URL
  post.value = allPosts.find(p => p.slug === route.params.slug)
})
</script>