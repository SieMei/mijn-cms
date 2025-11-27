export default {
  async getPosts() {
    const res = await fetch('http://localhost:3000/posts')
    if (!res.ok) throw new Error('Failed to fetch posts')
    return res.json()
  },

  async getPost(id) {
    const res = await fetch(`http://localhost:3000/posts/${id}`)
    if (!res.ok) throw new Error('Failed to fetch post')
    return res.json()
  },

  async createPost(post) {
    const res = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    return res.json()
  },

  async updatePost(id, post) {
    const res = await fetch(`http://localhost:3000/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    return res.json()
  }
}