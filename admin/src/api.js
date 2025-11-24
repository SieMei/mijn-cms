import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export default {
  async getPosts() {
    const { data } = await api.get('/posts')
    return data
  },

  async getPost(id) {
    const { data } = await api.get(`/posts/${id}`)
    return data
  },

  async createPost(post) {
    const { data } = await api.post('/posts', post)
    return data
  },

  async updatePost(id, post) {
    const { data } = await api.put(`/posts/${id}`, post)
    return data
  }
}