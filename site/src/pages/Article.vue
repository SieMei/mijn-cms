<template>
  <div v-if="post" class="article-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="author-name">© Sietse Meijer</div>
      <div class="publish-date">{{ formattedDate }}</div>

      <!-- Categorieën -->
      <div v-if="post.categories && post.categories.length" class="categories">
        <h3>Categorie</h3>
        <div class="tag-list">
          <a 
            v-for="cat in post.categories" 
            :key="cat"
            href="#"
            class="category-tag"
          >
            {{ cat }}
          </a>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length" class="tags">
        <h3>Tags</h3>
        <div class="tag-list">
          <a 
            v-for="tag in post.tags" 
            :key="tag"
            href="#"
            class="tag"
          >
            {{ tag }}
          </a>
        </div>
      </div>

      <div class="social-links">
        <a href="#">f</a>
        <a href="#">🐦</a>
        <a href="#">✉</a>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      <h1 class="article-title">{{ post.title }}</h1>
      <p class="article-intro" v-html="post.intro"></p>
      <img
        v-if="post.featured_image"
        :src="`http://localhost:3000${post.featured_image}`"
        alt="Article hero image"
        class="article-image"
      />
      <div class="article-text" v-html="post.content_html"></div>
    </main>
  </div>
  <div v-else>Artikel niet gevonden of laden...</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const post = ref(null);

const formattedDate = computed(() => {
  if (!post.value || !post.value.date) return "";
  const date = new Date(post.value.date);
  return date.toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

onMounted(async () => {
  const slug = route.params.slug;
  const response = await fetch(`http://localhost:3000/posts/${slug}`);

  if (response.ok) {
    post.value = await response.json();
  } else {
    console.error("Artikel niet gevonden:", response.status);
  }
});
</script>

<style scoped>
/* Importeer de Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,700;1,400;1,700&family=Raleway:ital,wght@0,300;0,400;0,700;1,400;1,700&family=Zalando+Sans:wght@400;500;700&display=swap");

/* Container met sidebar layout */
.article-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 2rem;

  /* Kleurvariabelen voor light mode (standaard) */
  --bg-color: white;
  --text-primary: #1a1a1a;
  --text-secondary: #444;
  --text-tertiary: #666;
  --text-hover: #333;
  --accent-color: #8b6914;
  --border-color: #e0e0e0;

  background-color: var(--bg-color);
  color: var(--text-primary);
}

/* Sidebar (links) */
.sidebar {
  padding-right: 2rem;
  border-right: 1px solid var(--border-color);
}

.author-name {
  font-family: "Raleway", sans-serif;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.publish-date {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-style: italic;
  margin-bottom: 1rem;
}

/* NIEUW: Categories en Tags */
.categories,
.tags {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.categories h3,
.tags h3 {
  font-family: "Raleway", sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.tag-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-tag,
.tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: rgba(139, 105, 20, 0.1);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  text-decoration: none;
  font-size: 0.85rem;
  border-radius: 3px;
  transition: all 0.2s ease;
  font-family: "Cabin", sans-serif;
}

.category-tag:hover,
.tag:hover {
  background-color: var(--accent-color);
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.social-links a {
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: 1.1rem;
}

.social-links a:hover {
  color: var(--text-hover);
}

/* Main content area */
.main-content {
  max-width: 800px;
  text-align: left;
}

.article-title {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-family: "Raleway", sans-serif;
}

.article-intro {
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-family: "Zalando Sans", sans-serif;
}

.article-image {
  width: 100%;
  height: auto;
  margin: 1.5rem 0;
}

/* Gebruik :deep() om de inhoud van v-html te stijlen */
.article-text :deep(p) {
  font-family: "Cabin", sans-serif;
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 1.2rem;
  color: var(--text-secondary);
}

.article-text :deep(img) {
  float: right;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  max-width: 50%; /* Voorkomt dat afbeeldingen te breed worden */
  height: auto;
}

.article-text :deep(strong) {
  font-weight: 700; /* Zorgt ervoor dat bold het 'bold' gewicht gebruikt */
}

.article-text :deep(em) {
  font-style: italic; /* Zorgt ervoor dat italic de 'italic' stijl gebruikt */
}

.article-text :deep(iframe) {
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: block;
  width: 90% !important;
  max-width: 800px;
  margin: 2rem auto;
  aspect-ratio: 16/9;
  height: auto !important;
  box-sizing: border-box; /* Zorgt ervoor dat de border binnen de width valt */
}

.article-text :deep(.quote-block) {
  background-color: rgba(0, 0, 0, 0.03); /* Een heel lichtgrijze achtergrond */
  border-left: 3px solid var(--border-color);
  padding: 0.5rem 1.5rem;
  margin-left: 6px;
  margin-right: 6px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .article-container {
    --bg-color: #1e1e1e;
    --text-primary: #e0e0e0;
    --text-secondary: #b0b0b0;
    --text-tertiary: #888;
    --text-hover: #fff;
    --accent-color: #c5a34c;
    --border-color: #444;
  }

  .category-tag,
  .tag {
    background-color: rgba(197, 163, 76, 0.15);
    border-color: var(--accent-color);
  }

  .article-text :deep(.quote-block) {
    background-color: rgba(255, 255, 255, 0.05); /* Een heel lichtgrijze achtergrond op donker */
  }
}

/* Responsive */
@media (max-width: 768px) {
  .article-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding-right: 0;
    padding-bottom: 1rem;
  }

  .article-title {
    font-size: 1.8rem;
  }

  .tag-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .category-tag,
  .tag {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}
</style>