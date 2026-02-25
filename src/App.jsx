import { useState, useRef, forwardRef } from 'react';
import Header from './components/Header';
import HeroOverlay from './components/HeroOverlay';
import ThreeScene from './components/ThreeScene';
import { SOCIAL_THEMES } from './constants/themes';

export default function App() {
  const [score, setScore] = useState(0);
  const threeSceneRef = useRef(null);

  function handleIconHover(brand) {
    if (window.innerWidth >= 600 && threeSceneRef.current) {
      threeSceneRef.current.setTheme(SOCIAL_THEMES[brand]);
    }
  }

  return (
    <>
      <Header />
      <ThreeScene ref={threeSceneRef} onScoreUpdate={setScore} />
      <HeroOverlay score={score} onIconHover={handleIconHover} />
    </>
  );
}
