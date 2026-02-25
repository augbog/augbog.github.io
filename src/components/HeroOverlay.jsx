import { useState, useEffect, useRef, useCallback } from 'react';
import SocialIcons from './SocialIcons';

const QUOTES_URL = '/quotes.json';
const QUOTE_DISPLAY_DURATION = 10000;
const TYPEWRITER_INTERVAL = 50;

function useTypewriter(text, enabled) {
  const [displayed, setDisplayed] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayed('');
      return;
    }
    setDisplayed('');
    let i = 0;
    function tick() {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        timerRef.current = setTimeout(tick, TYPEWRITER_INTERVAL);
      }
    }
    timerRef.current = setTimeout(tick, TYPEWRITER_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [text, enabled]);

  return displayed;
}

export default function HeroOverlay({ score, onIconHover }) {
  const [quotes, setQuotes] = useState([]);
  const [quoteMode, setQuoteMode] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showingAuthor, setShowingAuthor] = useState(false);
  const timeoutsRef = useRef([]);

  const scoreVisible = score >= 15;

  // Load quotes
  useEffect(() => {
    fetch(QUOTES_URL)
      .then((r) => r.json())
      .then(setQuotes)
      .catch((e) => console.warn('Failed to load quotes', e));
  }, []);

  // Typewriter targets
  const currentQuote = quoteMode && quotes[quoteIndex] ? `"${quotes[quoteIndex].quote}"` : '';
  const currentAuthor = quoteMode && quotes[quoteIndex] ? quotes[quoteIndex].author : '';
  const displayedQuote = useTypewriter(currentQuote, quoteMode);
  const displayedAuthor = useTypewriter(currentAuthor, showingAuthor);

  function clearAllTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function schedule(fn, delay) {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }

  function triggerQuoteAnimation() {
    if (!quotes.length || quoteMode) return;

    clearAllTimeouts();
    setQuoteMode(true);
    setQuoteIndex(0);
    setShowingAuthor(false);

    for (let i = 0; i <= quotes.length; i++) {
      ((idx) => {
        if (idx === quotes.length) {
          // Restore normal mode
          schedule(() => {
            setQuoteMode(false);
            setShowingAuthor(false);
          }, QUOTE_DISPLAY_DURATION * idx);
        } else {
          schedule(() => {
            setQuoteIndex(idx);
            setShowingAuthor(false);
          }, QUOTE_DISPLAY_DURATION * idx);
          schedule(() => {
            setShowingAuthor(true);
          }, QUOTE_DISPLAY_DURATION * idx + 2000);
        }
      })(i);
    }
  }

  // Cleanup on unmount
  useEffect(() => () => clearAllTimeouts(), []);

  const overlayStyle = {
    position: 'fixed',
    textAlign: 'center',
    width: '100%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255,255,255,0.7)',
    padding: '20px 0',
    zIndex: 2,
  };

  const headingStyle = quoteMode
    ? { maxWidth: '60%', marginLeft: 'auto', marginRight: 'auto', fontSize: 26, fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 5 }
    : { maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto', fontSize: 36, fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 5 };

  return (
    <section
      id="hero"
      className="hero"
      style={{
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
        fontFamily: '"Helvetica Neue", helvetica, arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="content content-overlay" style={overlayStyle}>
        <img
          className="profile"
          src="https://pbs.twimg.com/profile_images/1207414324399968256/eT4pYBO9_200x200.jpg"
          alt="Augustus profile picture"
          style={{ width: 100, borderRadius: '50%', display: 'block', margin: '0 auto 10px' }}
        />

        <h1
          aria-live="polite"
          aria-relevant="text"
          className={`heading${quoteMode ? ' quote' : ''}`}
          style={headingStyle}
        >
          {quoteMode ? displayedQuote : 'Augustus Yuan'}
        </h1>

        {!quoteMode && (
          <h2
            aria-live="polite"
            aria-relevant="text"
            className="job-title"
            style={{ fontSize: 20, fontWeight: 200, marginBottom: 10, verticalAlign: 'middle' }}
          >
            Software Engineer at{' '}
            <a href="https://heygen.com" target="_blank" rel="noopener noreferrer">
              HeyGen
            </a>
          </h2>
        )}

        <h3
          aria-live="polite"
          aria-relevant="text"
          className={`description${quoteMode ? ' author' : ''}`}
          style={{ fontSize: 20, fontWeight: 200, margin: quoteMode ? 0 : '0 0 20px 0' }}
        >
          {quoteMode ? (
            displayedAuthor
          ) : (
            <>
              Web Developer.{' '}
              <span
                id="quotes"
                className="animate-link"
                onClick={triggerQuoteAnimation}
                style={{ cursor: 'pointer' }}
              >
                Quote Lover
              </span>
              . Lifelong&nbsp;learner.
            </>
          )}
        </h3>

        {!quoteMode && <SocialIcons onIconHover={onIconHover} />}

        <div
          className="score"
          aria-hidden="true"
          style={{ display: scoreVisible ? 'block' : 'none' }}
        >
          🎮 <span className="js-increment">{score}</span>
        </div>
      </div>
    </section>
  );
}
