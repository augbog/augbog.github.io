import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Vite plugin that provides a virtual module `virtual:blog-posts`
 * which exports metadata for all markdown files in content/blog/.
 * Individual posts are loaded via `virtual:blog-post:slug`.
 */
export default function markdownBlog() {
  const BLOG_DIR = path.resolve(process.cwd(), 'content/blog');
  const VIRTUAL_LIST = 'virtual:blog-posts';
  const VIRTUAL_POST_PREFIX = 'virtual:blog-post:';
  const RESOLVED_LIST = '\0' + VIRTUAL_LIST;
  const RESOLVED_POST_PREFIX = '\0' + VIRTUAL_POST_PREFIX;

  function getAllPosts() {
    if (!fs.existsSync(BLOG_DIR)) return [];
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
    return files
      .map((file) => {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
        const { data, content } = matter(raw);
        const slug = file.replace(/\.md$/, '');
        return { slug, content, ...data };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return {
    name: 'vite-plugin-markdown-blog',

    resolveId(id) {
      if (id === VIRTUAL_LIST) return RESOLVED_LIST;
      if (id.startsWith(VIRTUAL_POST_PREFIX)) return '\0' + id;
      return null;
    },

    load(id) {
      if (id === RESOLVED_LIST) {
        const posts = getAllPosts().map(({ content, ...meta }) => meta);
        return `export default ${JSON.stringify(posts)};`;
      }
      if (id.startsWith(RESOLVED_POST_PREFIX)) {
        const slug = id.slice(RESOLVED_POST_PREFIX.length);
        const posts = getAllPosts();
        const post = posts.find((p) => p.slug === slug);
        if (!post) return `export default null;`;
        return `export default ${JSON.stringify(post)};`;
      }
      return null;
    },

    handleHotUpdate({ file, server }) {
      if (file.startsWith(BLOG_DIR)) {
        const mod1 = server.moduleGraph.getModuleById(RESOLVED_LIST);
        if (mod1) server.moduleGraph.invalidateModule(mod1);
        // Trigger full reload for blog content changes
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}
