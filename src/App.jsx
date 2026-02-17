import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  ArrowUpRight,
  X,
  Globe,
  Terminal,
  Zap,
  Code,
  Home,
  Layers,
  Sparkles,
  Cpu,
  ArrowRight,
  User,
  Quote,
  Lightbulb,
  Moon,
  Sun,
  Palette,
  Music,
  Cpu as CpuIcon
} from 'lucide-react';

// --- Theme Context ---
const themes = {
  default: {
    name: 'Default',
    bg: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    accentBorder: 'border-blue-600',
    accentLight: 'bg-blue-50',
    accentDark: 'bg-blue-700',
    border: 'border-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    navBg: 'rgba(255, 255, 255, 0.98)',
    navBgScrolled: 'rgba(255, 255, 255, 0.98)',
    font: 'font-sans',
    fontMono: 'font-mono',
    gradient: 'from-slate-900 to-blue-900',
    heroBlob: 'bg-blue-600/10',
    heroBlobTop: 'bg-blue-500/20',
    cursorColor: '#2563eb',
  },
  dark: {
    name: 'Dark Mode',
    bg: 'bg-slate-950',
    text: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    accent: 'text-purple-400',
    accentBg: 'bg-purple-600',
    accentBorder: 'border-purple-600',
    accentLight: 'bg-purple-900/20',
    accentDark: 'bg-purple-800',
    border: 'border-slate-800',
    cardBg: 'bg-slate-900',
    cardBorder: 'border-slate-800',
    navBg: 'rgba(15, 23, 42, 0.98)',
    navBgScrolled: 'rgba(15, 23, 42, 0.98)',
    font: 'font-sans',
    fontMono: 'font-mono',
    gradient: 'from-slate-800 to-purple-900',
    heroBlob: 'bg-purple-600/20',
    heroBlobTop: 'bg-purple-500/30',
    cursorColor: '#a78bfa',
  },
  neon: {
    name: 'Neon Tech',
    bg: 'bg-black',
    text: 'text-cyan-300',
    textSecondary: 'text-green-400',
    textMuted: 'text-purple-500',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    accentBorder: 'border-cyan-500',
    accentLight: 'bg-cyan-900/30',
    accentDark: 'bg-cyan-600',
    border: 'border-green-500/30',
    cardBg: 'bg-gray-900/50',
    cardBorder: 'border-cyan-500/30',
    navBg: 'rgba(0, 0, 0, 0.95)',
    navBgScrolled: 'rgba(0, 0, 0, 0.98)',
    font: 'font-mono',
    fontMono: 'font-mono',
    gradient: 'from-cyan-900 to-purple-900',
    heroBlob: 'bg-cyan-500/20',
    heroBlobTop: 'bg-green-500/20',
    cursorColor: '#00ffff',
  },
  kpop: {
    name: 'K-Pop',
    bg: 'bg-pink-50',
    text: 'text-purple-900',
    textSecondary: 'text-pink-700',
    textMuted: 'text-pink-400',
    accent: 'text-pink-500',
    accentBg: 'bg-pink-500',
    accentBorder: 'border-pink-500',
    accentLight: 'bg-pink-100',
    accentDark: 'bg-pink-600',
    border: 'border-pink-200',
    cardBg: 'bg-white/80',
    cardBorder: 'border-pink-200',
    navBg: 'rgba(253, 242, 248, 0.98)',
    navBgScrolled: 'rgba(253, 242, 248, 0.98)',
    font: 'font-sans',
    fontMono: 'font-mono',
    gradient: 'from-pink-400 to-purple-400',
    heroBlob: 'bg-pink-300/30',
    heroBlobTop: 'bg-purple-300/30',
    cursorColor: '#ff69b4',
  }
};

