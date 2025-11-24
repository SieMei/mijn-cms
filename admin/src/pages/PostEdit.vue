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
    <Editor v-model="post.content" />

    <button @click="save" class="btn save">Opslaan</button>
  </div>
</template>

<script>
import api from '../api'
import Editor from '../components/Editor.vue'

export default {
  components: { Editor },

  data() {
    return {
      isNew: false,
      post: {
        title: '',
        slug: '',
        content: '',
        categories: [],
        tags: []
      },
      categoriesInput: '',
      tagsInput: ''
    }
  },

  async mounted() {
    this.isNew = this.$route.path.includes('/new')

    if (!this.isNew) {
      const p = await api.getPost(this.$route.params.id)
      this.post = p
      this.categoriesInput = p.categories.join(', ')
      this.tagsInput = p.tags.join(', ')
    }
  },

  methods: {
    async save() {
      this.post.categories = this.categoriesInput.split(',').map(s => s.trim())
      this.post.tags = this.tagsInput.split(',').map(s => s.trim())

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