const express = require('express')
const router = express.Router()

const posts = require('../controllers/posts')

router.get('/', posts.getAll)
router.get('/:id', posts.getOne)
router.post('/', posts.create)
router.put('/:id', posts.update)

module.exports = router