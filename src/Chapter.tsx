import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import './Chapter.css';

interface ChapterMeta {
  id: string;
  slug: string;
  title: string;
  filename: string;
  path: string;
}

interface ChapterProps {
  chapters: ChapterMeta[];
}

export default function Chapter({ chapters }: ChapterProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Find current, next, and previous chapters
  const currentIndex = chapters.findIndex(c => c.slug === slug);
  const chapterMeta = chapters[currentIndex];
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  useEffect(() => {
    if (!chapterMeta) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(chapterMeta.path);
        if (!response.ok) throw new Error('Failed to fetch chapter');
        const text = await response.text();
        
        // Let's strip the first # Title line as we want to handle the title styling manually or keep it if it's nicely formatted.
        // The markdown already has # Title, so we'll let ReactMarkdown render it.
        setContent(text);
      } catch (error) {
        console.error("Error loading chapter:", error);
        setContent(`# Error Loading Chapter
Could not fetch the chapter content.`);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchContent();
  }, [slug, chapterMeta]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const windowHeight = scrollHeight - clientHeight;
      const progress = windowHeight === 0 ? 0 : (scrollTop / windowHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!chapterMeta) {
    return <div className="chapter-not-found">Chapter not found</div>;
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition: any = {
    type: 'tween' as const,
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <div className="chapter-container">
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }}></div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            className="loader-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="spinner" size={48} />
          </motion.div>
        ) : (
          <motion.article 
            key={slug}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="chapter-content"
            ref={contentRef}
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Add some subtle staggered animations to headings and paragraphs
                h1: ({node, ...props}) => <motion.h1 initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: 0.1}} {...props as any} />,
                h2: ({node, ...props}) => <h2 className="section-heading" {...props} />,
                h3: ({node, ...props}) => <h3 className="sub-section-heading" {...props} />,
                p: ({node, ...props}) => <p className="paragraph" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal" {...props} />,
                li: ({node, ...props}) => <li className="list-item" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="quote" {...props} />,
                code({node, inline, className, children, ...props}: any) {
                  return (
                    <code className={`${className} code-block ${inline ? 'inline' : 'block'}`} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Chapter Navigation Footer */}
            <div className="chapter-navigation">
              {prevChapter ? (
                <button 
                  className="nav-btn prev"
                  onClick={() => navigate(`/${prevChapter.slug}`)}
                >
                  <ChevronLeft size={20} />
                  <div className="nav-btn-text">
                    <span className="nav-label">Previous</span>
                    <span className="nav-title">{prevChapter.title}</span>
                  </div>
                </button>
              ) : <div className="nav-spacer"></div>}

              {nextChapter ? (
                <button 
                  className="nav-btn next"
                  onClick={() => navigate(`/${nextChapter.slug}`)}
                >
                  <div className="nav-btn-text">
                    <span className="nav-label">Next</span>
                    <span className="nav-title">{nextChapter.title}</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
              ) : <div className="nav-spacer"></div>}
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}