import { useState, useEffect, useRef } from 'react';

const TYPEWRITER_DELAY = 50;
const QUOTE_DURATION = 10000;

function typeout(text, setFn) {
  let i = 0;
  let timerId;
  function tick() {
    i++;
    setFn(text.slice(0, i));
    if (i < text.length) {
      timerId = setTimeout(tick, TYPEWRITER_DELAY);
    }
  }
  timerId = setTimeout(tick, TYPEWRITER_DELAY);
  return () => clearTimeout(timerId);
}

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [quoteText, setQuoteText] = useState('');
  const [authorText, setAuthorText] = useState('');
  const cleanupRef = useRef([]);

  useEffect(() => {
    fetch('/quotes.json')
      .then((r) => r.json())
      .then((data) => {
        setQuotes(data);
        startCycle(data);
      })
      .catch(() => {});

    return () => cleanupRef.current.forEach((fn) => fn());
  }, []);

  function startCycle(data) {
    cleanupRef.current.forEach((fn) => fn());
    cleanupRef.current = [];

    function schedule(fn, delay) {
      const id = setTimeout(fn, delay);
      cleanupRef.current.push(() => clearTimeout(id));
    }

    for (let i = 0; i < data.length; i++) {
      ((idx) => {
        const quote = `"${data[idx].quote}"`;
        const author = data[idx].author;

        schedule(() => {
          setAuthorText('');
          const cancel = typeout(quote, setQuoteText);
          cleanupRef.current.push(cancel);
        }, QUOTE_DURATION * idx);

        schedule(() => {
          setQuoteText(quote);
          const cancel = typeout(author, setAuthorText);
          cleanupRef.current.push(cancel);
        }, QUOTE_DURATION * idx + 2000);
      })(i);
    }

    // Loop after all quotes
    schedule(() => startCycle(data), QUOTE_DURATION * data.length);
  }

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 10rem)',
        padding: '2rem',
        fontFamily: '"Helvetica Neue", helvetica, arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1
        className="quote"
        style={{ fontSize: '2rem', fontWeight: 400, maxWidth: 700, marginBottom: '1.5rem', lineHeight: 1.4 }}
      >
        {quoteText}
      </h1>
      <h2
        className="author"
        style={{ fontSize: '1.25rem', fontWeight: 200 }}
      >
        {authorText && `— ${authorText}`}
      </h2>
    </section>
  );
}