const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default');
  const [showThemeSelector, setShowThemeSelector] = useState(true);

  return (
    <ThemeContext.Provider value={{ theme: themes[theme], setTheme, showThemeSelector, setShowThemeSelector }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// --- Loading Screen with Theme Selector ---
const LoadingScreen = ({ onComplete }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    setTheme(themeName);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const themeOptions = [
    { name: 'default', icon: <Sun size={24} />, label: 'Default', color: 'bg-blue-600' },
    { name: 'dark', icon: <Moon size={24} />, label: 'Dark Mode', color: 'bg-purple-600' },
    { name: 'neon', icon: <CpuIcon size={24} />, label: 'Neon Tech', color: 'bg-cyan-500' },
    { name: 'kpop', icon: <Music size={24} />, label: 'K-Pop', color: 'bg-pink-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full mb-8 mx-auto"
            />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">ELLEN STUDIO</h1>
            <p className="text-slate-500 font-mono text-sm">Initializing system...</p>
          </motion.div>
        ) : (
          <motion.div
            key="selector"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full mx-auto px-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Choose Your Theme</h2>
            <p className="text-center text-slate-500 mb-12 font-mono text-sm">Select the experience that suits you best</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themeOptions.map((option) => (
                <motion.button
                  key={option.name}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeSelect(option.name)}
                  className={`relative overflow-hidden rounded-xl p-6 border-2 transition-all ${
                    selectedTheme === option.name 
                      ? `${option.color} border-white text-white` 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`text-3xl mb-3 ${selectedTheme === option.name ? 'text-white' : option.color.replace('bg-', 'text-')}`}>
                    {option.icon}
                  </div>
                  <p className={`text-sm font-bold ${selectedTheme === option.name ? 'text-white' : 'text-slate-900'}`}>
                    {option.label}
                  </p>
                  <p className={`text-[8px] uppercase tracking-wider mt-1 ${selectedTheme === option.name ? 'text-white/70' : 'text-slate-400'}`}>
                    Theme
                  </p>
                  
                  {selectedTheme === option.name && (
                    <motion.div
                      layoutId="selectedTheme"
                      className="absolute inset-0 bg-white/10 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <p className="text-center text-slate-400 text-xs mt-8 font-mono">
              Don't worry, you can change it later in the Admin panel
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Custom Hooks ---
const useMousePosition = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
};

// --- Components ---
const MagneticButton = ({ children, onClick, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {children}
    </motion.button>
  );
};

const AboutModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[200] ${theme.bg} overflow-y-auto`}
        >
          <div className="min-h-screen w-full relative">
            <button 
              onClick={onClose}
              className={`fixed top-8 right-8 z-30 w-10 h-10 rounded-none ${theme.cardBg} ${theme.border} border flex items-center justify-center hover:${theme.accentBg} hover:text-white transition-all shadow-sm`}
            >
              <X size={18} />
            </button>

            <div className="w-full max-w-7xl mx-auto px-8 md:px-10 py-28 md:py-36">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-auto">
                {/* Photo */}
                <div className="md:col-span-1 md:row-span-2 bg-slate-900 overflow-hidden group h-[350px] md:h-[500px] relative border border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    alt="Ellen"
                  />
                  <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-slate-900 to-transparent w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Ellen.sys</h2>
                    <p className={`${theme.accent} text-[9px] uppercase tracking-widest font-mono`}>v6.0.0 // ENGINEERING</p>
                  </div>
                </div>

                {/* Manifesto */}
                <div className={`md:col-span-2 ${theme.cardBg} border-2 ${theme.cardBorder} p-8 md:p-10 flex flex-col justify-center min-h-[220px]`}>
                  <span className={`text-[9px] font-mono uppercase tracking-[0.3em] ${theme.accent} mb-4`}>Manifesto</span>
                  <p className={`text-base md:text-lg font-medium tracking-wide leading-relaxed ${theme.textSecondary}`}>
                    Developing high-performance digital ecosystems through algorithmic precision. 
                    Specializing in crafting experiences that harmonize complex architectural logic 
                    with minimalist, high-fidelity aesthetics. Optimized in Tamil Nadu for global scale.
                  </p>
                </div>

                {/* Location */}
                <div className={`${theme.accentLight} border-2 border-${theme.accentBorder} p-8 md:p-10 flex flex-col items-start justify-center min-h-[180px]`}>
                  <Globe size={24} className={theme.accent} />
                  <span className={`text-[8px] uppercase tracking-[0.2em] ${theme.textMuted} mb-1.5 font-bold`}>Node Location</span>
                  <span className={`font-mono text-lg md:text-xl ${theme.text}`}>11.01°N, 76.95°E</span>
                </div>

                {/* Build Version */}
                <div className={`${theme.accentBg} border-2 border-${theme.accentBorder} p-8 md:p-10 flex flex-col justify-between min-h-[180px]`}>
                  <Zap className="text-white/90" size={28} />
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-tighter">6.0.0</div>
                    <div className="text-[8px] uppercase tracking-[0.2em] text-white/70 font-bold">Build Version (Years)</div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className={`md:col-span-2 ${theme.cardBg} border-2 ${theme.cardBorder} p-8 md:p-10 overflow-hidden min-h-[180px]`}>
                  <div className="flex items-center gap-2 mb-6">
                    <Terminal size={18} className={theme.accent} />
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${theme.textMuted}`}>Daily Stack</span>
                  </div>
                  <div className="overflow-hidden relative">
                    <div className="flex gap-3 animate-scroll whitespace-nowrap">
                      {['React', 'TypeScript', 'Web3', 'Rust', 'Docker', 'AWS', 'TensorFlow', 'Python', 'Go', 'Swift'].map(s => (
                        <span key={s} className={`inline-block px-4 py-2 ${theme.accentBg} text-white text-[9px] font-mono tracking-tighter whitespace-nowrap border ${theme.accentBorder}`}>{s}</span>
                      ))}
                      {['React', 'TypeScript', 'Web3', 'Rust', 'Docker', 'AWS', 'TensorFlow', 'Python', 'Go', 'Swift'].map(s => (
                        <span key={`${s}-2`} className={`inline-block px-4 py-2 ${theme.accentBg} text-white text-[9px] font-mono tracking-tighter whitespace-nowrap border ${theme.accentBorder}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Code Philosophy */}
                <div className={`${theme.accentLight} border-2 ${theme.cardBorder} p-8 md:p-10 flex flex-col justify-between min-h-[180px]`}>
                  <Code size={24} className={theme.textMuted} />
                  <p className={`text-[10px] md:text-xs font-mono ${theme.textSecondary} leading-relaxed uppercase tracking-wider`}>// code is poetry<br/>optimized for performance</p>
                </div>

                {/* System Status */}
                <div className={`md:col-span-3 bg-gradient-to-r ${theme.gradient} border-2 ${theme.cardBorder} p-5 md:p-6 flex items-center justify-between`}>
                  <span className={`${theme.accent} font-mono text-sm md:text-base flex items-center gap-3`}>
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                    System active. Seeking collaborative protocols.
                  </span>
                  <MagneticButton 
                    onClick={onClose}
                    className={`px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition-all border border-white/20 hover:border-white/40`}
                  >
                    Initiate Connection
                  </MagneticButton>
                </div>
              </div>
            </div>

            <style jsx>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll {
                animation: scroll 25s linear infinite;
                width: fit-content;
              }
              .animate-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InspirationsModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  
  const figures = [
    {
      name: "Isaac Newton",
      legacy: "Laws of Motion, Gravity, Differential and Integral Calculus.",
      achievement: "Achieved his primary breakthroughs before turning 26.",
      color: theme.accentBg
    },
    {
      name: "Steve Jobs",
      legacy: "Apple, Transformative Marketing, and Mindmastery.",
      achievement: "Revolutionized personal computing and design aesthetics.",
      color: "bg-slate-900"
    },
    {
      name: "Guido Van Rossum",
      legacy: "Benevolent Dictator for Life of the Python Language.",
      achievement: "Prioritized code readability and programmer productivity.",
      color: theme.accentBg
    },
    {
      name: "Ada Lovelace",
      legacy: "The First Computer Algorithm for the Analytical Engine.",
      achievement: "Envisioned computers as more than just calculating machines.",
      color: "bg-slate-800"
    },
    {
      name: "Mark Zuckerberg",
      legacy: "Facebook, Connectivity, and Young Entrepreneurship.",
      achievement: "Redefined social interaction and scaled systems globally.",
      color: theme.accentBg
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[200] flex items-start justify-center ${theme.bg} overflow-hidden`}
        >
          <div className="w-full h-full relative overflow-y-auto px-6 py-24 md:py-16 scrollbar-hide">
            <div className="max-w-4xl mx-auto">
              <div className="mb-20 md:mb-32">
                <h2 className={`text-6xl md:text-8xl font-bold tracking-tighter ${theme.text} mb-6`}>ARCHETYPES</h2>
                <p className={`${theme.textMuted} font-mono text-xs uppercase tracking-widest`}>Architects of the modern intellectual landscape.</p>
              </div>

              <div className="space-y-[15vh] md:space-y-[20vh] pb-[30vh]">
                {figures.map((figure, idx) => (
                  <InspirationCard key={figure.name} figure={figure} index={idx} total={figures.length} theme={theme} />
                ))}
              </div>
            </div>

            <div className="fixed top-8 right-8 z-[210]">
              <button 
                onClick={onClose}
                className={`w-12 h-12 rounded-full ${theme.accentBg} text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl`}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InspirationCard = ({ figure, index, total, theme }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8], [0.9, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9], [0.5, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div 
      ref={container}
      style={{ 
        scale, 
        opacity,
        y,
        position: 'sticky',
        top: '10vh',
      }}
      className={`w-full min-h-[400px] md:min-h-[500px] ${figure.color} rounded-2xl p-8 md:p-16 flex flex-col justify-between text-white shadow-2xl overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10">
        <Lightbulb size={200} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-8 h-[1px] bg-white/40" />
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Sequence_0{index + 1}</span>
        </div>
        <h3 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">{figure.name}</h3>
        <p className="text-lg md:text-2xl font-light opacity-80 max-w-xl mb-12 italic leading-tight">
          "{figure.legacy}"
        </p>
      </div>

      <div className="relative z-10 border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-md">
          <span className="text-[8px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Breakthrough_Event</span>
          <p className="text-sm font-mono leading-relaxed">{figure.achievement}</p>
        </div>
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
          <ArrowRight size={20} />
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = ({ onOpenAbout, onOpenInspirations }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  const isExpanded = !isScrolled || isHovered;

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="fixed top-6 md:top-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4 md:px-6">
        <motion.nav 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={false}
          animate={{
            width: isExpanded ? "min(650px, 90vw)" : "160px",
            paddingLeft: isExpanded ? "24px" : "16px",
            paddingRight: isExpanded ? "24px" : "16px",
            backgroundColor: isScrolled ? theme.navBgScrolled : theme.navBg,
            boxShadow: isScrolled ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.01)",
            borderColor: isScrolled ? theme.accentBorder : theme.border
          }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className={`pointer-events-auto h-11 md:h-12 rounded-sm border backdrop-blur-xl items-center justify-center overflow-hidden hidden md:flex`}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div 
                key="full-nav"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-4 md:gap-8">
                  {['Work', 'Protocol', 'Root'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase() === 'work' ? 'repositories' : item.toLowerCase()}`} 
                       className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold ${theme.textMuted} hover:${theme.accent} transition-colors`}>
                      {item}
                    </a>
                  ))}
                  <button onClick={onOpenInspirations} 
                          className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold ${theme.textMuted} hover:${theme.accent} transition-colors`}>
                    Inspirations
                  </button>
                </div>
                <button onClick={onOpenAbout} 
                        className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold ${theme.text} border-l ${theme.border} pl-4 md:pl-6 hover:${theme.accent} transition-colors`}>
                  About
                </button>
              </motion.div>
            ) : (
              <motion.button 
                key="shrunk-nav"
                onClick={onOpenAbout}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 md:gap-4 whitespace-nowrap"
              >
                <div className={`w-1.5 h-1.5 ${theme.accentBg} shadow-[0_0_15px_${theme.accent}]`} />
                <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold ${theme.text} font-mono`}>SYS.LIVE</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 md:hidden">
        <div className={`flex items-center justify-between w-auto min-w-[200px] px-4 py-2 ${theme.cardBg} backdrop-blur-md border ${theme.border} rounded-sm shadow-sm`}>
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className={`text-sm font-bold ${theme.text} font-mono tracking-tight mr-4`}
          >
            Ellen
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-8 h-8 flex flex-col items-center justify-center gap-1 hover:${theme.accentLight} rounded-sm transition-colors`}
          >
            <span className={`w-4 h-0.5 ${theme.text} transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-4 h-0.5 ${theme.text} transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-4 h-0.5 ${theme.text} transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-[52px] left-1/2 -translate-x-1/2 w-[200px] ${theme.cardBg} border ${theme.border} shadow-lg rounded-sm`}
            >
              <div className="flex flex-col p-2">
                <a href="#repositories" onClick={handleLinkClick}
                   className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold ${theme.textSecondary} hover:${theme.accent} hover:${theme.accentLight} rounded-sm transition-colors text-center`}>
                  Work
                </a>
                <a href="#protocol" onClick={handleLinkClick}
                   className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold ${theme.textSecondary} hover:${theme.accent} hover:${theme.accentLight} rounded-sm transition-colors text-center`}>
                  Protocol
                </a>
                <a href="#root" onClick={handleLinkClick}
                   className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold ${theme.textSecondary} hover:${theme.accent} hover:${theme.accentLight} rounded-sm transition-colors text-center`}>
                  Root
                </a>
                <button onClick={() => { onOpenInspirations(); handleLinkClick(); }}
                        className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold ${theme.textSecondary} hover:${theme.accent} hover:${theme.accentLight} rounded-sm transition-colors text-center`}>
                  Inspirations
                </button>
                <div className={`border-t ${theme.border} my-1`}></div>
                <button onClick={() => { onOpenAbout(); handleLinkClick(); }}
                        className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold ${theme.textSecondary} hover:${theme.accent} hover:${theme.accentLight} rounded-sm transition-colors text-center`}>
                  About
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 z-[90] md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { mouseX, mouseY } = useMousePosition();
  const spotlightX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const { theme } = useTheme();

  return (
    <section className={`relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden ${theme.bg} text-center px-6 pt-0 md:pt-20`}>
      {/* Top blue blur blob - mobile only */}
      <div className={`absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[200px] ${theme.heroBlobTop} rounded-full blur-[60px] z-0 md:hidden`} />
      
      {/* Subtle blur blob - always visible */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[900px] h-[300px] md:h-[900px] ${theme.heroBlob} rounded-full blur-[80px] md:blur-[160px] z-0`} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(${theme.accent} 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} />

      {/* Mouse-following blobs - desktop only */}
      <motion.div 
        style={{ left: spotlightX, top: spotlightY, transform: 'translate(-50%, -50%)' }}
        className={`pointer-events-none absolute w-[500px] md:w-[900px] h-[500px] md:h-[900px] ${theme.heroBlob} rounded-full blur-[120px] md:blur-[160px] z-0 hidden md:block`}
      />
      <motion.div 
        style={{ left: spotlightX, top: spotlightY, transform: 'translate(-50%, -50%)' }}
        className={`pointer-events-none absolute w-[200px] md:w-[400px] h-[200px] md:h-[400px] ${theme.heroBlobTop} rounded-full blur-[60px] md:blur-[100px] z-0 hidden md:block`}
      />

      <div className="relative z-10 max-w-7xl mt-[-5vh] md:mt-0">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="mb-6 md:mb-14"
        >
          <span className={`px-4 md:px-8 py-2 md:py-3 ${theme.accentBg} text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-white font-bold font-mono`}>
            &lt; DEV_PORTFOLIO /&gt; V2.6
          </span>
        </motion.div>

        <h1 className={`text-[14vw] md:text-[11vw] font-bold leading-[0.8] tracking-tighter mb-4 md:mb-14 ${theme.text}`}>
          <div className="overflow-hidden py-1">
            <motion.span 
              initial={{ y: "110%" }} 
              animate={{ y: 0 }} 
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              ARCHITECTING
            </motion.span>
          </div>
          <div className="overflow-hidden py-1">
            <motion.span 
              initial={{ y: "110%" }} 
              animate={{ y: 0 }} 
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`inline-block ${theme.accent} font-mono italic`}
            >
              STABLE_LOGIC
            </motion.span>
          </div>
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className={`${theme.textMuted} text-sm md:text-2xl max-w-2xl mx-auto font-light leading-relaxed font-mono uppercase tracking-tight px-4`}
        >
          Optimizing user interaction through high-performance engineering.
        </motion.p>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 md:bottom-16 flex flex-col items-center gap-4"
      >
        <div className={`w-[1px] h-10 md:h-16 ${theme.accent}`} />
        <span className={`text-[7px] md:text-[8px] uppercase tracking-[0.5em] ${theme.accent} font-bold`}>Scroll Output</span>
      </motion.div>
    </section>
  );
};

