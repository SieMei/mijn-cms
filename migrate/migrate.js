import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { load } from "cheerio"; // <-- named import

const POSTS_FILE = "./wp-posts.json";
const CONTENT_DIR = "../content";
const POSTS_DIR = "../content/posts";
const MEDIA_DIR = "../media";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(CONTENT_DIR);
ensureDir(POSTS_DIR);
ensureDir(MEDIA_DIR);

// ------------ 1. WP POSTS INLADEN -------------------

const raw = fs.readFileSync(POSTS_FILE, "utf8");
const posts = JSON.parse(raw);

// Verzamel categorie- en tag-info
const categoryMap = new Map();
const tagMap = new Map();

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function downloadImage(url, destPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (e) {
    console.log("❌ Download mislukt:", url);
    return false;
  }
}

function cleanHTML(html) {
  const $ = load(html);

  $("*").each((i, el) => {
    for (const attr of ["class", "id", "style"]) {
      $(el).removeAttr(attr);
    }
    // Cheerio ondersteunt geen data-* wildcard, dus we verwijderen expliciet
    const attrs = el.attribs || {};
    for (const a in attrs) {
      if (a.startsWith("data-")) $(el).removeAttr(a);
    }
  });

  return $.html();
}

// ------------ MIGRATIE PER POST ---------------------

async function migrate() {
  console.log(`📦 Migratie starten… (${posts.length} posts)`);

  for (const p of posts) {
    const slug = p.slug || slugify(p.title.rendered);
    const postId = p.id;

    const postDir = path.join(MEDIA_DIR, String(postId));
    ensureDir(postDir);

    // Featured image downloaden
    let featuredLocal = null;
    if (p.yoast_head_json?.og_image?.[0]?.url) {
      const url = p.yoast_head_json.og_image[0].url;
      const filename = path.basename(url.split("?")[0]);
      const dest = path.join(postDir, filename);
      await downloadImage(url, dest);
      featuredLocal = `/media/${postId}/${filename}`;
    }

    // Content schoonmaken en images herlinken
    let html = cleanHTML(p.content.rendered);
    const $ = load(html);

    // async images downloaden met for-loop
    const imgPromises = [];
    $("img").each((i, el) => {
      const src = $(el).attr("src");
      if (!src) return;

      const filename = path.basename(src.split("?")[0]);
      const dest = path.join(postDir, filename);
      imgPromises.push(
        downloadImage(src, dest).then(() => {
          $(el).attr("src", `/media/${postId}/${filename}`);
        })
      );
    });
    await Promise.all(imgPromises);

    $("iframe").each((i, el) => {
      $(el).removeAttr("class");
      $(el).removeAttr("style");
    });

    html = $.html();

    // categorie- en tagslugs verzamelen
    const categorySlugs = (p.categories || []).map(c => "cat-" + c);
    const tagSlugs = (p.tags || []).map(t => "tag-" + t);

    categorySlugs.forEach(s => categoryMap.set(s, { slug: s, name: s }));
    tagSlugs.forEach(s => tagMap.set(s, { slug: s, name: s }));

    // JSON opslaan
    const postJson = {
      id: p.id,
      slug: slug,
      title: p.title.rendered,
      date: p.date,
      modified: p.modified,
      excerpt: p.excerpt.rendered,
      content_html: html,
      categories: categorySlugs,
      tags: tagSlugs,
      featured_image: featuredLocal
    };

    const dest = path.join(POSTS_DIR, `${slug}.json`);
    fs.writeFileSync(dest, JSON.stringify(postJson, null, 2));
    console.log(`✔️ ${slug}.json`);
  }

  // categorieën & tags opslaan
  fs.writeFileSync("../content/categories.json", JSON.stringify([...categoryMap.values()], null, 2));
  fs.writeFileSync("../content/tags.json", JSON.stringify([...tagMap.values()], null, 2));

  console.log("🎉 Migratie voltooid!");
}

migrate();