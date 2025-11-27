<template>
  <div class="page">
    <h1>{{ isNew ? 'Nieuwe post' : 'Bewerk post' }}</h1>

    <label>Titel</label>
    <input v-model="post.title" />

    <label>Slug</label>
    <input v-model="post.slug" />

    <label>Categorieën (komma gescheiden)</label>
    <input v-model="categoriesInput" />

    <label>Tags (komma gescheiden)</label>
    <input v-model="tagsInput" />

    <label>Content</label>
    <Editor v-model="post.content_html" />

    <button @click="save" class="btn save">Opslaan</button>
  </div>
</template>

<script>
import api from '../api'
import Editor from '../components/Editor.vue'

// ✔ Deze bestanden komen uit jouw backend/content
import categories from '../../../backend/content/categories.json'
import tags from '../../../backend/content/tags.json'

export default {
  components: { Editor },

  data() {
    return {
      isNew: false,

      post: {
        title: '',
        slug: '',
        content_html: '',
        categories: [], // altijd ID's
        tags: []        // altijd ID's
      },

      categoriesInput: '',  // lijst van namen voor invoer
      tagsInput: '',        // lijst van namen voor invoer

      // mapping tables
      catIdToName: {},
      catNameToId: {},
      tagIdToName: {},
      tagNameToId: {},
    }
  },

  created() {
    // ✔ categorienamen ↔ ID
    categories.forEach(cat => {
      this.catIdToName[cat.id] = cat.name
      this.catNameToId[cat.name.toLowerCase()] = cat.id
    })

    // ✔ tagnamen ↔ ID
    tags.forEach(tag => {
      this.tagIdToName[tag.id] = tag.name
      this.tagNameToId[tag.name.toLowerCase()] = tag.id
    })
  },

  async mounted() {
    this.isNew = this.$route.path.includes('/new')

    if (!this.isNew) {
      const p = await api.getPost(this.$route.params.id)
      this.post = p

      // ✔ Zet IDs om naar namen voor invoer
      this.categoriesInput = (p.categories || [])
        .map(id => this.catIdToName[id])
        .join(', ')

      this.tagsInput = (p.tags || [])
        .map(id => this.tagIdToName[id])
        .join(', ')
    }
  },

  methods: {
    async save() {
      // ✔ Zet categorienamen om naar ID's
      this.post.categories = this.categoriesInput
        .split(',')
        .map(s => s.trim().toLowerCase())
        .map(name => this.catNameToId[name])
        .filter(Boolean)

      // ✔ Zet tagnamen om naar ID's
      this.post.tags = this.tagsInput
        .split(',')
        .map(s => s.trim().toLowerCase())
        .map(name => this.tagNameToId[name])
        .filter(Boolean)

      if (this.isNew) {
        await api.createPost(this.post)
      } else {
        await api.updatePost(this.post.id, this.post)
      }

      alert('Opgeslagen!')
      this.$router.push('/posts')
    }
  }
}
</script>

<style>
.page { padding: 2rem; }
input { display: block; margin-bottom: 1rem; padding: .5rem; width: 100%; }
.btn.save { background: green; color: white; padding: .75rem 1.5rem; }
</style>