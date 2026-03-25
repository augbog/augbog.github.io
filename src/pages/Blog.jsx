import { Link } from 'react-router-dom';
import posts from 'virtual:blog-posts';

export default function Blog() {
  return (
    <section style={{ maxWidth: '750px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{
        fontFamily: '"Georgia", "Times New Roman", serif',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 400,
        letterSpacing: '-1px',
        marginBottom: '0.5rem',
      }}>
        Blog
      </h1>
      <p style={{ fontWeight: 300, opacity: 0.6, marginBottom: '3rem', lineHeight: 1.6 }}>
        Thoughts on web development, career, and lifelong learning.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {posts.map((post) => (
          <article key={post.slug}>
            <time style={{
              fontSize: '0.8rem',
              fontWeight: 400,
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {formatDate(post.date)}
            </time>
            {post.tags && (
              <span style={{ marginLeft: '1rem', fontSize: '0.75rem', opacity: 0.4 }}>
                {post.tags.join(' / ')}
              </span>
            )}
            <h2 style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: '1.4rem',
              fontWeight: 500,
              margin: '0.4rem 0 0.5rem',
              lineHeight: 1.3,
            }}>
              <Link to={`/blog/${post.slug}`} className="animate-link">
                {post.title}
              </Link>
            </h2>
            {post.excerpt && (
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 300,
                lineHeight: 1.6,
                opacity: 0.7,
                margin: 0,
              }}>
                {post.excerpt}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
