import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home';
import Layout from './Layout';
import Chapter from './Chapter';
import BookMode from './BookMode';
import InteractiveMode from './InteractiveMode';
import chaptersData from './chapters.json';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState<'web' | 'book' | 'interactive'>(() => {
    const saved = localStorage.getItem('viewMode');
    return (saved as 'web' | 'book' | 'interactive') || 'web';
  });

  const location = useLocation();
  const navigate = useNavigate();
  const firstChapterSlug = chaptersData.length > 0 ? chaptersData[0].slug : '';

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const handleModeSelect = (mode: 'web' | 'book' | 'interactive') => {
    setViewMode(mode);
    
    // Determine the current slug to maintain context
    const pathParts = location.pathname.split('/').filter(Boolean);
    let currentSlug = pathParts[pathParts.length - 1] || firstChapterSlug;
    // Strip prefixes if present
    if (currentSlug === 'book' || currentSlug === 'interactive') currentSlug = firstChapterSlug;
    const validSlug = chaptersData.some(c => c.slug === currentSlug) ? currentSlug : firstChapterSlug;

    if (mode === 'web') navigate(`/${validSlug}`);
    else if (mode === 'book') navigate(`/book/${validSlug}`);
    else navigate(`/interactive/${validSlug}`);
  };

  const toggleViewMode = () => {
    setViewMode(prev => {
      const next = prev === 'web' ? 'book' : prev === 'book' ? 'interactive' : 'web';
      
      const pathParts = location.pathname.split('/').filter(Boolean);
      let currentSlug = pathParts[pathParts.length - 1] || firstChapterSlug;
      if (currentSlug === 'book' || currentSlug === 'interactive') currentSlug = firstChapterSlug;
      const validSlug = chaptersData.some(c => c.slug === currentSlug) ? currentSlug : firstChapterSlug;

      if (next === 'web') navigate(`/${validSlug}`);
      else if (next === 'book') navigate(`/book/${validSlug}`);
      else navigate(`/interactive/${validSlug}`);
      
      return next;
    });
  };

  return (
    <Routes>
      <Route path="/" element={<Home onSelectMode={handleModeSelect} />} />
      
      {/* Web Mode Routes */}
      <Route element={<Layout chapters={chaptersData} onToggleView={toggleViewMode} />}>
        <Route path="/:slug" element={<Chapter chapters={chaptersData} />} />
      </Route>

      {/* Book Mode Routes */}
      <Route path="/book/:slug" element={<BookMode chapters={chaptersData} onToggleView={toggleViewMode} />} />
      <Route path="/book" element={<Navigate to={`/book/${firstChapterSlug}`} replace />} />

      {/* Interactive Mode Routes */}
      <Route path="/interactive/:slug" element={<InteractiveMode chapters={chaptersData} onToggleView={toggleViewMode} />} />
      <Route path="/interactive" element={<Navigate to={`/interactive/${firstChapterSlug}`} replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;