const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()
const uploads = require('../controllers/uploads')

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../media'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + '-' + file.originalname)
  }
})
const upload = multer({ storage })

router.post('/', upload.single('file'), uploads.upload)

module.exports = router