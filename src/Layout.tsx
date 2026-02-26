import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, BookOpen, Github, Brain, Home } from 'lucide-react';
import './Layout.css';

interface ChapterMeta {
  id: string;
  slug: string;
  title: string;
  filename: string;
  path: string;
}

interface LayoutProps {
  chapters: ChapterMeta[];
  onToggleView: () => void;
}

export default function Layout({ chapters, onToggleView }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme ? (storedTheme as 'light' | 'dark') : (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    // Close sidebar on mobile when navigating
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="icon-button" onClick={toggleSidebar} aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
        <span className="mobile-title">How Crypto Actually Works</span>
        <div className="header-actions">
          <Link to="/" className="icon-button" title="Back to Front Page">
            <Home size={20} />
          </Link>
          <button className="icon-button" onClick={onToggleView} title="Cycle View Mode">
            <BookOpen size={20} />
          </button>
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="book-brand-link">
            <div className="book-brand">
              <BookOpen size={24} className="brand-icon" />
              <div className="brand-text">
                <h1 className="brand-title">How Crypto Actually Works</h1>
                <span className="brand-author">by Larry Cermak</span>
              </div>
            </div>
          </Link>
          <button className="icon-button close-sidebar" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-content">
          <h2 className="toc-title">Table of Contents</h2>
          <nav className="toc-nav">
            {chapters.map((chapter) => (
              <NavLink 
                key={chapter.id} 
                to={`/${chapter.slug}`}
                className={({ isActive }) => `toc-link ${isActive ? 'active' : ''}`}
              >
                {chapter.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-credits">
            <p>In collaboration with <strong>Wintermute Research</strong> & <strong>The Block Research</strong></p>
          </div>
          
          <div className="sidebar-actions-grid">
            <button className="sidebar-action-btn" onClick={onToggleView}>
              <Brain size={16} /> <span>Cycle Mode</span>
            </button>
            <button className="sidebar-action-btn" onClick={toggleTheme}>
              {theme === 'light' ? (
                <><Moon size={16} /> <span>Dark Mode</span></>
              ) : (
                <><Sun size={16} /> <span>Light Mode</span></>
              )}
            </button>
            <Link to="/" className="sidebar-action-btn">
              <Home size={16} /> <span>Front Page</span>
            </Link>
            <a 
              href="https://github.com/larrycermak/how-crypto-works" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sidebar-action-btn github-link"
            >
              <Github size={16} /> <span>Contribute</span>
            </a>
          </div>

          <div className="sidebar-license">
            <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">
              CC BY-NC-ND 4.0
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}