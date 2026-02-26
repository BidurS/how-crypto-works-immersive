import { motion } from 'framer-motion';
import { Book, Brain, Globe, ArrowRight, Github, Trophy } from 'lucide-react';
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
      description: 'Clean, modern reading experience optimized for all devices with standard scrolling.',
      icon: <Globe size={32} />,
      color: '#3b82f6'
    },
    {
      id: 'book',
      title: 'Kindle Edition',
      description: 'Immersive 3D book spread with horizontal pagination. Best for focused desktop reading.',
      icon: <Book size={32} />,
      color: '#facc15'
    },
    {
      id: 'interactive',
      title: 'Learning Lab',
      description: 'The premium technical experience. Scroll-synced 3D visuals, active context glossary, and protocol sandboxes.',
      icon: <Brain size={32} />,
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
      {/* 3D Generative Background Cover */}
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

      <div className="home-bg-glow"></div>
      
      <header className="home-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="brand-badge"
        >
          PRE-FIRST EDITION
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          How Crypto <br/>Actually Works
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="home-author"
        >
          by&nbsp;&nbsp;Larry Cermak
        </motion.p>
      </header>

      <main className="home-modes-grid">
        {modes.map((mode, index) => (
          <motion.div 
            key={mode.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`mode-card ${mode.id}`}
            onClick={() => onSelectMode(mode.id as any)}
          >
            <div className="mode-icon" style={{ color: mode.color }}>
              {mode.icon}
            </div>
            <h3>{mode.title}</h3>
            <p>{mode.description}</p>
            
            {mode.progress !== undefined && (
              <div className="mode-progress-container">
                <div className="mode-progress-header">
                  <span className="mode-progress-label">Course Mastery</span>
                  <span className="mode-progress-value">{mode.progress}%</span>
                </div>
                <div className="mode-progress-track">
                  <div className="mode-progress-fill" style={{ width: `${mode.progress}%`, backgroundColor: mode.color }}></div>
                </div>
                {mode.progress === 100 && (
                  <div className="mode-progress-complete">
                    <Trophy size={14} /> Certified Master
                  </div>
                )}
              </div>
            )}

            <button className="mode-start-btn">
              {mode.progress && mode.progress > 0 ? 'Continue' : 'Explore'} <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </main>

      <footer className="home-footer">
        <div className="footer-links">
          <a href="https://github.com/lawmaster10/howcryptoworksbook" target="_blank" rel="noopener noreferrer">
            <Github size={18} /> <span>Open Source on GitHub</span>
          </a>
        </div>
        <p className="footer-collab">
          In collaboration with Wintermute Research & The Block Research
        </p>
      </footer>
    </motion.div>
  );
}