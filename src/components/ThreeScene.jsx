import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useThreeScene } from '../hooks/useThreeScene';

const ThreeScene = forwardRef(function ThreeScene({ onScoreUpdate }, ref) {
  const canvasRef = useRef(null);
  const { setTheme } = useThreeScene(canvasRef, onScoreUpdate);

  useImperativeHandle(ref, () => ({ setTheme }), [setTheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 0,
      }}
    />
  );
});

export default ThreeScene;