const ProjectItem = ({ project, index }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });
  const { theme } = useTheme();

  const xTitle = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scanLineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      ref={container}
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className={`relative w-full h-[70vh] md:h-[90vh] mb-[8vh] md:mb-[15vh] overflow-hidden group border-2 ${theme.cardBorder} ${theme.cardBg} shadow-2xl hover:${theme.accentBorder} transition-colors duration-500`}
    >
      <div className={`absolute inset-2 border ${theme.border} pointer-events-none group-hover:${theme.accentBorder} transition-colors duration-500`} />
      
      <motion.div 
        style={{ top: scanLineY }}
        className={`absolute left-0 right-0 h-[1px] ${theme.accent}/20 z-40 pointer-events-none`}
      />

      <div className="absolute top-0 left-0 p-6 md:p-8 z-30">
          <span className={`text-[8px] md:text-[10px] font-mono ${theme.accent}/40 tracking-widest`}>00{index + 1}_NODE</span>
      </div>

      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ x: xTitle }}
          className="opacity-[0.03] select-none whitespace-nowrap"
        >
          <span className={`${theme.text} font-bold text-[35vw] md:text-[40vw] uppercase font-mono leading-none`}>
            {project.title}
          </span>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-8 md:p-24 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-4 md:mb-8">
            {project.tags.map(t => (
               <span key={t} className={`px-2 py-0.5 ${theme.accentBg} text-[8px] uppercase tracking-widest text-white font-mono`}>{t}</span>
            ))}
          </div>
          <h3 className={`text-5xl md:text-[9rem] font-bold ${theme.text} mb-4 md:mb-6 tracking-tighter leading-none group-hover:${theme.accent} transition-colors`}>
            {project.title}
          </h3>
          <p className={`${theme.textMuted} text-sm md:text-xl leading-relaxed font-light max-w-lg font-mono uppercase tracking-tighter`}>
            {project.description}
          </p>
        </div>
        
        <div className="flex flex-col items-start md:items-center gap-2">
          <span className={`text-[7px] uppercase tracking-[0.4em] ${theme.accent} font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden md:block`}>Execute_Launch</span>
          <MagneticButton className={`w-16 h-16 md:w-24 md:h-24 ${theme.accentBg} text-white hover:bg-slate-900 transition-all shadow-xl group/btn`}>
            <ArrowUpRight size={28} className="group-hover/btn:scale-125 transition-transform" />
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
};

