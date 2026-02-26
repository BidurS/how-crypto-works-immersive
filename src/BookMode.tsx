import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Book as BookIcon,
  ArrowLeft,
  X,
  Layers,
  HelpCircle,
  Maximize,
  Github,
  Home,
  Sparkles
} from 'lucide-react';
import './BookMode.css';

interface ChapterMeta {
  id: string;
  slug: string;
  title: string;
  filename: string;
  path: string;
}

interface BookModeProps {
  chapters: ChapterMeta[];
  onToggleView: () => void;
}

export default function BookMode({ chapters, onToggleView }: BookModeProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [internalPage, setInternalPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const bookRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  const currentIndex = chapters.findIndex(c => c.slug === slug);
  const chapterMeta = chapters[currentIndex];
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const calculatePages = () => {
    if (!measureRef.current || !surfaceRef.current) return;
    const height = surfaceRef.current.clientHeight;
    if (height > 0) setContainerHeight(height);
    const scrollWidth = measureRef.current.scrollWidth;
    const clientWidth = surfaceRef.current.clientWidth;
    if (scrollWidth === 0 || clientWidth === 0) return;
    const gap = 64;
    const pages = Math.max(1, Math.round((scrollWidth + gap) / (clientWidth + gap)));
    setTotalPages(pages);
  };

  useLayoutEffect(() => {
    if (!loading && content) {
      calculatePages();
      const timer = setTimeout(calculatePages, 500);
      window.addEventListener('resize', calculatePages);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', calculatePages);
      };
    }
  }, [loading, content, slug, internalPage]);

  const handleNext = () => {
    if (isCoverOpen) {
      setIsCoverOpen(false);
      return;
    }
    if (internalPage < totalPages - 1) {
      setInternalPage(prev => prev + 1);
    } else if (nextChapter) {
      navigate(`/book/${nextChapter.slug}`);
      setInternalPage(0);
    }
  };

  const handlePrev = () => {
    if (internalPage > 0) {
      setInternalPage(prev => prev - 1);
    } else if (prevChapter) {
      navigate(`/book/${prevChapter.slug}`);
      setInternalPage(0);
    }
  };

  const goToChapter = (targetSlug: string) => {
    navigate(`/book/${targetSlug}`);
    setShowToc(false);
    setIsCoverOpen(false);
    setInternalPage(0);
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, .book-page-nav')) return;
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const relativeX = clientX - left;
    if (relativeX > width * 0.7) handleNext();
    else if (relativeX < width * 0.3) handlePrev();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStart.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showToc || showTips) return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === ' ' && isCoverOpen) setIsCoverOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, internalPage, nextChapter, prevChapter, isCoverOpen, showToc, showTips]);

  useEffect(() => {
    if (!chapterMeta) return;
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(chapterMeta.path);
        const text = await response.text();
        setContent(text);
        setInternalPage(0);
      } catch (error) {
        setContent(`# Error\nCould not fetch content.`);
      } finally {
        setLoading(false);
        if (slug !== chapters[0].slug) setIsCoverOpen(false);
      }
    };
    fetchContent();
  }, [slug, chapterMeta, chapters]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="book-mode-container" 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
    >
      <div className="book-background-decor">
        <div className="decor-shape shape-1"></div>
        <div className="decor-shape shape-2"></div>
      </div>

      <nav className="book-top-bar">
        <div className="book-nav-group">
          <Link to="/" className="book-action-btn"><Home size={18} /> <span>Front</span></Link>
          <button className="book-action-btn" onClick={onToggleView}><ArrowLeft size={18} /> <span>Exit</span></button>
          <button className="book-action-btn" onClick={toggleFullscreen}><Maximize size={18} /> <span>Full</span></button>
        </div>
        <div className="book-nav-group">
          <button className="book-action-btn" onClick={() => setShowTips(true)}><HelpCircle size={18} /> <span>Tips</span></button>
          <button className={`book-action-btn ${showToc ? 'active' : ''}`} onClick={() => setShowToc(true)}><Layers size={18} /> <span>Index</span></button>
          {!isCoverOpen && <button className="book-action-btn" onClick={() => setIsCoverOpen(true)}><BookIcon size={18} /> <span>Cover</span></button>}
        </div>
      </nav>

      <div className={`book-scene ${!isCoverOpen ? 'book-opened' : ''}`}>
        <div className="book-wrap" ref={bookRef}>

          <motion.div
            className="book-cover-group"
            animate={{ rotateY: isCoverOpen ? 0 : -180 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            style={{
              zIndex: isCoverOpen ? 10 : 1
            }}
          >
            <div className="book-page book-cover-front" onClick={isCoverOpen ? () => setIsCoverOpen(false) : undefined}>
              <div className="book-glint"></div>
              <div className="cover-content">
                <div className="mockup-header">
                  <Sparkles size={16} className="sparkle-icon" />
                  <span>PRE-FIRST EDITION</span>
                </div>
                
                <div className="mockup-main">
                  <h1 className="cover-title">HOW<br />CRYPTO<br />ACTUALLY<br />WORKS</h1>
                  <div className="mockup-divider"></div>
                  <p className="mockup-subtitle">THE DEFINITIVE TECHNICAL MANUAL ON PROTOCOL ARCHITECTURE</p>
                </div>

                <div className="mockup-footer">
                  <div className="author-strip">
                    <div className="author-photo-hex">
                      <img src="/larry.jpg" alt="Larry Cermak" />
                    </div>
                    <div className="author-info">
                      <span className="by-pre">WRITTEN BY</span>
                      <span className="author-name">LARRY CERMAK</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cover-spine-edge"></div>
            </div>

            <div className="book-page book-inside-left">
              <div className="inside-left-content attribution-view">
                <div className="attribution-section">
                  <div className="page-chapter-header">
                    <span className="chapter-number">CHAPTER {currentIndex + 1}</span>
                    <h2 className="chapter-big-title">{chapterMeta?.title}</h2>
                  </div>
                  <div className="author-mini-card">
                    <div className="mini-avatar">
                      <img src="/larry.jpg" alt="Larry Cermak" />
                    </div>
                    <div className="mini-text">
                      <span className="mini-name">Larry Cermak</span>
                      <span className="mini-role" style={{ marginTop: '4px', display: 'block' }}>Author</span>
                    </div>
                  </div>
                </div>
                <div className="credits-section">
                  <div className="credits-group"><span className="credits-label">Co-Authors</span><p>Igor Igamberdiev, Bohdan Pavlov</p></div>
                  <div className="credits-group"><span className="credits-label">Reviewers</span><p>Wintermute & The Block</p></div>
                </div>
                <div className="left-page-footer detailed">
                  <div className="attribution-links">
                    <a href="https://github.com/lawmaster10/howcryptoworksbook" target="_blank" rel="noopener noreferrer"><Github size={14} /> <span>GitHub</span></a>
                  </div>
                  <div className="book-license-info">
                    <p>© 2026. CC BY-NC-ND 4.0.</p>
                    <span>{chapterMeta?.title}</span>
                  </div>
                </div>
              </div>
              <div className="page-gutter-right"></div>
            </div>
          </motion.div>

          <div className="book-page book-content-page" onClick={handlePageClick}>
            <div className="page-gutter-left"></div>
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="book-loader"><Loader2 className="spinner" size={40} /></div>
              ) : (
                <div className="book-page-text-container" key={slug}>
                  <div className="book-reader-surface" ref={surfaceRef}>
                    <motion.div
                      className="book-reader-content"
                      ref={measureRef}
                      style={{ height: containerHeight ? `${containerHeight}px` : '100%' }}
                      animate={{ x: `calc(-${internalPage} * (100% + 4rem))` }}
                      transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.8 }}
                    >
                      <div className="markdown-body book-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: () => null,
                            h2: ({ node, ...props }) => <h2 className="book-h2" {...props} />,
                            p: ({ node, ...props }) => <p className="book-p" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="book-quote" {...props} />,
                            code({ node, inline, className, children, ...props }: any) {
                              return (
                                <code className={`${className} book-code ${inline ? 'inline' : 'block'}`} {...props}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  </div>
                  <div className="book-page-nav" onClick={e => e.stopPropagation()}>
                    <button className="page-nav-btn" onClick={handlePrev}><ChevronLeft size={20} /> <span>PREV</span></button>
                    <div className="page-number">PAGE {internalPage + 1} / {totalPages}</div>
                    <button className="page-nav-btn" onClick={handleNext}><span>NEXT</span> <ChevronRight size={20} /></button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToc && (
          <>
            <motion.div className="book-toc-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowToc(false)} />
            <motion.aside className="book-toc-sidebar" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
              <div className="toc-sidebar-header"><h3>Contents</h3><button onClick={() => setShowToc(false)}><X size={20} /></button></div>
              <div className="toc-sidebar-list">
                {chapters.map((ch, idx) => (
                  <button key={ch.id} className={`toc-sidebar-item ${ch.slug === slug ? 'active' : ''}`} onClick={() => goToChapter(ch.slug)}>
                    <span className="item-number">{idx + 1}</span>
                    <span className="item-title">{ch.title}</span>
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTips && (
          <>
            <motion.div className="book-toc-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTips(false)} />
            <motion.div className="book-tips-modal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="tips-modal-header"><h3>Reading Tips</h3><button onClick={() => setShowTips(false)}><X size={20} /></button></div>
              <div className="tips-modal-content">
                <div className="tip-item"><h4>Pagination</h4><p>Click sides of the page or use arrows to flip. No scrolling needed!</p></div>
                <div className="tip-item"><h4>Fullscreen</h4><p>Click **Full** in the top bar for total immersion.</p></div>
                <div className="tip-item"><h4>Zoom</h4><p>Use **Cmd/Ctrl +/-** to adjust text size. Pages re-calculate instantly!</p></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}