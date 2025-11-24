const path = require('path')

module.exports = {
  upload(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'No file' })
    }

    const url = `http://localhost:3000/media/${req.file.filename}`
    res.json({ url })
  }
}