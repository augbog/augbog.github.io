import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import { SOCIAL_THEMES } from '../constants/themes';

export default function Cubes() {
  const [score, setScore] = useState(0);
  const threeSceneRef = useRef(null);

  const scoreVisible = score >= 15;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <ThreeScene ref={threeSceneRef} onScoreUpdate={setScore} />

      <div style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 10,
      }}>
        <Link
          to="/"
          style={{
            fontSize: '0.85rem',
            fontWeight: 400,
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '2rem',
            color: '#333',
            textDecoration: 'none',
          }}
        >
          &larr; Back to site
        </Link>
      </div>

      {scoreVisible && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'monospace',
          fontSize: '2rem',
          fontWeight: 800,
          zIndex: 10,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          color: 'white',
        }}>
          🎮 {score}
        </div>
      )}
    </div>
  );
}
