import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="site-footer"
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 300,
        borderTop: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
        <a href="mailto:hello@augustusyuan.com" className="animate-link">hello@augustusyuan.com</a>
        <a href="https://github.com/augbog" target="_blank" rel="noopener noreferrer" className="animate-link">GitHub</a>
        <a href="https://www.linkedin.com/in/augustusyuan" target="_blank" rel="noopener noreferrer" className="animate-link">LinkedIn</a>
        <Link to="/cubes" className="animate-link">Play with cubes</Link>
      </div>
      <p style={{ margin: 0, opacity: 0.6 }}>
        &copy; {new Date().getFullYear()} Augustus Yuan
      </p>
    </footer>
  );
}
