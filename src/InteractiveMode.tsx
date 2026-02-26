import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
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
  ChevronRight,
  Info,
  Lock,
  Terminal as TerminalIcon,
  Layers,
  Activity,
  Send,
  Volume2,
  VolumeX,
  Fingerprint,
  ShieldCheck
} from 'lucide-react';
import { BitcoinVisual, EthereumVisual, SolanaVisual, GenericVisual, AMMVisual, BlockchainProgress, CustodyVisual } from './components/ThreeVisuals';
import { useProgress } from './hooks/useProgress';
import { useSoundscape } from './hooks/useSoundscape';
import { renderWithGlossary, glossaryData } from './utils/glossary';
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
// Protocol Event Terminal
// ----------------------------------------------------------------------
const TerminalFeed = ({ slug }: { slug: string }) => {
  const [logs, setTerminalLogs] = useState<{ id: string; text: string; type: 'info' | 'success' | 'warning' }[]>([]);

  useEffect(() => {
    const getThemeLogs = () => {
      switch(slug) {
        case 'bitcoin': return [
          { text: `[POW] Solving block hash... 0000000000000000${Math.random().toString(16).slice(2, 10)}`, type: 'info' },
          { text: `[NET] New transaction received: ${Math.random().toString(36).slice(2, 10)} BTC`, type: 'info' },
          { text: `[CONSENSUS] Longest chain tip updated to #${827000 + Math.floor(Math.random() * 1000)}`, type: 'success' },
        ];
        case 'ethereum': return [
          { text: `[EVM] Executing contract call at 0x${Math.random().toString(16).slice(2, 42)}`, type: 'info' },
          { text: `[MEMPOOL] 12 transactions queued. Gas: ${15 + Math.floor(Math.random() * 10)} gwei`, type: 'warning' },
          { text: `[L2] State batch confirmed on Mainnet`, type: 'success' },
        ];
        case 'solana': return [
          { text: `[POH] Clock pulse: slot ${123456789 + Math.floor(Math.random() * 1000)}`, type: 'info' },
          { text: `[NET] Current TPS: ${2500 + Math.floor(Math.random() * 1000)}`, type: 'success' },
          { text: `[VOTE] Validator 0x${Math.random().toString(16).slice(2, 8)} recorded vote`, type: 'info' },
        ];
        case 'defi': return [
          { text: `[AMM] Swap detected: 1.5 ETH -> ${3500 + Math.floor(Math.random() * 100)} USDC`, type: 'info' },
          { text: `[LP] Liquidity provision: 10,000 USDT added to pool`, type: 'success' },
          { text: `[ORACLE] Chainlink update: ETH/USD = $2,450.12`, type: 'info' },
        ];
        case 'custody': return [
          { text: `[KEYGEN] Sampling physical entropy source...`, type: 'info' },
          { text: `[SECURE] Cold storage vault initialized.`, type: 'success' },
          { text: `[AUTH] Multi-sig threshold met (2/3 signatures)`, type: 'info' },
        ];
        default: return [
          { text: `[SYSTEM] Protocol analyzer synchronized.`, type: 'info' },
          { text: `[NET] Peer connection established: 127.0.0.1:8333`, type: 'success' },
        ];
      }
    };

    const interval = setInterval(() => {
      const themes = getThemeLogs();
      const theme = themes[Math.floor(Math.random() * themes.length)];
      const newLog = { 
        id: Math.random().toString(), 
        text: theme.text,
        type: theme.type as 'info' | 'success' | 'warning'
      };
      setTerminalLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 3000);

    return () => clearInterval(interval);
  }, [slug]);

  return (
    <div className="protocol-terminal">
      <div className="terminal-header">
        <TerminalIcon size={14} />
        <span>Live Protocol Feed</span>
        <div className="terminal-status-dot"></div>
      </div>
      <div className="terminal-body">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`terminal-line ${log.type}`}
            >
              <span className="line-timestamp">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span className="line-text">{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3D Visual Router
// ----------------------------------------------------------------------
const ThreeDVisualizer = ({ slug, isMining, ammRatio, activeSection, custodyEntropy }: { slug: string, isMining: boolean, ammRatio: number, activeSection: string, custodyEntropy: number }) => {
  const getVisual = () => {
    switch(slug) {
      case 'bitcoin': return <BitcoinVisual isMining={isMining} state={activeSection} />;
      case 'ethereum': return <EthereumVisual />;
      case 'solana': return <SolanaVisual />;
      case 'defi': return <AMMVisual ratio={ammRatio} />;
      case 'custody': return <CustodyVisual entropy={custodyEntropy} />;
      default: return <GenericVisual />;
    }
  };

  const getCaption = () => {
    switch(slug) {
      case 'bitcoin': return isMining ? "ACTIVE HASHING: Solving Block Header Puzzle..." : "Proof of Work: Cryptographic Hashing & Nodes";
      case 'ethereum': return "The World Computer: EVM & Layer 2 Scaling";
      case 'solana': return "High Throughput: Proof of History Sequence";
      case 'custody': return "Keygen Sandbox: Collecting Entropy Particles";
      case 'defi': return "AMM Sandbox: Adjust Liquidity Ratio (x * y = k)";
      default: return "Abstract Protocol Architecture Analysis";
    }
  };

  return (
    <div className="nano-banana-container">
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
            autoRotate={slug !== 'custody'} 
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
        explanation: "Token holders typically rely on token holders voting on proposals. The voting power is usually proportional to the number of governance tokens held or delegated."
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

const getContrastColor = (hexcolor: string) => {
  if (!hexcolor) return '#ffffff';
  const hex = hexcolor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
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
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved === 'true';
  });
  
  const { saveQuizResult, getChapterProgress } = useProgress();
  const { playClick, playUnlock } = useSoundscape(isSoundEnabled);

  const [isMining, setIsMining] = useState(false);
  const [ammRatio, setAmmRatio] = useState(0.5);
  const [ethGas, setEthGas] = useState({ base: 20, priority: 2 });
  const [solTPS, setSolTPS] = useState(2500);
  
  // Custody Entropy State
  const [custodyEntropy, setCustodyEntropy] = useState(0);
  const [derivedKey, setDerivedKey] = useState('');
  const lastMousePos = useRef({ x: 0, y: 0 });

  const [quizStep, setQuizStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [isGated, setIsGated] = useState(false);
  const [unlockedGates, setUnlockedGates] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('unlockedGates');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('unlockedGates', JSON.stringify(unlockedGates));
  }, [unlockedGates]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', isSoundEnabled.toString());
  }, [isSoundEnabled]);

  const [pinnedTerms, setPinnedTerms] = useState<string[]>([]);

  useEffect(() => {
    const handleLock = (e: any) => {
      const term = e.detail;
      setPinnedTerms(prev => prev.includes(term) ? prev : [term, ...prev].slice(0, 3));
      if (isSoundEnabled) playClick();
    };
    window.addEventListener('glossary-lock', handleLock);
    return () => window.removeEventListener('glossary-lock', handleLock);
  }, [isSoundEnabled, playClick]);

  useEffect(() => {
    if (slug && ['bitcoin', 'ethereum', 'solana', 'custody'].includes(slug) && !unlockedGates[slug]) {
      setIsGated(true);
    } else {
      setIsGated(false);
    }
  }, [slug, unlockedGates]);

  useEffect(() => {
    let timer: any;
    if (slug === 'bitcoin' && isMining && isGated) {
      timer = setTimeout(() => {
        setUnlockedGates(prev => ({ ...prev, bitcoin: true }));
        setIsGated(false);
        if (isSoundEnabled) playUnlock();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isMining, isGated, slug, isSoundEnabled, playUnlock]);

  const unlockEth = () => {
    if (isSoundEnabled) playClick();
    if (ethGas.base + ethGas.priority >= 40) {
      setUnlockedGates(prev => ({ ...prev, ethereum: true }));
      setIsGated(false);
      if (isSoundEnabled) playUnlock();
    }
  };

  const unlockSol = () => {
    if (isSoundEnabled) playClick();
    if (solTPS >= 10000) {
      setUnlockedGates(prev => ({ ...prev, solana: true }));
      setIsGated(false);
      if (isSoundEnabled) playUnlock();
    }
  };

  // Custody Interaction
  const handleEntropyGeneration = useCallback((e: React.MouseEvent) => {
    if (slug !== 'custody' || custodyEntropy >= 1) return;
    
    const dx = Math.abs(e.clientX - lastMousePos.current.x);
    const dy = Math.abs(e.clientY - lastMousePos.current.y);
    const movement = Math.sqrt(dx*dx + dy*dy);
    
    if (movement > 5) {
      setCustodyEntropy(prev => {
        const next = Math.min(1, prev + 0.005);
        if (next >= 1 && prev < 1) {
          const fakeKey = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
          setDerivedKey(fakeKey);
          setUnlockedGates(prevGates => ({ ...prevGates, custody: true }));
          setIsGated(false);
          if (isSoundEnabled) playUnlock();
        }
        return next;
      });
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [slug, custodyEntropy, isSoundEnabled, playUnlock]);

  const currentIndex = chapters.findIndex(c => c.slug === slug);
  const chapterMeta = chapters[currentIndex];
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const currentQuizData = quizDatabase[slug || ''] || null;
  const activeColor = getChapterColor(slug || '');

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
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content, loading]);

  useEffect(() => {
    if (!chapterMeta) return;
    const fetchContent = async () => {
      setLoading(true);
      setIsSyllabusOpen(false);
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
        setCustodyEntropy(0);
        setDerivedKey('');
      }
    };
    fetchContent();
  }, [slug, chapterMeta]);

  const handleOptionSelect = (idx: number) => {
    if (isSoundEnabled) playClick();
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === currentQuizData.questions[quizStep].correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (isSoundEnabled) playClick();
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
    if (isSoundEnabled) playClick();
    setQuizStep(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="learning-lab-container" 
      style={{ '--active-accent': activeColor } as any}
    >
      <header className="lab-header">
        <div className="lab-header-left">
          <Link to="/" className="lab-home-btn desktop-only" onClick={() => isSoundEnabled && playClick()}><Home size={20} /> Exit to Home</Link>
          <button className="lab-mobile-menu-btn" onClick={() => { setIsSyllabusOpen(!isSyllabusOpen); isSoundEnabled && playClick(); }}>
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
          <div className="lab-progress-blocks-wrap desktop-only">
            <span className="progress-text">Consensus Chain Progress</span>
            <div className="lab-header-canvas-wrap">
              <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <BlockchainProgress chapters={chapters} currentSlug={slug || ''} getProgress={getChapterProgress} />
                </Suspense>
              </Canvas>
            </div>
          </div>
          <button 
            className={`lab-home-btn sound-toggle-btn ${!isSoundEnabled ? 'disabled' : ''}`} 
            onClick={() => { setIsSoundEnabled(!isSoundEnabled); !isSoundEnabled && playClick(); }}
            title={isSoundEnabled ? "Disable Soundscape" : "Enable Soundscape"}
          >
            {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button className="lab-home-btn mode-switch-btn" onClick={() => { onToggleView(); isSoundEnabled && playClick(); }} title="Switch Reading Mode">
            <Layers size={20} />
          </button>
        </div>
      </header>

      <main className={`lab-layout ${isSyllabusCollapsed ? 'syllabus-collapsed' : ''}`}>
        {isSyllabusOpen && <div className="lab-sidebar-overlay" onClick={() => { setIsSyllabusOpen(false); isSoundEnabled && playClick(); }}></div>}
        <nav className={`lab-syllabus-sidebar ${isSyllabusOpen ? 'open' : ''} ${isSyllabusCollapsed ? 'collapsed' : ''}`}>
          <div className="syllabus-header">
            {!isSyllabusCollapsed && (
              <>
                <ListIcon size={16} />
                <span>Curriculum</span>
              </>
            )}
            <button className="syllabus-collapse-btn desktop-only" onClick={() => { setIsSyllabusCollapsed(!isSyllabusCollapsed); isSoundEnabled && playClick(); }}>
              {isSyllabusCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button className="syllabus-close-btn mobile-only" onClick={() => { setIsSyllabusOpen(false); isSoundEnabled && playClick(); }}><XCircle size={20}/></button>
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
                    onClick={() => isSoundEnabled && playClick()}
                  >
                    <div className="item-number" style={isActive ? { backgroundColor: color } : {}}>{i + 1}</div>
                    <div className="item-title">{c.title.split(': ').pop()}</div>
                    {chapterProgress.completed && <div className="item-status"><CheckIcon size={14} /></div>}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        <section className="lab-tools-column">
          <div className="nano-banana-card" onMouseMove={handleEntropyGeneration}>
             <ThreeDVisualizer slug={slug || ''} isMining={isMining} ammRatio={ammRatio} activeSection={activeSection} custodyEntropy={custodyEntropy} />
             {slug === 'bitcoin' && (
               <div className="sandbox-controls">
                 <button 
                   className={`sandbox-btn ${isMining ? 'active' : ''}`}
                   onMouseDown={() => { setIsMining(true); isSoundEnabled && playClick(); }}
                   onMouseUp={() => setIsMining(false)}
                   onMouseLeave={() => setIsMining(false)}
                 >
                   <Zap size={14} /> {isMining ? 'MINING ACTIVE...' : 'HOLD TO MINE BLOCK'}
                 </button>
               </div>
             )}
             {slug === 'ethereum' && (
               <div className="sandbox-controls">
                 <div className="eth-gas-wrap">
                   <div className="gas-label">Adjust Gas Settings</div>
                   <div className="gas-input-group">
                     <label>Base Fee: {ethGas.base} gwei</label>
                     <input type="range" min="10" max="100" value={ethGas.base} onChange={(e) => setEthGas(prev => ({ ...prev, base: parseInt(e.target.value) }))} />
                   </div>
                   <div className="gas-input-group">
                     <label>Priority: {ethGas.priority} gwei</label>
                     <input type="range" min="1" max="50" value={ethGas.priority} onChange={(e) => setEthGas(prev => ({ ...prev, priority: parseInt(e.target.value) }))} />
                   </div>
                   <button className="sandbox-btn" onClick={unlockEth}>
                     <Send size={14} /> SUBMIT TRANSACTION
                   </button>
                 </div>
               </div>
             )}
             {slug === 'solana' && (
               <div className="sandbox-controls">
                 <div className="sol-tps-wrap">
                   <div className="gas-label">Parallel Throughput</div>
                   <div className="tps-value">{solTPS} TPS</div>
                   <input type="range" min="1000" max="50000" step="100" value={solTPS} onChange={(e) => setSolTPS(parseInt(e.target.value))} />
                   <button className="sandbox-btn" onClick={unlockSol}><Activity size={14} /> SYNC VALIDATORS</button>
                 </div>
               </div>
             )}
             {slug === 'custody' && (
               <div className="sandbox-controls">
                 <div className="entropy-wrap">
                   <div className="gas-label">Entropy Collection</div>
                   <div className="entropy-bar-bg">
                     <motion.div 
                       className="entropy-bar-fill" 
                       initial={{ width: 0 }}
                       animate={{ width: `${custodyEntropy * 100}%` }}
                     />
                   </div>
                   <div className="entropy-status">
                     {custodyEntropy < 1 ? (
                       <><Fingerprint size={12} /> MOVE MOUSE TO GENERATE</>
                     ) : (
                       <><ShieldCheck size={12} /> ENTROPY SECURED</>
                     )}
                   </div>
                   {derivedKey && (
                     <div className="derived-key-box">
                       <code>0x{derivedKey.slice(0, 12)}...</code>
                     </div>
                   )}
                 </div>
               </div>
             )}
             {slug === 'defi' && (
               <div className="sandbox-controls">
                 <div className="amm-slider-wrap">
                   <div className="slider-labels"><span>Token X</span><span>Token Y</span></div>
                   <input type="range" min="0.1" max="0.9" step="0.01" value={ammRatio} onChange={(e) => setAmmRatio(parseFloat(e.target.value))} onInput={() => isSoundEnabled && playClick()} className="amm-slider" />
                   <div className="amm-formula">x * y = k</div>
                 </div>
               </div>
             )}
          </div>
          <TerminalFeed slug={slug || ''} />
          
          <AnimatePresence>
            {pinnedTerms.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="interactive-card glossary-card">
                <div className="card-header">
                  <Info size={18} /> <span>Protocol Research</span>
                  <button className="clear-pins-btn" onClick={() => { setPinnedTerms([]); isSoundEnabled && playClick(); }}>Clear</button>
                </div>
                <div className="card-body glossary-highlights">
                  {pinnedTerms.map(term => (
                    <div key={`pinned-${term}`} className="glossary-highlight-item pinned">
                      <span className="gh-term"><span className="pinned-badge">Pinned</span> {term}</span>
                      <p className="gh-def">{glossaryData[term]}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="interactive-card quiz-card">
            <div className="card-header"><Brain size={18} /> <span>Knowledge Check</span></div>
            <div className="card-body">
              {currentQuizData ? (
                !quizFinished ? (
                  <AnimatePresence mode="wait">
                    <motion.div key={quizStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="quiz-question-container">
                      <h3 className="quiz-question">{currentQuizData.questions[quizStep].question}</h3>
                      <div className="quiz-options">
                        {currentQuizData.questions[quizStep].options.map((opt: string, i: number) => (
                          <button key={i} className={`quiz-option-btn ${selectedOption === i ? (isCorrect ? 'correct' : 'wrong') : ''} ${selectedOption !== null && selectedOption !== i ? 'dimmed' : ''}`} onClick={() => handleOptionSelect(i)} disabled={selectedOption !== null}>
                            <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                            <span className="opt-text">{opt}</span>
                            {selectedOption === i && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="opt-icon">{isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</motion.div>}
                          </button>
                        ))}
                      </div>
                      <AnimatePresence>
                        {selectedOption !== null && (
                          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 20 }} className={`quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                            <div className="feedback-header">{isCorrect ? <CheckCircle2 size={16}/> : <XCircle size={16}/>} <strong>{isCorrect ? 'Correct' : 'Incorrect'}</strong></div>
                            <p>{currentQuizData.questions[quizStep].explanation}</p>
                            <button className="quiz-next-btn" onClick={nextQuestion}>{quizStep < currentQuizData.questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={16} /></button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="quiz-results-container">
                    <div className="results-icon">{score === currentQuizData.questions.length ? <Trophy size={64} color="#facc15" /> : <Brain size={64} color="#60a5fa" />}</div>
                    <h2>{score === currentQuizData.questions.length ? 'Module Mastered!' : 'Module Complete'}</h2>
                    <div className="score-display"><span className="score-number">{score}</span><span className="score-divider">/</span><span className="score-total">{currentQuizData.questions.length}</span></div>
                    <button className="quiz-retry-btn" onClick={resetQuiz}><RefreshCw size={16} /> Retry Quiz</button>
                  </motion.div>
                )
              ) : (
                <div className="quiz-empty-state"><BookIcon size={48} className="empty-icon" /><h3>Reading Phase</h3><p>Read through the material on the right. An interactive knowledge check is being prepared for this module.</p></div>
              )}
            </div>
          </div>
        </section>

        <section className="lab-content-column">
          <nav className="lab-sticky-nav">
            <div className="sticky-nav-inner">
              <ul className="sticky-nav-list">
                <div className="sticky-nav-group chapters-group">
                  {chapters.map((c, i) => {
                    const isActive = c.slug === slug;
                    const color = getChapterColor(c.slug);
                    const textColor = isActive ? getContrastColor(color) : '#444';
                    return <li key={c.id} className={`sticky-nav-item chapter-item ${isActive ? 'active' : ''}`}><Link to={`/interactive/${c.slug}`} style={isActive ? { backgroundColor: color, color: textColor, borderColor: color } : {}} onClick={() => isSoundEnabled && playClick()}>CH {i}</Link></li>;
                  })}
                </div>
                <div className="sticky-nav-divider"></div>
                <div className="sticky-nav-group sections-group">
                  {headings.map((h, i) => {
                    const id = h.toLowerCase().replace(/\s+/g, '-');
                    return <li key={i} className={`sticky-nav-item section-item ${activeSection === id ? 'active' : ''}`}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); if (isSoundEnabled) playClick(); }}>{h}</a></li>;
                  })}
                </div>
              </ul>
            </div>
          </nav>
          <div className="lab-reader-surface">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="lab-loading"><Loader2 className="spinner" size={48} /><p>Loading module data...</p></div>
              ) : (
                <motion.div key={slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="lab-markdown-container">
                  <div className="markdown-content-wrap" style={{ position: 'relative' }}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: () => null,
                        h2: ({node, children, ...props}: any) => { const id = children?.toString().toLowerCase().replace(/\s+/g, '-'); return <h2 id={id} className="lab-h2" {...props}>{children}</h2>; },
                        h3: ({node, children, ...props}: any) => { const id = children?.toString().toLowerCase().replace(/\s+/g, '-'); return <h3 id={id} className="lab-h3" {...props}>{children}</h3>; },
                        p: ({node, children, ...props}: any) => <p className="lab-p" {...props}>{renderWithGlossary(children)}</p>,
                        ul: ({node, ...props}) => <ul className="lab-ul" {...props} />,
                        ol: ({node, ...props}) => <ol className="lab-ol" {...props} />,
                        li: ({node, children, ...props}: any) => <li className="lab-li" {...props}>{renderWithGlossary(children)}</li>,
                        blockquote: ({node, ...props}) => <blockquote className="lab-quote" {...props} />,
                        code({node, inline, className, children, ...props}: any) { return ( <code className={`${className} lab-code ${inline ? 'inline' : 'block'}`} {...props}>{children}</code> ) }
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                    <AnimatePresence>
                      {isGated && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lab-content-gate">
                          <div className="gate-inner">
                            <Lock size={48} className="gate-icon" /><h3>Protocol Interaction Required</h3>
                            <p>
                              {slug === 'bitcoin' && "To understand Proof of Work, you must first experience the computational cost. Use the 3D Engine on the left to mine a block."}
                              {slug === 'ethereum' && "Network congestion is high. Adjust your Base Fee and Priority Tip in the Sandbox to successfully submit your transaction and unlock this chapter."}
                              {slug === 'solana' && "The validator network needs synchronization. Increase the Parallel Throughput in the Sandbox to achieve 10,000+ TPS and unlock the ledger."}
                              {slug === 'custody' && "Cryptography begins with randomness. Move your cursor within the terminal on the left to collect enough physical entropy to derive a secure private key."}
                            </p>
                            <div className="gate-hint"><Sparkles size={16} /><span>{slug === 'bitcoin' && "Hint: Hold the 'MINE BLOCK' button until hashing is complete."}{slug === 'ethereum' && "Hint: Increase both sliders until the total gas price reaches 40+ gwei."}{slug === 'solana' && "Hint: Push the throughput slider to the maximum to sync the state."}{slug === 'custody' && "Hint: Move your mouse rapidly inside the visualizer card to generate entropy."}</span></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {nextChapter && (
                    <div className="lab-progression-cta">
                      <div className="cta-content"><h3>Ready to move on?</h3><p>Make sure you've completed the knowledge check before advancing to the next module.</p></div>
                      <button className="cta-advance-btn" onClick={() => { navigate(`/interactive/${nextChapter.slug}`); isSoundEnabled && playClick(); }}>Start Module {currentIndex + 2} <ArrowRight size={20} /></button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
