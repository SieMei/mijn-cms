<template>
  <div class="post-page" v-if="post">
    <h1>{{ post.title }}</h1>

    <div v-html="post.content_html" class="post-content"></div>

    <div class="meta">
      <p><strong>Categorieën:</strong> {{ post.categories.join(', ') }}</p>
      <p><strong>Tags:</strong> {{ post.tags.join(', ') }}</p>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      post: null
    };
  },

  async mounted() {
    const id = this.$route.params.id;

    // Post ophalen
    const p = await api.getPost(id);

    // Titel uit WP-json struct halen (als dat nog zo is)
    p.title = typeof p.title === "object" ? p.title.rendered : p.title;

    // Content goed zetten (WP heeft content.rendered)
    if (p.content_html) {
      // al goed
    } else if (p.content?.rendered) {
      p.content_html = p.content.rendered;
    }

    // categorieën en tags omzetten van ID naar naam (indien nog nodig)
    if (Array.isArray(p.categories) && typeof p.categories[0] === "number") {
      const categories = await api.getCategories();
      p.categories = p.categories.map(id => categories[id] || id);
    }

    if (Array.isArray(p.tags) && typeof p.tags[0] === "number") {
      const tags = await api.getTags();
      p.tags = p.tags.map(id => tags[id] || id);
    }

    this.post = p;
  }
};
</script>

<style>
.post-page {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
}
.post-content img {
  max-width: 100%;
}
</style>