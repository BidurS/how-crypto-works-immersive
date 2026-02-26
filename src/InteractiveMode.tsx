import { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy,
  Brain,
  Sparkles,
  Home,
  BookOpen as BookIcon,
  RefreshCw,
  Zap,
  List as ListIcon,
  Check as CheckIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BitcoinVisual, EthereumVisual, SolanaVisual, GenericVisual, AMMVisual } from './components/ThreeVisuals';
import { useProgress } from './hooks/useProgress';
import { renderWithGlossary } from './utils/glossary';
import './InteractiveMode.css';

interface ChapterMeta {
  id: string;
  slug: string;
  title: string;
  filename: string;
  path: string;
}

interface InteractiveModeProps {
  chapters: ChapterMeta[];
  onToggleView: () => void;
}

// ----------------------------------------------------------------------
// 3D Visual Router
// ----------------------------------------------------------------------
const ThreeDVisualizer = ({ slug, isMining, ammRatio }: { slug: string, isMining: boolean, ammRatio: number }) => {
  const getVisual = () => {
    switch(slug) {
      case 'bitcoin': return <BitcoinVisual isMining={isMining} />;
      case 'ethereum': return <EthereumVisual />;
      case 'solana': return <SolanaVisual />;
      case 'defi': return <AMMVisual ratio={ammRatio} />;
      default: return <GenericVisual />;
    }
  };

  const getCaption = () => {
    switch(slug) {
      case 'bitcoin': return isMining ? "ACTIVE HASHING: Solving Block Header Puzzle..." : "Proof of Work: Cryptographic Hashing & Nodes";
      case 'ethereum': return "The World Computer: EVM & Layer 2 Scaling";
      case 'solana': return "High Throughput: Proof of History Sequence";
      case 'custody': return "Cryptography: Public/Private Key Asymmetry";
      case 'defi': return "AMM Sandbox: Adjust Liquidity Ratio (x * y = k)";
      default: return "Abstract Protocol Architecture Analysis";
    }
  };

  return (
    <div className="nano-banana-container">
      <div className="nb-header">
        <Sparkles size={16} />
        <span>Nano Banana 3D Engine</span>
      </div>
      <div className="r3f-canvas-container">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <spotLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
          <Suspense fallback={null}>
            {getVisual()}
            <Environment preset="city" />
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={!isMining} 
            autoRotateSpeed={0.5} 
            maxPolarAngle={Math.PI / 1.5} 
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
        <div className="r3f-overlay-caption">
          {getCaption()}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Comprehensive Quiz Database
// ----------------------------------------------------------------------
const quizDatabase: Record<string, any> = {
  preface: {
    questions: [
      {
        question: "What is the primary motivation for writing 'How Crypto Actually Works'?",
        options: [
          "To provide investment advice and price predictions",
          "To serve as a foundational, hype-free technical manual",
          "To promote a specific blockchain ecosystem",
          "To replace official documentation for developers"
        ],
        correct: 1,
        explanation: "The preface explicitly states the book aims to strip away the noise and provide a solid, technical foundation of how these systems function mechanically, acting as a 'missing manual'."
      }
    ]
  },
  bitcoin: {
    questions: [
      {
        question: "What specific problem does Bitcoin's Proof of Work solve in a decentralized network?",
        options: [
          "The Byzantine Generals Problem",
          "The Double-Spending Problem",
          "The Scalability Trilemma",
          "The Oracle Problem"
        ],
        correct: 1,
        explanation: "Proof of Work combined with the longest-chain rule prevents a user from spending the same digital token twice without requiring a trusted central authority."
      },
      {
        question: "What is the maximum supply of Bitcoin ever to be mined?",
        options: ["100 million", "21 million", "Infinite (inflationary)", "50 million"],
        correct: 1,
        explanation: "Bitcoin's protocol has a hard-coded limit of 21 million coins, achieved through a predetermined halving schedule."
      }
    ]
  },
  ethereum: {
    questions: [
      {
        question: "What does the transition to 'Proof of Stake' (The Merge) primarily change for Ethereum?",
        options: [
          "It increases the gas limit per block",
          "It replaces miners with validators, drastically reducing energy consumption",
          "It implements sharding by default",
          "It changes the programming language from Solidity to Rust"
        ],
        correct: 1,
        explanation: "The Merge replaced energy-intensive Proof of Work miners with Proof of Stake validators, reducing the network's energy consumption by ~99.9% while maintaining consensus."
      }
    ]
  },
  solana: {
    questions: [
      {
        question: "What is the core innovation that allows Solana to achieve high throughput?",
        options: [
          "Sharding the state across multiple chains",
          "Proof of History (PoH) acting as a cryptographic clock",
          "Increasing block times to 10 minutes",
          "Removing smart contract capabilities entirely"
        ],
        correct: 1,
        explanation: "Proof of History creates a historical record that proves that an event has occurred at a specific moment in time, allowing validators to process transactions in parallel without waiting for global state consensus first."
      }
    ]
  },
  l1_blockchains: {
    questions: [
      {
        question: "What is the 'Scalability Trilemma' in Layer 1 blockchains?",
        options: [
          "The trade-off between Speed, Cost, and Usability",
          "The trade-off between Decentralization, Security, and Scalability",
          "The difficulty of coordinating Developers, Miners, and Users",
          "The requirement to support EVM, WASM, and native execution"
        ],
        correct: 1,
        explanation: "Coined by Vitalik Buterin, the trilemma states that simple blockchain architectures can only optimize for two of the three properties: Decentralization, Security, and Scalability."
      }
    ]
  },
  custody: {
    questions: [
      {
        question: "What is the fundamental difference between a hot wallet and a cold wallet?",
        options: [
          "Hot wallets hold more funds than cold wallets",
          "Hot wallets are connected to the internet, while cold wallets are kept offline",
          "Hot wallets are run by exchanges, cold wallets are run by the user",
          "Hot wallets support smart contracts, cold wallets only support Bitcoin"
        ],
        correct: 1,
        explanation: "A hot wallet stores keys on an internet-connected device (making them more accessible but vulnerable to hacks), while a cold wallet (like a hardware device) keeps keys entirely offline."
      }
    ]
  },
  market_structure: {
    questions: [
      {
        question: "In crypto market structure, what role do Centralized Exchanges (CEXs) primarily play?",
        options: [
          "They hold custody of user funds and match orders off-chain",
          "They execute every trade directly on the blockchain (on-chain)",
          "They only provide price data to DeFi protocols",
          "They generate block rewards for miners"
        ],
        correct: 0,
        explanation: "CEXs operate internal, off-chain order books for high-speed matching and hold custody of user assets, updating internal databases until a user requests an on-chain withdrawal."
      }
    ]
  },
  defi: {
    questions: [
      {
        question: "In an Automated Market Maker (AMM) like Uniswap, how is the price of an asset determined?",
        options: [
          "By an order book matching buyers and sellers",
          "By a centralized oracle feeding prices from Binance",
          "By a mathematical formula (e.g., x * y = k) based on the ratio of assets in a pool",
          "By the protocol developers setting a fixed rate"
        ],
        correct: 2,
        explanation: "AMMs use a constant product formula where the ratio of token reserves in a liquidity pool automatically determines the execution price for a swap."
      }
    ]
  },
  mev: {
    questions: [
      {
        question: "What does MEV (Maximal Extractable Value) refer to?",
        options: [
          "The maximum block reward a miner can earn in a day",
          "The total market capitalization of a specific token",
          "The profit validators can make by reordering, inserting, or censoring transactions in a block",
          "The highest possible APY offered by a lending protocol"
        ],
        correct: 2,
        explanation: "MEV is the value that block producers (miners or validators) can extract by unilaterally deciding the order of transactions within the blocks they produce."
      }
    ]
  },
  stablecoins_rwas: {
    questions: [
      {
        question: "How do fiat-collateralized stablecoins (like USDC or USDT) maintain their peg?",
        options: [
          "Through an algorithmic rebasing mechanism",
          "By holding an equivalent amount of fiat currency or traditional assets in reserve",
          "By over-collateralizing with volatile crypto assets like ETH",
          "Through a decentralized governance vote every 24 hours"
        ],
        correct: 1,
        explanation: "Fiat-backed stablecoins maintain their 1:1 peg to the US Dollar by keeping a reserve of actual dollars, treasury bills, or equivalent traditional assets that match the circulating supply."
      }
    ]
  },
  hyperliquid: {
    questions: [
      {
        question: "What type of trading infrastructure does Hyperliquid primarily focus on?",
        options: [
          "Spot trading via Automated Market Makers (AMMs)",
          "Fully on-chain order books for perpetual futures",
          "NFT minting and auctions",
          "Over-the-counter (OTC) block trades"
        ],
        correct: 1,
        explanation: "Hyperliquid is designed as an app-chain specifically optimized to run a high-performance, fully on-chain central limit order book (CLOB) for trading perpetual futures."
      }
    ]
  },
  nfts: {
    questions: [
      {
        question: "What makes a Non-Fungible Token (NFT) distinct from an ERC-20 token?",
        options: [
          "NFTs can only be bought with fiat currency",
          "Every NFT has a unique identifier and metadata, meaning they are not mutually interchangeable",
          "NFTs do not run on smart contracts",
          "NFTs can only represent digital art"
        ],
        correct: 1,
        explanation: "Unlike fungible tokens (like ETH or USDC) where every unit is identical, NFTs (usually ERC-721 standard) contain unique identifiers and metadata, making each token one-of-a-kind."
      }
    ]
  },
  governance: {
    questions: [
      {
        question: "In token governance, what is the primary mechanism for making protocol changes?",
        options: [
          "The founding team makes unilateral decisions off-chain",
          "Users submit support tickets to customer service",
          "Token holders vote on on-chain proposals based on their token weight",
          "Miners dictate protocol upgrades through hash rate alone"
        ],
        correct: 2,
        explanation: "Decentralized governance typically relies on token holders voting on proposals. The voting power is usually proportional to the number of governance tokens held or delegated."
      }
    ]
  },
  depin: {
    questions: [
      {
        question: "What does DePIN stand for in the context of crypto?",
        options: [
          "Decentralized Personal Identification Numbers",
          "Decentralized Physical Infrastructure Networks",
          "Digital Payments and International Networks",
          "Delegated Proof of Interoperability Nodes"
        ],
        correct: 1,
        explanation: "DePIN refers to Decentralized Physical Infrastructure Networks, which use token incentives to coordinate the deployment and operation of hardware networks (like Wi-Fi, storage, or sensors)."
      }
    ]
  },
  quantum_resistance: {
    questions: [
      {
        question: "Why are quantum computers considered a theoretical threat to current blockchains?",
        options: [
          "They can consume too much electricity, crashing the grid",
          "They could theoretically break the elliptic curve cryptography (like ECDSA) used for public/private key pairs",
          "They can download the entire blockchain faster than normal computers",
          "They would make hardware wallets obsolete by physically destroying them"
        ],
        correct: 1,
        explanation: "Large-scale quantum computers running Shor's algorithm could theoretically derive a private key from a public key, breaking the foundational cryptography securing user funds on networks like Bitcoin and Ethereum."
      }
    ]
  },
  prediction_markets: {
    questions: [
      {
        question: "What is the primary function of a decentralized prediction market like Polymarket or Augur?",
        options: [
          "To allow users to trade futures contracts with 100x leverage",
          "To aggregate information and assign probabilities to future events by allowing users to bet on outcomes",
          "To provide weather forecasts for blockchain miners",
          "To automatically invest user funds based on AI predictions"
        ],
        correct: 1,
        explanation: "Prediction markets create a financial incentive for individuals to accurately forecast future events (e.g., elections, sports, crypto prices), turning aggregated bets into a real-time probability indicator."
      }
    ]
  }
};

// ----------------------------------------------------------------------
// Main Interactive Mode Component
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Technical Theme Colors
// ----------------------------------------------------------------------
const getChapterColor = (slug: string) => {
  const colors: Record<string, string> = {
    bitcoin: '#facc15',
    ethereum: '#a855f7',
    solana: '#14f195',
    defi: '#ec4899',
    mev: '#ef4444',
    custody: '#3b82f6',
    market_structure: '#6366f1',
    stablecoins_rwas: '#10b981',
    hyperliquid: '#8b5cf6',
    nfts: '#f43f5e',
    governance: '#f97316',
    depin: '#06b6d4',
    quantum_resistance: '#14b8a6',
    prediction_markets: '#f59e0b',
    preface: '#94a3b8'
  };
  return colors[slug] || '#3b82f6';
};

// ----------------------------------------------------------------------
// Main Interactive Mode Component
// ----------------------------------------------------------------------
export default function InteractiveMode({ chapters, onToggleView }: InteractiveModeProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isSyllabusCollapsed, setIsSyllabusCollapsed] = useState(false);
  
  // Progress State
  const { saveQuizResult, calculateTotalProgress, getChapterProgress } = useProgress();
  const globalProgress = calculateTotalProgress(chapters.length);

  // Sandbox State
  const [isMining, setIsMining] = useState(false);
  const [ammRatio, setAmmRatio] = useState(0.5);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentIndex = chapters.findIndex(c => c.slug === slug);
  const chapterMeta = chapters[currentIndex];
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const currentQuizData = quizDatabase[slug || ''] || null;
  const activeColor = getChapterColor(slug || '');

  // Reading Time & TOC Logic
  const readingTime = Math.ceil(content.split(/\s+/).length / 200);
  const headings = content.match(/^##\s+.+$/gm)?.map(h => h.replace('## ', '')) || [];
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0% -70% 0%', threshold: 0 }
    );

    const elements = document.querySelectorAll('.lab-h2, .lab-h3');
    if (elements.length > 0) observer.observe(elements[0]);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content, loading]);

  useEffect(() => {
    if (!chapterMeta) return;
    const fetchContent = async () => {
      setLoading(true);
      setIsSyllabusOpen(false); // Close on navigation
      try {
        const response = await fetch(chapterMeta.path);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        setContent(`# Error\nCould not fetch content data.`);
      } finally {
        setLoading(false);
        resetQuiz();
        setIsMining(false);
        setAmmRatio(0.5);
      }
    };
    fetchContent();
  }, [slug, chapterMeta]);

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === currentQuizData.questions[quizStep].correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (quizStep < currentQuizData.questions.length - 1) {
      setQuizStep(s => s + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setQuizFinished(true);
      if (slug) {
        saveQuizResult(slug, score + (isCorrect ? 1 : 0), currentQuizData.questions.length);
      }
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="learning-lab-container" style={{ '--active-accent': activeColor } as any}>
      {/* Top Header Navigation */}
      <header className="lab-header">
        <div className="lab-header-left">
          <Link to="/" className="lab-home-btn desktop-only"><Home size={20} /> Exit Lab</Link>
          <button className="lab-mobile-menu-btn" onClick={() => setIsSyllabusOpen(!isSyllabusOpen)}>
            <ListIcon size={24} />
          </button>
        </div>
        <div className="lab-header-center">
          <div className="lab-chapter-badges">
            <div className="lab-chapter-badge" style={{ backgroundColor: activeColor }}>MODULE {currentIndex + 1}</div>
            <div className="lab-time-badge">{readingTime} MIN READ</div>
          </div>
          <h1 className="lab-module-title">{chapterMeta?.title}</h1>
        </div>
        <div className="lab-header-right">
          <div className="lab-progress-container desktop-only">
            <span className="progress-text">Course Mastery</span>
            <div className="lab-progress-track">
              <div className="lab-progress-fill" style={{ width: `${globalProgress}%` }}></div>
            </div>
          </div>
          <button className="lab-home-btn mode-switch-btn" onClick={onToggleView}>Mode</button>
        </div>
      </header>

      <main className={`lab-layout ${isSyllabusCollapsed ? 'syllabus-collapsed' : ''}`}>
        
        {/* Mobile Sidebar Overlay */}
        {isSyllabusOpen && <div className="lab-sidebar-overlay" onClick={() => setIsSyllabusOpen(false)}></div>}

        {/* Global Syllabus / Book Outline Sidebar */}
        <nav className={`lab-syllabus-sidebar ${isSyllabusOpen ? 'open' : ''} ${isSyllabusCollapsed ? 'collapsed' : ''}`}>
          <div className="syllabus-header">
            {!isSyllabusCollapsed && (
              <>
                <ListIcon size={16} />
                <span>Curriculum</span>
              </>
            )}
            <button 
              className="syllabus-collapse-btn desktop-only" 
              onClick={() => setIsSyllabusCollapsed(!isSyllabusCollapsed)}
              title={isSyllabusCollapsed ? "Expand Curriculum" : "Collapse Curriculum"}
            >
              {isSyllabusCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button className="syllabus-close-btn mobile-only" onClick={() => setIsSyllabusOpen(false)}><XCircle size={20}/></button>
          </div>
          
          {!isSyllabusCollapsed && (
            <div className="syllabus-list">
              {chapters.map((c, i) => {
                const chapterProgress = getChapterProgress(c.slug);
                const isActive = c.slug === slug;
                const color = getChapterColor(c.slug);
                return (
                  <Link 
                    key={c.id} 
                    to={`/interactive/${c.slug}`}
                    className={`syllabus-item ${isActive ? 'active' : ''} ${chapterProgress.completed ? 'completed' : ''}`}
                    style={isActive ? { borderRightColor: color, backgroundColor: `${color}10` } : {}}
                  >
                    <div className="item-number" style={isActive ? { backgroundColor: color } : {}}>{i + 1}</div>
                    <div className="item-title">{c.title.split(': ').pop()}</div>
                    {chapterProgress.completed && (
                      <div className="item-status">
                        <CheckIcon size={14} />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Left Column: Learning Tools (Visuals & Quiz) */}
        <section className="lab-tools-column">
          
          {/* True 3D React Three Fiber Visualizer */}
          <div className="nano-banana-card">
             <ThreeDVisualizer slug={slug || ''} isMining={isMining} ammRatio={ammRatio} />
             
             {/* Dynamic Sandbox UI Overlays */}
             {slug === 'bitcoin' && (
               <div className="sandbox-controls">
                 <button 
                   className={`sandbox-btn ${isMining ? 'active' : ''}`}
                   onMouseDown={() => setIsMining(true)}
                   onMouseUp={() => setIsMining(false)}
                   onMouseLeave={() => setIsMining(false)}
                 >
                   <Zap size={14} /> {isMining ? 'MINING ACTIVE...' : 'HOLD TO MINE BLOCK'}
                 </button>
               </div>
             )}

             {slug === 'defi' && (
               <div className="sandbox-controls">
                 <div className="amm-slider-wrap">
                   <div className="slider-labels">
                     <span>Token X</span>
                     <span>Token Y</span>
                   </div>
                   <input 
                     type="range" 
                     min="0.1" 
                     max="0.9" 
                     step="0.01" 
                     value={ammRatio} 
                     onChange={(e) => setAmmRatio(parseFloat(e.target.value))}
                     className="amm-slider"
                   />
                   <div className="amm-formula">x * y = k</div>
                 </div>
               </div>
             )}
          </div>

          {/* Interactive Knowledge Check */}
          <div className="interactive-card quiz-card">
            <div className="card-header"><Brain size={18} /> <span>Knowledge Check</span></div>
            <div className="card-body">
              {currentQuizData ? (
                !quizFinished ? (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={quizStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="quiz-question-container"
                    >
                      <h3 className="quiz-question">{currentQuizData.questions[quizStep].question}</h3>
                      <div className="quiz-options">
                        {currentQuizData.questions[quizStep].options.map((opt: string, i: number) => (
                          <button 
                            key={i}
                            className={`quiz-option-btn ${selectedOption === i ? (isCorrect ? 'correct' : 'wrong') : ''} ${selectedOption !== null && selectedOption !== i ? 'dimmed' : ''}`}
                            onClick={() => handleOptionSelect(i)}
                            disabled={selectedOption !== null}
                          >
                            <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                            <span className="opt-text">{opt}</span>
                            {selectedOption === i && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="opt-icon">
                                {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {selectedOption !== null && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                            animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                            className={`quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`}
                          >
                            <div className="feedback-header">
                              {isCorrect ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
                              <strong>{isCorrect ? 'Correct' : 'Incorrect'}</strong>
                            </div>
                            <p>{currentQuizData.questions[quizStep].explanation}</p>
                            <button className="quiz-next-btn" onClick={nextQuestion}>
                              {quizStep < currentQuizData.questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={16} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="quiz-results-container">
                    <div className="results-icon">
                      {score === currentQuizData.questions.length ? <Trophy size={64} color="#facc15" /> : <Brain size={64} color="#60a5fa" />}
                    </div>
                    <h2>{score === currentQuizData.questions.length ? 'Module Mastered!' : 'Module Complete'}</h2>
                    <div className="score-display">
                      <span className="score-number">{score}</span>
                      <span className="score-divider">/</span>
                      <span className="score-total">{currentQuizData.questions.length}</span>
                    </div>
                    <button className="quiz-retry-btn" onClick={resetQuiz}><RefreshCw size={16} /> Retry Quiz</button>
                  </motion.div>
                )
              ) : (
                <div className="quiz-empty-state">
                  <BookIcon size={48} className="empty-icon" />
                  <h3>Reading Phase</h3>
                  <p>Read through the material on the right. An interactive knowledge check is being prepared for this module.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Deep Reading Material */}
        <section className="lab-content-column">
          <nav className="lab-sticky-nav">
            <div className="sticky-nav-inner">
              <ul className="sticky-nav-list">
                {/* Book Outline Level (Modules) */}
                <div className="sticky-nav-group chapters-group">
                  {chapters.map((c, i) => {
                    const isActive = c.slug === slug;
                    const color = getChapterColor(c.slug);
                    return (
                      <li key={c.id} className={`sticky-nav-item chapter-item ${isActive ? 'active' : ''}`}>
                        <Link 
                          to={`/interactive/${c.slug}`}
                          style={isActive ? { color: color, borderColor: color } : {}}
                        >
                          CH {i}
                        </Link>
                      </li>
                    );
                  })}
                </div>
                
                <div className="sticky-nav-divider"></div>

                {/* Chapter Outline Level (Sections) */}
                <div className="sticky-nav-group sections-group">
                  {headings.map((h, i) => {
                    const id = h.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <li key={i} className={`sticky-nav-item section-item ${activeSection === id ? 'active' : ''}`}>
                        <a href={`#${id}`} onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                          {h}
                        </a>
                      </li>
                    );
                  })}
                </div>
              </ul>
            </div>
          </nav>

          <div className="lab-reader-surface">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="lab-loading">
                  <Loader2 className="spinner" size={48} />
                  <p>Loading module data...</p>
                </div>
              ) : (
                <motion.div 
                  key={slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="lab-markdown-container"
                >
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: () => null, // Hidden as it's in the header
                      h2: ({node, children, ...props}: any) => {
                        const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
                        return <h2 id={id} className="lab-h2" {...props}>{children}</h2>;
                      },
                      h3: ({node, children, ...props}: any) => {
                        const id = children?.toString().toLowerCase().replace(/\s+/g, '-');
                        return <h3 id={id} className="lab-h3" {...props}>{children}</h3>;
                      },
                      p: ({node, children, ...props}: any) => <p className="lab-p" {...props}>{renderWithGlossary(children)}</p>,
                      ul: ({node, ...props}) => <ul className="lab-ul" {...props} />,
                      ol: ({node, ...props}) => <ol className="lab-ol" {...props} />,
                      li: ({node, children, ...props}: any) => <li className="lab-li" {...props}>{renderWithGlossary(children)}</li>,
                      blockquote: ({node, ...props}) => <blockquote className="lab-quote" {...props} />,
                      code({node, inline, className, children, ...props}: any) {
                        return (
                          <code className={`${className} lab-code ${inline ? 'inline' : 'block'}`} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {content}
                  </ReactMarkdown>

                  {/* Module Progression */}
                  {nextChapter && (
                    <div className="lab-progression-cta">
                      <div className="cta-content">
                        <h3>Ready to move on?</h3>
                        <p>Make sure you've completed the knowledge check before advancing to the next module.</p>
                      </div>
                      <button className="cta-advance-btn" onClick={() => navigate(`/interactive/${nextChapter.slug}`)}>
                        Start Module {currentIndex + 2} <ArrowRight size={20} />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>
    </div>
  );
}
