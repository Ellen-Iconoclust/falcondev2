import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
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
  Github,
  Linkedin,
  Twitter,
  Volume2,
  VolumeX,
  Command,
  Search,
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react';

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

// Enhanced cursor with trail effect
const useCursorTrail = (count = 8) => {
  const [trail, setTrail] = useState([]);
  const { mouseX, mouseY } = useMousePosition();
  
  useEffect(() => {
    const updateTrail = () => {
      setTrail(prev => {
        const newTrail = [{ x: mouseX.get(), y: mouseY.get() }, ...prev];
        return newTrail.slice(0, count);
      });
    };
    
    const interval = setInterval(updateTrail, 50);
    return () => clearInterval(interval);
  }, [mouseX, mouseY, count]);
  
  return trail;
};

// Typewriter Hook with enhanced features
const useTypewriter = (words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentWord = words[wordIndex];
      
      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
      
      if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
      
      const nextText = isDeleting 
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);
      
      setText(nextText);
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [text, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

// Parallax scroll hook
const useParallax = (value, distance) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

// --- Advanced Components ---

const MagneticButton = ({ children, onClick, className = "", strength = 0.3 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
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

// Command Palette Component
const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { name: 'Home', icon: Home, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'Projects', icon: Layers, action: () => document.getElementById('repositories')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'About', icon: User, action: () => setIsAboutOpen(true) },
    { name: 'Inspirations', icon: Lightbulb, action: () => setIsInspirationsOpen(true) },
    { name: 'GitHub', icon: Github, action: () => window.open('https://github.com', '_blank') },
    { name: 'LinkedIn', icon: Linkedin, action: () => window.open('https://linkedin.com', '_blank') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000]"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[500px] max-w-[90vw] bg-white border-2 border-slate-200 shadow-2xl z-[1001] overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Command size={18} className="text-blue-600" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 outline-none text-sm bg-transparent"
              />
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono">ESC to close</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <motion.button
                    key={cmd.name}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                      index === selectedIndex ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{cmd.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Enhanced About Modal with Parallax and Scroll Effects
const AboutModal = ({ isOpen, onClose }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const imageParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textParallax = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-white overflow-y-auto"
        >
          {/* Progress Bar */}
          <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-30 origin-left"
            style={{ scaleX: scrollYProgress }}
          />

          <div className="min-h-screen w-full relative">
            <button 
              onClick={onClose}
              className="fixed top-8 right-8 z-30 w-10 h-10 rounded-none bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
            >
              <X size={18} />
            </button>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-8 md:px-10 py-28 md:py-36">
              {/* Grid Layout with Parallax */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-auto">
                {/* Photo with Parallax */}
                <motion.div 
                  style={{ y: imageParallax }}
                  className="md:col-span-1 md:row-span-2 bg-slate-900 overflow-hidden group h-[350px] md:h-[500px] relative border border-slate-800"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-110"
                    alt="Ellen"
                  />
                  <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-slate-900 to-transparent w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Ellen.sys</h2>
                    <p className="text-blue-400 text-[9px] uppercase tracking-widest font-mono">v6.0.0 // ENGINEERING</p>
                  </div>
                </motion.div>

                {/* Manifesto with Text Reveal */}
                <motion.div 
                  style={{ y: textParallax }}
                  className="md:col-span-2 bg-white border-2 border-slate-200 p-8 md:p-10 flex flex-col justify-center min-h-[220px] relative overflow-hidden group"
                >
                  <motion.div 
                    className="absolute inset-0 bg-blue-600 origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 0 }}
                    viewport={{ once: true }}
                  />
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-blue-600 mb-4">Manifesto</span>
                  <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-slate-700">
                    Developing high-performance digital ecosystems through algorithmic precision. 
                    Specializing in crafting experiences that harmonize complex architectural logic 
                    with minimalist, high-fidelity aesthetics. Optimized in Tamil Nadu for global scale.
                  </p>
                </motion.div>

                {/* Location with Magnetic Effect */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-blue-50 border-2 border-blue-200 p-8 md:p-10 flex flex-col items-start justify-center min-h-[180px]"
                >
                  <Globe size={24} className="text-blue-600 mb-4" />
                  <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500 mb-1.5 font-bold">Node Location</span>
                  <span className="font-mono text-lg md:text-xl text-slate-900">11.01°N, 76.95°E</span>
                </motion.div>

                {/* Build Version with Pulse */}
                <motion.div 
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(37, 99, 235, 0.4)', '0 0 0 10px rgba(37, 99, 235, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-blue-600 border-2 border-blue-700 p-8 md:p-10 flex flex-col justify-between min-h-[180px]"
                >
                  <Zap className="text-white/90" size={28} />
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-tighter">6.0.0</div>
                    <div className="text-[8px] uppercase tracking-[0.2em] text-white/70 font-bold">Build Version (Years)</div>
                  </div>
                </motion.div>

                {/* Tech Stack with Enhanced Animation */}
                <div className="md:col-span-2 bg-white border-2 border-slate-200 p-8 md:p-10 overflow-hidden min-h-[180px]">
                  <div className="flex items-center gap-2 mb-6">
                    <Terminal size={18} className="text-blue-600" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Daily Stack</span>
                  </div>
                  <div className="overflow-hidden relative">
                    <motion.div 
                      className="flex gap-3 whitespace-nowrap"
                      animate={{ x: [0, -1000] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <React.Fragment key={i}>
                          {['React', 'TypeScript', 'Web3', 'Rust', 'Docker', 'AWS', 'TensorFlow', 'Python', 'Go', 'Swift'].map(s => (
                            <span key={`${s}-${i}`} className="inline-block px-4 py-2 bg-slate-900 text-white text-[9px] font-mono tracking-tighter whitespace-nowrap border border-slate-700">{s}</span>
                          ))}
                        </React.Fragment>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Code Philosophy with SVG Path Animation */}
                <div className="bg-slate-50 border-2 border-slate-200 p-8 md:p-10 flex flex-col justify-between min-h-[180px] group">
                  <Code size={24} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[10px] md:text-xs font-mono text-slate-600 leading-relaxed uppercase tracking-wider"
                  >
                    // code is poetry<br/>optimized for performance
                  </motion.p>
                </div>

                {/* System Status with Live Stats */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="md:col-span-3 bg-gradient-to-r from-slate-900 to-blue-900 border-2 border-slate-700 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <span className="text-blue-400 font-mono text-sm md:text-base flex items-center gap-3">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                    System active. Seeking collaborative protocols.
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-[8px] text-blue-300/60 font-mono">API: 200 OK</span>
                    <span className="text-[8px] text-blue-300/60 font-mono">LATENCY: 23ms</span>
                    <MagneticButton 
                      onClick={onClose}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition-all border border-white/20 hover:border-white/40"
                    >
                      Initiate Connection
                    </MagneticButton>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Inspirations Modal with Stacking Scroll and Parallax
const InspirationsModal = ({ isOpen, onClose }) => {
  const figures = [
    {
      name: "Isaac Newton",
      legacy: "Laws of Motion, Gravity, Differential and Integral Calculus.",
      achievement: "Achieved his primary breakthroughs before turning 26.",
      color: "bg-blue-600",
      quote: "If I have seen further, it is by standing on the shoulders of giants.",
      year: "1687"
    },
    {
      name: "Steve Jobs",
      legacy: "Apple, Transformative Marketing, and Mindmastery.",
      achievement: "Revolutionized personal computing and design aesthetics.",
      color: "bg-slate-900",
      quote: "Stay hungry, stay foolish.",
      year: "2007"
    },
    {
      name: "Guido Van Rossum",
      legacy: "Benevolent Dictator for Life of the Python Language.",
      achievement: "Prioritized code readability and programmer productivity.",
      color: "bg-blue-500",
      quote: "Python is an experiment in how much freedom developers need.",
      year: "1991"
    },
    {
      name: "Ada Lovelace",
      legacy: "The First Computer Algorithm for the Analytical Engine.",
      achievement: "Envisioned computers as more than just calculating machines.",
      color: "bg-slate-800",
      quote: "The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.",
      year: "1843"
    },
    {
      name: "Mark Zuckerberg",
      legacy: "Facebook, Connectivity, and Young Entrepreneurship.",
      achievement: "Redefined social interaction and scaled systems globally.",
      color: "bg-blue-700",
      quote: "The biggest risk is not taking any risk.",
      year: "2004"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-white overflow-hidden"
        >
          <div className="w-full h-full relative overflow-y-auto px-6 py-24 md:py-16 scrollbar-hide">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-20 md:mb-32"
              >
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-6">ARCHETYPES</h2>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Architects of the modern intellectual landscape.</p>
              </motion.div>

              <div className="space-y-[15vh] md:space-y-[20vh] pb-[30vh]">
                {figures.map((figure, idx) => (
                  <InspirationCard key={figure.name} figure={figure} index={idx} total={figures.length} />
                ))}
              </div>
            </div>

            <div className="fixed top-8 right-8 z-[210]">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl"
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InspirationCard = ({ figure, index, total }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  return (
    <motion.div 
      ref={container}
      style={{ 
        scale, 
        opacity,
        y,
        rotate,
        position: 'sticky',
        top: '10vh',
      }}
      className={`w-full min-h-[400px] md:min-h-[500px] ${figure.color} rounded-2xl p-8 md:p-16 flex flex-col justify-between text-white shadow-2xl overflow-hidden`}
    >
      {/* Animated background pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ 
          backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-8 h-[1px] bg-white/40" />
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Sequence_0{index + 1}</span>
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 ml-auto">{figure.year}</span>
        </div>
        
        <motion.h3 
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-bold tracking-tighter mb-6"
        >
          {figure.name}
        </motion.h3>
        
        <motion.p 
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-2xl font-light opacity-80 max-w-xl mb-12 italic leading-tight"
        >
          "{figure.legacy}"
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="border-l-2 border-white/30 pl-6"
        >
          <p className="text-sm md:text-base font-mono opacity-60 mb-2">Quote</p>
          <p className="text-base md:text-lg italic">"{figure.quote}"</p>
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-md">
          <span className="text-[8px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Breakthrough_Event</span>
          <p className="text-sm font-mono leading-relaxed">{figure.achievement}</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 45 }}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={20} />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced Navbar with Glassmorphism + Noise
const Navbar = ({ onOpenAbout, onOpenInspirations, onOpenCommandPalette }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  const isExpanded = !isScrolled || isHovered;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar with Glassmorphism + Noise */}
      <div className="fixed top-6 md:top-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4 md:px-6">
        <motion.nav 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={false}
          animate={{
            width: isExpanded ? "min(750px, 90vw)" : "180px",
            paddingLeft: isExpanded ? "24px" : "16px",
            paddingRight: isExpanded ? "24px" : "16px",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className="pointer-events-auto h-11 md:h-12 rounded-sm border backdrop-blur-xl items-center justify-center overflow-hidden hidden md:flex relative"
          style={{
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(248, 250, 252, 0.85)",
            boxShadow: isScrolled ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.01)",
            borderColor: isScrolled ? "rgba(37, 99, 235, 0.4)" : "rgba(15, 23, 42, 0.2)"
          }}
        >
          {/* Film grain/noise overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '100px 100px'
            }}
          />

          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div 
                key="full-nav"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="flex items-center justify-between w-full relative z-10"
              >
                <div className="flex items-center gap-4 md:gap-8">
                  {['Work', 'Protocol', 'Root'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase() === 'work' ? 'repositories' : item.toLowerCase()}`} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold text-slate-500 hover:text-blue-600 transition-colors">{item}</a>
                  ))}
                  <button onClick={onOpenInspirations} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold text-slate-500 hover:text-blue-600 transition-colors">Inspirations</button>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={onOpenCommandPalette}
                    className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Command size={12} />
                    <span>⌘K</span>
                  </button>
                  <button onClick={onOpenAbout} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold text-slate-900 border-l border-slate-200 pl-4 md:pl-6 hover:text-blue-600 transition-colors">About</button>
                </div>
              </motion.div>
            ) : (
              <motion.button 
                key="shrunk-nav"
                onClick={onOpenAbout}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 md:gap-4 whitespace-nowrap relative z-10"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-blue-600 shadow-[0_0_15px_#2563eb]" 
                />
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-slate-900 font-mono">SYS.LIVE</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 md:hidden">
        <div className="flex items-center justify-between w-auto min-w-[200px] px-4 py-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-sm shadow-sm">
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="text-sm font-bold text-slate-900 font-mono tracking-tight mr-4"
          >
            Ellen
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 rounded-sm transition-colors"
          >
            <span className={`w-4 h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-4 h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-4 h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[52px] left-1/2 -translate-x-1/2 w-[200px] bg-white border border-slate-200 shadow-lg rounded-sm"
            >
              <div className="flex flex-col p-2">
                <a 
                  href="#repositories" 
                  onClick={handleLinkClick}
                  className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-sm transition-colors text-center"
                >
                  Work
                </a>
                <a 
                  href="#protocol" 
                  onClick={handleLinkClick}
                  className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-sm transition-colors text-center"
                >
                  Protocol
                </a>
                <a 
                  href="#root" 
                  onClick={handleLinkClick}
                  className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-sm transition-colors text-center"
                >
                  Root
                </a>
                <button 
                  onClick={() => {
                    onOpenInspirations();
                    handleLinkClick();
                  }}
                  className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-sm transition-colors text-center"
                >
                  Inspirations
                </button>
                <button 
                  onClick={() => {
                    onOpenCommandPalette();
                    handleLinkClick();
                  }}
                  className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-sm transition-colors text-center flex items-center justify-center gap-1"
                >
                  <Command size={10} />
                  <span>Commands</span>
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button 
                  onClick={() => {
                    onOpenAbout();
                    handleLinkClick();
                  }}
                  className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-sm transition-colors text-center"
                >
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

// Enhanced Hero with Typewriter and Spotlight
const Hero = ({ onOpenAbout }) => {
  const { mouseX, mouseY } = useMousePosition();
  const spotlightX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  const words = ["STABLE_LOGIC", "ZERO_LATENCY", "QUANTUM_CODING", "NEURAL_LINK", "EDGE_COMPUTE", "CLOUD_NATIVE", "DEEP_LEARN"];
  const typewriterText = useTypewriter(words, 120, 60, 2000);

  // Scroll progress for text masking
  const { scrollYProgress } = useScroll();
  const textMask = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-white text-center px-6 pt-0 md:pt-20">
      {/* Top blue blur blob */}
      <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/20 rounded-full blur-[60px] z-0 md:hidden" />
      
      {/* Subtle blue blur blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[900px] h-[300px] md:h-[900px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[160px] z-0" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Mouse-following blobs */}
      <motion.div 
        style={{ left: spotlightX, top: spotlightY, transform: 'translate(-50%, -50%)' }}
        className="pointer-events-none absolute w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-blue-600/20 rounded-full blur-[120px] md:blur-[160px] z-0 hidden md:block"
      />
      <motion.div 
        style={{ left: spotlightX, top: spotlightY, transform: 'translate(-50%, -50%)' }}
        className="pointer-events-none absolute w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-blue-400/30 rounded-full blur-[60px] md:blur-[100px] z-0 hidden md:block"
      />

      <div className="relative z-10 max-w-7xl mt-[-5vh] md:mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-6 md:mb-14"
        >
          <span className="px-4 md:px-8 py-2 md:py-3 bg-slate-900 text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-blue-400 font-bold font-mono">
            &lt; DEV_PORTFOLIO /&gt; V2.6
          </span>
        </motion.div>

        <h1 className="text-[14vw] md:text-[11vw] font-bold leading-[0.8] tracking-tighter mb-4 md:mb-14 text-slate-900">
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
          <div className="overflow-hidden py-1 h-[1.2em]">
            <motion.span 
              initial={{ y: "110%" }} 
              animate={{ y: 0 }} 
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-blue-600 font-mono italic relative"
            >
              {/* Text masking effect */}
              <motion.span 
                className="absolute inset-0 bg-blue-600 origin-left"
                style={{ scaleX: textMask }}
              />
              {typewriterText}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-[2px] h-[0.8em] bg-blue-600 ml-1 align-middle"
              />
            </motion.span>
          </div>
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-slate-400 text-sm md:text-2xl max-w-2xl mx-auto font-light leading-relaxed font-mono uppercase tracking-tight px-4"
        >
          Optimizing user interaction through high-performance engineering.
        </motion.p>

        {/* Quick command hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex items-center justify-center gap-2 text-[8px] md:text-[10px] text-slate-400 font-mono"
        >
          <Command size={12} />
          <span>Press ⌘K for commands</span>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 md:bottom-16 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-10 md:h-16 bg-blue-100" />
        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-blue-600 font-bold">Scroll Output</span>
      </motion.div>
    </section>
  );
};

// Enhanced Project Item with Parallax and Skew Effects
const ProjectItem = ({ project, index }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const xTitle = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const skewY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 3, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const scanLineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      ref={container}
      style={{ skewY, y, scale }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-[70vh] md:h-[90vh] mb-[8vh] md:mb-[15vh] overflow-hidden group border-2 border-slate-200 bg-white shadow-2xl shadow-blue-900/10 hover:border-blue-500 transition-colors duration-500"
    >
      {/* Visual Outline Overlay */}
      <div className="absolute inset-2 border border-slate-100 pointer-events-none group-hover:border-blue-100 transition-colors duration-500" />
      
      <motion.div 
        style={{ top: scanLineY }}
        className="absolute left-0 right-0 h-[1px] bg-blue-500/20 z-40 pointer-events-none"
      />

      <div className="absolute top-0 left-0 p-6 md:p-8 z-30">
        <span className="text-[8px] md:text-[10px] font-mono text-blue-600/40 tracking-widest">00{index + 1}_NODE</span>
      </div>

      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ x: xTitle }}
          className="opacity-[0.03] select-none whitespace-nowrap"
        >
          <span className="text-slate-900 font-bold text-[35vw] md:text-[40vw] uppercase font-mono leading-none">
            {project.title}
          </span>
        </motion.div>
      </div>

      {/* Live stats overlay */}
      <div className="absolute top-6 right-6 z-30 flex gap-2">
        <span className="px-2 py-1 bg-blue-600/10 text-blue-600 text-[8px] font-mono rounded">LIVE</span>
        <span className="px-2 py-1 bg-slate-900/5 text-slate-600 text-[8px] font-mono">v2.0.1</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-8 md:p-24 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-4 md:mb-8">
            {project.tags.map(t => (
              <motion.span 
                key={t} 
                whileHover={{ scale: 1.1, backgroundColor: '#2563eb', color: 'white' }}
                className="px-2 py-0.5 bg-slate-900 text-[8px] uppercase tracking-widest text-white font-mono cursor-default transition-colors"
              >
                {t}
              </motion.span>
            ))}
          </div>
          <h3 className="text-5xl md:text-[9rem] font-bold text-slate-900 mb-4 md:mb-6 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-500 text-sm md:text-xl leading-relaxed font-light max-w-lg font-mono uppercase tracking-tighter">
            {project.description}
          </p>
        </div>
        
        <div className="flex flex-col items-start md:items-center gap-2">
          <span className="text-[7px] uppercase tracking-[0.4em] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">Execute_Launch</span>
          <MagneticButton className="w-16 h-16 md:w-24 md:h-24 bg-blue-600 text-white hover:bg-slate-900 transition-all shadow-xl group/btn">
            <ArrowUpRight size={28} className="group-hover/btn:scale-125 transition-transform" />
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
};

// Philosophy Section with Enhanced Effects
const PhilosophySection = ({ onOpenAbout }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const xText = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <section ref={container} id="protocol" className="py-24 md:py-52 bg-slate-900 overflow-hidden relative border-y border-white/5">
      <motion.div style={{ x: xText, opacity }} className="flex whitespace-nowrap mb-16 md:mb-24 opacity-10 pointer-events-none">
        <h2 className="text-[20vw] md:text-[15vw] font-mono uppercase tracking-tighter leading-none text-blue-500">
          PERFORMANT &middot; SECURE &middot; ATOMIC &middot; 
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-12 md:w-16 h-[2px] bg-blue-600 mb-8 md:mb-12" />
            <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold text-blue-500 mb-6 md:mb-10">Core Protocols</h3>
            <p className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1] mb-8">
              Reliability is <br className="hidden md:block" /> the highest form <br className="hidden md:block" /> of <span className="text-blue-600 italic font-mono">interface</span>.
            </p>
            <motion.button
              onClick={onOpenAbout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-all rounded-sm"
            >
              More About Me
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { icon: Layers, label: 'Architecture', color: 'bg-slate-800' },
              { icon: Sparkles, label: 'Heuristics', color: 'bg-blue-600' },
              { icon: Cpu, label: 'Compute', color: 'bg-slate-900' },
              { icon: Code, label: 'Syntax', color: 'bg-white' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className={`p-6 md:p-10 ${item.color} border border-white/5 flex flex-col gap-6 md:gap-10 aspect-square justify-between group`}
                >
                  <Icon className={item.color === 'bg-white' ? 'text-slate-900' : 'text-blue-500'} size={24} />
                  <span className={`text-[8px] md:text-[10px] font-mono ${item.color === 'bg-white' ? 'text-slate-400' : 'text-slate-500'} uppercase`}>{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Footer with Live Stats
const Footer = ({ onOpenInspirations, onOpenAbout }) => {
  const [time, setTime] = useState("");
  const [githubStats, setGithubStats] = useState({ stars: 0, repos: 0 });

  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTime(new Intl.DateTimeFormat('en-GB', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated GitHub stats (replace with actual API call)
  useEffect(() => {
    setGithubStats({ stars: 128, repos: 24 });
  }, []);

  return (
    <footer className="relative bg-white pt-24 md:pt-52 pb-10 md:pb-20 px-6 md:px-10 overflow-hidden border-t border-slate-200">
      {/* Live stats ticker */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 text-white text-[8px] font-mono flex items-center overflow-hidden">
        <div className="animate-scroll whitespace-nowrap flex gap-8 px-4">
          <span>✦ SYSTEM UPTIME: 99.97%</span>
          <span>✦ ACTIVE USERS: 1,234</span>
          <span>✦ GITHUB STARS: {githubStats.stars}</span>
          <span>✦ REPOSITORIES: {githubStats.repos}</span>
          <span>✦ API RESPONSE: 23ms</span>
          <span>✦ BUILD VERSION: 6.0.0</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24 mt-8">
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6 md:mb-10 text-slate-900">ELLEN_STUDIO<span className="text-blue-600 font-mono">.BIN</span></h2>
          <p className="text-slate-500 max-w-sm text-sm md:text-lg leading-relaxed font-mono uppercase tracking-tighter">Developing the future of digital interaction through code-first methodologies.</p>
          
          {/* Social links with magnetic effect */}
          <div className="flex gap-3 mt-8">
            {[Github, Linkedin, Twitter].map((Icon, i) => (
              <MagneticButton key={i} strength={0.2} className="w-10 h-10 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                <Icon size={16} />
              </MagneticButton>
            ))}
          </div>
        </div>
        
        {['Directories', 'Nodes'].map((category, idx) => (
          <div key={category}>
            <h3 className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-slate-500 mb-6 md:mb-12 font-bold font-mono">{category}</h3>
            <ul className="flex flex-col gap-3 md:gap-5 text-[10px] md:text-xs font-bold">
              {(idx === 0 
                ? ['Work', 'History', 'Inspirations', 'About'] 
                : ['GitHub', 'NPM', 'LinkedIn']
              ).map(i => (
                <li key={i}>
                  {i === 'Inspirations' ? (
                    <button onClick={onOpenInspirations} className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono text-left">{i}</button>
                  ) : i === 'About' ? (
                    <button onClick={onOpenAbout} className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono text-left">{i}</button>
                  ) : (
                    <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">{i}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-24 md:mt-40 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="signature text-5xl md:text-6xl text-slate-900 mb-2">Ellen</div>
          <div className="flex gap-6 md:gap-10 text-[8px] uppercase tracking-[0.4em] font-mono text-slate-500">
            <span>&copy; 2026_STUDIO</span>
            <span>NODE: TN_IN</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-blue-600 font-bold mb-1 font-mono">Local_Time</span>
            <span className="text-xs md:text-sm font-mono font-bold text-slate-700 tracking-widest">{time}</span>
          </div>
          <motion.button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
            whileHover={{ scale: 1.1, rotate: -45 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 md:w-16 md:h-16 border border-slate-300 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 bg-slate-50 transition-all group"
          >
            <ArrowUpRight size={20} className="-rotate-45" />
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isInspirationsOpen, setIsInspirationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Tab title effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "👋 Don't forget to say hi! - Ellen.sys";
      } else {
        document.title = "Ellen.sys - Architecting Digital Futures";
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const projects = [
    { title: "NEURAL", tags: ["Python", "C++"], description: "Optimized inference engine for low-latency neural processing on the edge." },
    { title: "QUBIT", tags: ["Go", "React"], description: "Visual debugger for quantum circuit execution and state monitoring." },
    { title: "SHARD", tags: ["Rust", "Wasm"], description: "Distributed file storage protocol with sub-millisecond propagation." },
    { title: "KINETIC", tags: ["Swift", "ThreeJS"], description: "Motion-sensitive architectural visualization using volumetric rendering." },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=JetBrains+Mono:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      
      <Navbar 
        onOpenAbout={() => setIsAboutOpen(true)} 
        onOpenInspirations={() => setIsInspirationsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />
      
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <InspirationsModal isOpen={isInspirationsOpen} onClose={() => setIsInspirationsOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      
      <Hero onOpenAbout={() => setIsAboutOpen(true)} />

      <section id="repositories" className="px-6 md:px-24 max-w-[1600px] mx-auto py-20 md:py-40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 border-b border-slate-100 pb-12 gap-8">
          <div>
            <h2 className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold text-blue-600 mb-4 md:mb-6 font-mono">Stack // 2026</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tighter">Verified Deployments</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[8px] md:text-[10px] text-slate-300 uppercase tracking-[0.4em] font-bold font-mono">Status: Online</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-[6vh] md:space-y-[10vh]">
          {projects.map((p, i) => (
            <ProjectItem key={p.title} project={p} index={i} />
          ))}
        </div>
      </section>

      <PhilosophySection onOpenAbout={() => setIsAboutOpen(true)} />

      <section id="root" className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-white pt-20">
        <div className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 md:mb-12 mt-20 md:mt-24"
          >
            <span className="px-6 md:px-10 py-3 md:py-4 bg-slate-900 text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-blue-400 font-bold font-mono shadow-sm">Connection: Listening</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-[12vw] font-bold tracking-tighter mb-16 md:mb-24 leading-[0.8] text-slate-900 uppercase">
            Execute <br className="hidden md:block" /> <span className="text-blue-600 italic font-mono">Command.</span>
          </h2>
          
          <div className="pb-20 md:pb-0">
            <MagneticButton className="px-12 md:px-20 py-6 md:py-10 bg-blue-600 text-white font-bold rounded-sm text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-slate-900 transition-all shadow-2xl group">
              Initiate Thread 
              <ArrowRight size={18} className="ml-3 md:ml-4 inline group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 opacity-10 hidden md:block"
        >
          <Code size={60} className="text-blue-600" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 opacity-10 hidden md:block"
        >
          <Terminal size={60} className="text-blue-600" />
        </motion.div>
      </section>

      <Footer 
        onOpenInspirations={() => setIsInspirationsOpen(true)} 
        onOpenAbout={() => setIsAboutOpen(true)} 
      />

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
          background: #ffffff; 
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
          background: #2563eb;
          pointer-events: none;
          z-index: 9999;
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.6);
          border-radius: 50%;
          transition: width 0.2s, height 0.2s;
        }
        
        .cursor-follow.hovering {
          width: 40px;
          height: 40px;
          background: rgba(37, 99, 235, 0.2);
          border: 1px solid #2563eb;
        }
        
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #ffffff; }
        ::-webkit-scrollbar-thumb { background: #2563eb; }
      `}</style>
      
      <EnhancedCursor />
    </div>
  );
};

// Enhanced Cursor with Trail and Hover Effects
const EnhancedCursor = () => {
  const { mouseX, mouseY } = useMousePosition();
  const springX = useSpring(mouseX, { stiffness: 1000, damping: 60 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 60 });
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const trail = useCursorTrail(5);

  useEffect(() => {
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, [data-hoverable]');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  return (
    <>
      {/* Trail dots */}
      {trail.map((point, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 bg-blue-400/30 rounded-full pointer-events-none z-[9998]"
          style={{
            left: point.x,
            top: point.y,
            opacity: 1 - (i / trail.length) * 0.7,
          }}
        />
      ))}
      
      {/* Main cursor */}
      <motion.div 
        ref={cursorRef}
        style={{ left: springX, top: springY }}
        className={`cursor-follow ${isHovering ? 'hovering' : ''}`}
      />
    </>
  );
};

export default App;
