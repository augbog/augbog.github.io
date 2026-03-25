import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Quotes from './pages/Quotes';
import Cubes from './pages/Cubes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cubes page is full-screen, no layout wrapper */}
        <Route path="/cubes" element={<Cubes />} />

        {/* All other pages use shared layout with nav + footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/quotes" element={<Quotes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
