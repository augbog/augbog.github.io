import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/quotes', label: 'Quotes' },
  ];

  return (
    <nav
      className="nav"
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 10,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        className="nav-logo"
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          letterSpacing: '-0.5px',
        }}
      >
        AY
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="nav-link"
            style={{
              fontSize: '0.9rem',
              fontWeight: pathname === to ? 600 : 400,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              borderBottom: pathname === to ? '2px solid currentColor' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'border-color 0.2s ease',
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
