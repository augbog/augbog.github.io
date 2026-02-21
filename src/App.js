import React from 'https://esm.sh/react@19.1.1';

const { useEffect, useRef } = React;
const h = React.createElement;

const socialLinks = [
  { label: 'Twitter', href: 'https://mobile.twitter.com/augburto' },
  { label: 'GitHub', href: 'https://github.com/augbog' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/augustusyuan' },
  { label: 'Stack Overflow', href: 'https://stackoverflow.com/users/1168661/aug' },
];

function AnimatedPatternCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const drawPattern = (time) => {
      const t = time * 0.001;
      const spacing = 48;

      context.clearRect(0, 0, width, height);

      for (let x = -spacing; x < width + spacing; x += spacing) {
        for (let y = -spacing; y < height + spacing; y += spacing) {
          const waveX = Math.sin((x * 0.012) + t * 1.2);
          const waveY = Math.cos((y * 0.012) - t * 0.9);
          const offset = (waveX + waveY) * 8;
          const radius = 1.5 + ((waveX + 1) * 2.2);
          const alpha = 0.14 + ((waveY + 1) / 2) * 0.18;

          context.beginPath();
          context.fillStyle = `rgba(34, 211, 238, ${alpha.toFixed(3)})`;
          context.arc(x + offset, y - offset, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      animationFrameId = window.requestAnimationFrame(drawPattern);
    };

    setCanvasSize();
    animationFrameId = window.requestAnimationFrame(drawPattern);
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return h('canvas', { ref: canvasRef, className: 'animated-pattern', 'aria-hidden': 'true' });
}

export default function App() {
  return h(
    'main',
    { className: 'site-shell' },
    h(AnimatedPatternCanvas),
    h(
      'section',
      { className: 'hero-card' },
      h('p', { className: 'kicker' }, 'Augustus Yuan'),
      h('h1', null, 'Augustus Yuan'),
      h(
        'p',
        { className: 'role' },
        'Software Engineer at ',
        h(
          'a',
          { href: 'https://heygen.com', target: '_blank', rel: 'noreferrer' },
          'HeyGen',
        ),
      ),
      h(
        'nav',
        { 'aria-label': 'Social links' },
        h(
          'ul',
          { className: 'social-list' },
          ...socialLinks.map((link) =>
            h(
              'li',
              { key: link.label },
              h(
                'a',
                { href: link.href, target: '_blank', rel: 'noreferrer' },
                link.label,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