const PhilosophySection = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const xText = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const { theme } = useTheme();

  return (
    <section ref={container} id="protocol" className={`py-24 md:py-52 ${theme.accentBg} overflow-hidden relative border-y ${theme.border}`}>
      <motion.div style={{ x: xText }} className="flex whitespace-nowrap mb-16 md:mb-24 opacity-10 pointer-events-none">
        <h2 className={`text-[20vw] md:text-[15vw] font-mono uppercase tracking-tighter leading-none text-white`}>
          PERFORMANT &middot; SECURE &middot; ATOMIC &middot; 
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <div className={`w-12 md:w-16 h-[2px] bg-white mb-8 md:mb-12`} />
            <h3 className={`text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold text-white/60 mb-6 md:mb-10`}>Core Protocols</h3>
            <p className={`text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1] mb-8`}>
              Reliability is <br className="hidden md:block" /> the highest form <br className="hidden md:block" /> of <span className={`${theme.accent} italic font-mono`}>interface</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className={`p-6 md:p-10 ${theme.cardBg} border ${theme.border} flex flex-col gap-6 md:gap-10 aspect-square justify-between group`}>
              <Layers className={theme.text} size={24} />
              <span className={`text-[8px] md:text-[10px] font-mono ${theme.textMuted} uppercase`}>Architecture</span>
            </div>
            <div className={`p-6 md:p-10 bg-white/10 border ${theme.border} flex flex-col gap-6 md:gap-10 aspect-square justify-between`}>
              <Sparkles className="text-white" size={24} />
              <span className={`text-[8px] md:text-[10px] font-mono text-white/60 uppercase`}>Heuristics</span>
            </div>
            <div className={`p-6 md:p-10 ${theme.cardBg} border ${theme.border} flex flex-col gap-6 md:gap-10 aspect-square justify-between`}>
              <Cpu className={theme.text} size={24} />
              <span className={`text-[8px] md:text-[10px] font-mono ${theme.textMuted} uppercase`}>Compute</span>
            </div>
            <div className={`p-6 md:p-10 bg-white border ${theme.border} flex flex-col gap-6 md:gap-10 aspect-square justify-between`}>
              <Code className={theme.text} size={24} />
              <span className={`text-[8px] md:text-[10px] font-mono ${theme.textMuted} uppercase`}>Syntax</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenInspirations, onOpenAbout }) => {
  const [time, setTime] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTime(new Intl.DateTimeFormat('en-GB', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`relative ${theme.bg} pt-24 md:pt-52 pb-10 md:pb-20 px-6 md:px-10 overflow-hidden border-t ${theme.border}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="md:col-span-2">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tighter mb-6 md:mb-10 ${theme.text}`}>ELLEN_STUDIO<span className={`${theme.accent} font-mono`}>.BIN</span></h2>
          <p className={`${theme.textMuted} max-w-sm text-sm md:text-lg leading-relaxed font-mono uppercase tracking-tighter`}>Developing the future of digital interaction through code-first methodologies.</p>
        </div>
        
        {['Directories', 'Nodes'].map((category, idx) => (
          <div key={category}>
            <h3 className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] ${theme.textMuted} mb-6 md:mb-12 font-bold font-mono`}>{category}</h3>
            <ul className="flex flex-col gap-3 md:gap-5 text-[10px] md:text-xs font-bold">
              {(idx === 0 
                ? ['Work', 'History', 'Inspirations', 'About'] 
                : ['GitHub', 'NPM', 'LinkedIn']
              ).map(i => (
                <li key={i}>
                  {i === 'Inspirations' ? (
                    <button onClick={onOpenInspirations} className={`${theme.textSecondary} hover:${theme.accent} transition-colors uppercase tracking-widest font-mono text-left`}>{i}</button>
                  ) : i === 'About' ? (
                    <button onClick={onOpenAbout} className={`${theme.textSecondary} hover:${theme.accent} transition-colors uppercase tracking-widest font-mono text-left`}>{i}</button>
                  ) : (
                    <a href="#" className={`${theme.textSecondary} hover:${theme.accent} transition-colors uppercase tracking-widest font-mono`}>{i}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-24 md:mt-40 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className={`signature text-5xl md:text-6xl ${theme.text} mb-2`}>Ellen</div>
          <div className={`flex gap-6 md:gap-10 text-[8px] uppercase tracking-[0.4em] font-mono ${theme.textMuted}`}>
            <span>&copy; 2026_STUDIO</span>
            <span>NODE: TN_IN</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex flex-col items-end">
             <span className={`text-[7px] md:text-[8px] uppercase tracking-[0.4em] ${theme.accent} font-bold mb-1 font-mono`}>Local_Time</span>
             <span className={`text-xs md:text-sm font-mono font-bold ${theme.text} tracking-widest`}>{time}</span>
          </div>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                  className={`w-12 h-12 md:w-16 md:h-16 border ${theme.border} flex items-center justify-center hover:${theme.accentBg} hover:text-white ${theme.cardBg} transition-all group`}>
            <ArrowUpRight size={20} className="-rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
};

const CursorFollower = () => {
  const { mouseX, mouseY } = useMousePosition();
  const springX = useSpring(mouseX, { stiffness: 1000, damping: 60 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 60 });
  const { theme } = useTheme();

  return (
    <motion.div 
      style={{ left: springX, top: springY }}
      className="cursor-follow"
      style={{ 
        left: springX, 
        top: springY,
        backgroundColor: theme.cursorColor,
        boxShadow: `0 0 15px ${theme.cursorColor}`
      }}
    />
  );
};

const App = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isInspirationsOpen, setIsInspirationsOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const { theme } = useTheme();
  
  const projects = [
    { title: "NEURAL", tags: ["Python", "C++"], description: "Optimized inference engine for low-latency neural processing on the edge." },
    { title: "QUBIT", tags: ["Go", "React"], description: "Visual debugger for quantum circuit execution and state monitoring." },
    { title: "SHARD", tags: ["Rust", "Wasm"], description: "Distributed file storage protocol with sub-millisecond propagation." },
    { title: "KINETIC", tags: ["Swift", "ThreeJS"], description: "Motion-sensitive architectural visualization using volumetric rendering." },
  ];

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <ThemeProvider>
      <div className={`min-h-screen ${theme.bg} ${theme.text} selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden ${theme.font}`}>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=JetBrains+Mono:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
        
        <AnimatePresence mode="wait">
          {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
        </AnimatePresence>

        {!showLoading && (
          <>
            <Navbar onOpenAbout={() => setIsAboutOpen(true)} onOpenInspirations={() => setIsInspirationsOpen(true)} />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <InspirationsModal isOpen={isInspirationsOpen} onClose={() => setIsInspirationsOpen(false)} />
            
            <Hero />

            <section id="repositories" className={`px-6 md:px-24 max-w-[1600px] mx-auto py-20 md:py-40`}>
              <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 border-b ${theme.border} pb-12 gap-8`}>
                <div>
                  <h2 className={`text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold ${theme.accent} mb-4 md:mb-6 font-mono`}>Stack // 2026</h2>
                  <p className={`text-3xl md:text-4xl font-bold tracking-tighter ${theme.text}`}>Verified Deployments</p>
                </div>
                <span className={`text-[8px] md:text-[10px] ${theme.textMuted} uppercase tracking-[0.4em] font-bold font-mono`}>Status: Online</span>
              </div>
              
              <div className="space-y-[6vh] md:space-y-[10vh]">
                {projects.map((p, i) => (
                  <ProjectItem key={p.title} project={p} index={i} />
                ))}
              </div>
            </section>

            <PhilosophySection />

            <section id="root" className={`min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden ${theme.bg} pt-20`}>
              <div className="text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 md:mb-12 mt-20 md:mt-24"
                >
                  <span className={`px-6 md:px-10 py-3 md:py-4 ${theme.accentBg} text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-white font-bold font-mono shadow-sm`}>Connection: Listening</span>
                </motion.div>
                
                <h2 className={`text-6xl md:text-[12vw] font-bold tracking-tighter mb-16 md:mb-24 leading-[0.8] ${theme.text} uppercase`}>
                  Execute <br className="hidden md:block" /> <span className={`${theme.accent} italic font-mono`}>Command.</span>
                </h2>
                
                <div className="pb-20 md:pb-0">
                  <MagneticButton className={`px-12 md:px-20 py-6 md:py-10 ${theme.accentBg} text-white font-bold rounded-sm text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-slate-900 transition-all shadow-2xl`}>
                     Initiate Thread <ArrowRight size={18} className="ml-3 md:ml-4 inline" />
                  </MagneticButton>
                </div>
              </div>
            </section>

            <Footer 
              onOpenInspirations={() => setIsInspirationsOpen(true)} 
              onOpenAbout={() => setIsAboutOpen(true)} 
            />
          </>
        )}

        <style>{`
          * { 
            cursor: none; 
            scroll-behavior: smooth; 
          }
          @media (max-width: 1024px) {
            * { cursor: auto !important; }
            .cursor-follow { display: none !important; }
          }
          body { 
            background: ${theme.bg}; 
            font-family: 'Space Grotesk', sans-serif; 
            overflow-x: hidden; 
          }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          .signature { font-family: 'Great Vibes', cursive; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          
          .cursor-follow {
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${theme.cursorColor};
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 15px ${theme.cursorColor};
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }
          
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-track { background: ${theme.bg}; }
          ::-webkit-scrollbar-thumb { background: ${theme.cursorColor}; }
        `}</style>
        
        <CursorFollower />
      </div>
    </ThemeProvider>
  );
};

export default App;
