const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "../content/posts");

module.exports = {
  create(req, res) {
    const files = fs.readdirSync(postsDir);
    const ids = files.map(f => Number(f.replace(".json", "")));
