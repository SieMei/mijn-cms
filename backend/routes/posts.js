const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const categoriesPath = path.join(__dirname, '..', 'content', 'categories.json');
const tagsPath = path.join(__dirname, '..', 'content', 'tags.json');

/**
 * Helper functie om de categorie- en tag-ID's in een post-object
 * te vervangen door de volledige namen.
 */
function applyTaxonomyNames(post, categories, tags) {
  // Maak lookup-tabellen voor snelle toegang (ID -> Naam)
  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  const tagMap = new Map(tags.map(tag => [tag.id, tag.name]));

  // Vervang de arrays met ID's door arrays met namen
  const categoriesWithNames = (post.categories || []).map(id => categoryMap.get(id) || id);
  const tagsWithNames = (post.tags || []).map(id => tagMap.get(id) || id);

  return {
    ...post,
    categories: categoriesWithNames,
    tags: tagsWithNames,
  };
}

// Route voor het ophalen van ALLE posts
router.get('/', async (req, res) => {
  try {
    // Lees alle benodigde bestanden
    const [files, categoriesData, tagsData] = await Promise.all([
      fs.readdir(postsDir),
      fs.readFile(categoriesPath, 'utf-8'),
      fs.readFile(tagsPath, 'utf-8')
    ]);
    const categories = JSON.parse(categoriesData);
    const tags = JSON.parse(tagsData);

    const posts = [];
    for (const file of files) {
      if (path.extname(file) === '.json') {
        const filePath = path.join(postsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const post = JSON.parse(content);
        // Verrijk elke post met de categorie- en tagnamen
        posts.push(applyTaxonomyNames(post, categories, tags));
      }
    }
    // Sorteer posts op datum, nieuwste eerst
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(posts);
  } catch (error) {
    console.error('Error getting all posts:', error);
    res.status(500).send('Error getting all posts');
  }
});

// Route voor het ophalen van ÉÉN post op basis van slug
router.get('/:slug', async (req, res) => {
  try {
    const requestedSlug = req.params.slug;
    const filePath = path.join(postsDir, `${requestedSlug}.json`);

    // Lees alle benodigde bestanden
    const [content, categoriesData, tagsData] = await Promise.all([
      fs.readFile(filePath, 'utf-8'),
      fs.readFile(categoriesPath, 'utf-8'),
      fs.readFile(tagsPath, 'utf-8')
    ]);

    const post = JSON.parse(content);
    const categories = JSON.parse(categoriesData);
    const tags = JSON.parse(tagsData);
    
    // Verrijk de post met de namen en stuur terug
    res.json(applyTaxonomyNames(post, categories, tags));
  } catch (error) {
    res.status(404).send('Post not found');
  }
});

module.exports = router;
