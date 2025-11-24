const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Static files (uploaded images)
app.use('/media', express.static(path.join(__dirname, 'media')))

// Routes
app.use('/posts', require('./routes/posts'))
app.use('/upload', require('./routes/uploads'))

const PORT = 3000
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))