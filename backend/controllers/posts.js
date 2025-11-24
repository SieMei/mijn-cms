const fs = require('fs')
const path = require('path')

const contentDir = path.join(__dirname, '../content')

function loadJson(name) {
  const p = path.join(contentDir, `${name}.json`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function saveJson(name, data) {
  const p = path.join(contentDir, `${name}.json`)
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8')
}

module.exports = {
  getAll(req, res) {
    const posts = loadJson('posts')
    res.json(posts)
  },

  getOne(req, res) {
    const posts = loadJson('posts')
    const post = posts.find(p => p.id == req.params.id)
    if (!post) return res.status(404).json({ error: 'Not found' })
    res.json(post)
  },

  create(req, res) {
    const posts = loadJson('posts')
    const body = req.body

    const newId = Math.max(...posts.map(p => p.id)) + 1

    const newPost = {
      id: newId,
      date: new Date().toISOString(),
      ...body,
    }

    posts.push(newPost)
    saveJson('posts', posts)

    res.json(newPost)
  },

  update(req, res) {
    const posts = loadJson('posts')
    const body = req.body
    const id = Number(req.params.id)

    const index = posts.findIndex(p => p.id === id)
    if (index === -1) return res.status(404).json({ error: 'Not found' })

    posts[index] = { ...posts[index], ...body }
    saveJson('posts', posts)

    res.json(posts[index])
  }
}