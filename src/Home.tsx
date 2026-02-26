import { motion } from 'framer-motion';
import { Book, Brain, Globe, ArrowRight, Github, Sparkles } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useProgress } from './hooks/useProgress';
import { NeuralConsensus } from './components/ThreeVisuals';
import chaptersData from './chapters.json';
import './Home.css';

interface HomeProps {
  onSelectMode: (mode: 'web' | 'book' | 'interactive') => void;
}

export default function Home({ onSelectMode }: HomeProps) {
  const { calculateTotalProgress } = useProgress();
  const globalProgress = calculateTotalProgress(chaptersData.length);

  const modes = [
    {
      id: 'web',
      title: 'Standard Web',
      description: 'Modern reading experience optimized for all devices.',
      icon: <Globe size={24} />,
      color: '#3b82f6'
    },
    {
      id: 'book',
      title: 'Kindle Edition',
      description: 'Immersive 3D spreads with horizontal pagination.',
      icon: <Book size={24} />,
      color: '#facc15'
    },
    {
      id: 'interactive',
      title: 'Learning Lab',
      description: 'Protocol sandboxes and scroll-synced 3D visuals.',
      icon: <Brain size={24} />,
      color: '#10b981',
      progress: globalProgress
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="home-container"
    >
      {/* Cinematic 3D Background */}
      <div className="home-3d-cover">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={['#020202']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <NeuralConsensus />
          </Suspense>
        </Canvas>
      </div>

      <div className="home-content-wrap">
        {/* Fancy Animated Book Cover Hero */}
        <section className="hero-section">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="premium-book-mockup"
          >
            <div className="book-glint"></div>
            <div className="mockup-inner">
              <div className="mockup-header">
                <Sparkles size={16} className="sparkle-icon" />
                <span>PRE-FIRST EDITION</span>
              </div>
              
              <div className="mockup-main">
                <h1>HOW<br/>CRYPTO<br/>ACTUALLY<br/>WORKS</h1>
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
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hero-cta-area"
          >
            <h2>Select Your Environment</h2>
            <div className="home-modes-grid">
              {modes.map((mode, index) => (
                <motion.div 
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`mode-card-mini ${mode.id}`}
                  onClick={() => onSelectMode(mode.id as any)}
                >
                  <div className="mini-mode-icon" style={{ backgroundColor: `${mode.color}20`, color: mode.color }}>
                    {mode.icon}
                  </div>
                  <div className="mini-mode-text">
                    <h3>{mode.title}</h3>
                    <p>{mode.description}</p>
                  </div>
                  <ArrowRight size={18} className="arrow-icon" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <footer className="home-footer-new">
          <div className="footer-collab-row">
            <span>In collaboration with</span>
            <span className="collab-name">WINTERMUTE</span>
            <span className="collab-divider">|</span>
            <span className="collab-name">THE BLOCK</span>
          </div>
          <div className="footer-bottom-row">
            <a href="https://github.com/lawmaster10/howcryptoworksbook" target="_blank" rel="noopener noreferrer">
              <Github size={16} /> <span>Open Source</span>
            </a>
            <span className="copy-text">© 2026 CRYPTO PROTOCOL ARCHITECTURE</span>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
