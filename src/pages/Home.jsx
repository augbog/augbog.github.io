import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SocialIcons from '../components/SocialIcons';
import posts from 'virtual:blog-posts';

export default function Home() {
  const canvasRef = useRef(null);

  // Animated gradient background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function draw() {
      t += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      // Create flowing gradient
      const grad = ctx.createLinearGradient(
        w * (0.5 + 0.3 * Math.sin(t)),
        0,
        w * (0.5 + 0.3 * Math.cos(t * 0.7)),
        h
      );

      if (isDark) {
        grad.addColorStop(0, `hsl(${220 + 20 * Math.sin(t)}, 25%, 8%)`);
        grad.addColorStop(0.5, `hsl(${240 + 15 * Math.sin(t * 0.8)}, 20%, 12%)`);
        grad.addColorStop(1, `hsl(${200 + 25 * Math.sin(t * 0.5)}, 22%, 10%)`);
      } else {
        grad.addColorStop(0, `hsl(${220 + 20 * Math.sin(t)}, 30%, 95%)`);
        grad.addColorStop(0.5, `hsl(${240 + 15 * Math.sin(t * 0.8)}, 25%, 92%)`);
        grad.addColorStop(1, `hsl(${200 + 25 * Math.sin(t * 0.5)}, 28%, 97%)`);
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="home-hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        />

        <div className="hero-content" style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '800px',
        }}>
          <img
            src="https://pbs.twimg.com/profile_images/1207414324399968256/eT4pYBO9_200x200.jpg"
            alt="Augustus Yuan"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              display: 'block',
              margin: '0 auto 2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          />

          <h1 style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 400,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            Augustus Yuan
          </h1>

          <p className="hero-subtitle" style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: 300,
            maxWidth: '500px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.6,
            opacity: 0.75,
          }}>
            Software Engineer at{' '}
            <a href="https://heygen.com" target="_blank" rel="noopener noreferrer" style={{ borderBottom: '1px solid currentColor' }}>HeyGen</a>.
            {' '}Web developer, quote lover, lifelong learner.
          </p>

          <SocialIcons onIconHover={() => {}} />

          <div style={{ marginTop: '3rem' }}>
            <a
              href="#latest-writing"
              aria-label="Scroll down"
              style={{ display: 'inline-block', opacity: 0.4, transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Below the fold: Latest Writing + About */}
      <section
        id="latest-writing"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '5rem 2rem',
        }}
      >
        <div className="home-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4rem',
        }}>
          {/* Latest Writing */}
          <div>
            <h2 style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: '1.75rem',
              fontWeight: 400,
              marginBottom: '2rem',
              letterSpacing: '-0.5px',
            }}>
              Latest Writing
            </h2>

            <div className="posts-grid" style={{
              display: 'grid',
              gap: '1.5rem',
            }}>
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="post-card"
                  style={{
                    display: 'block',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <time style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {formatDate(post.date)}
                  </time>
                  <h3 style={{
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    margin: '0.5rem 0',
                    lineHeight: 1.3,
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    opacity: 0.7,
                    margin: 0,
                  }}>
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              to="/blog"
              className="animate-link"
              style={{ display: 'inline-block', marginTop: '1.5rem', fontSize: '0.95rem', fontWeight: 400 }}
            >
              View all posts &rarr;
            </Link>
          </div>

          {/* About sidebar */}
          <div className="about-section" style={{
            padding: '2rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(0,0,0,0.08)',
          }}>
            <h2 style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: '1.75rem',
              fontWeight: 400,
              marginBottom: '1rem',
              letterSpacing: '-0.5px',
            }}>
              About
            </h2>
            <p style={{ lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>
              I'm a software engineer passionate about building great user experiences on the web.
              Currently working at <a href="https://heygen.com" target="_blank" rel="noopener noreferrer" style={{ borderBottom: '1px solid currentColor' }}>HeyGen</a>,
              where I focus on creating tools that empower people.
            </p>
            <p style={{ lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>
              When I'm not coding, I'm usually collecting quotes, exploring new ideas, or tinkering with creative side projects.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="mailto:hello@augustusyuan.com" className="animate-link" style={{ fontSize: '0.9rem' }}>Email</a>
              <a href="https://github.com/augbog" target="_blank" rel="noopener noreferrer" className="animate-link" style={{ fontSize: '0.9rem' }}>GitHub</a>
              <a href="https://www.linkedin.com/in/augustusyuan" target="_blank" rel="noopener noreferrer" className="animate-link" style={{ fontSize: '0.9rem' }}>LinkedIn</a>
              <Link to="/quotes" className="animate-link" style={{ fontSize: '0.9rem' }}>Quotes</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
