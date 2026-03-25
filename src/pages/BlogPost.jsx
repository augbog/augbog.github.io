import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import posts from 'virtual:blog-posts';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic import of the specific post
    import(/* @vite-ignore */ `virtual:blog-post:${slug}`)
      .then((mod) => {
        setPost(mod.default);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ opacity: 0.5 }}>Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Georgia", serif', fontSize: '2rem', fontWeight: 400, marginBottom: '1rem' }}>
          Post not found
        </h1>
        <Link to="/blog" className="animate-link">Back to blog</Link>
      </div>
    );
  }

  // Find adjacent posts for navigation
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const prevPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : null;

  return (
    <article style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' }}>
      <Link to="/blog" className="animate-link" style={{ fontSize: '0.85rem', opacity: 0.5, display: 'inline-block', marginBottom: '2rem' }}>
        &larr; Back to blog
      </Link>

      <header style={{ marginBottom: '2.5rem' }}>
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
        <h1 style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 400,
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          marginTop: '0.5rem',
        }}>
          {post.title}
        </h1>
      </header>

      <div className="blog-content" style={{
        fontSize: '1.05rem',
        fontWeight: 300,
        lineHeight: 1.7,
      }}>
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Post navigation */}
      <nav style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {prevPost ? (
          <Link to={`/blog/${prevPost.slug}`} className="animate-link" style={{ fontSize: '0.9rem' }}>
            &larr; {prevPost.title}
          </Link>
        ) : <span />}
        {nextPost ? (
          <Link to={`/blog/${nextPost.slug}`} className="animate-link" style={{ fontSize: '0.9rem', textAlign: 'right' }}>
            {nextPost.title} &rarr;
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
