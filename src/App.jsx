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
  Lightbulb
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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-white overflow-y-auto"
        >
          <div className="min-h-screen w-full relative">
            {/* Only X button - no Back to Home */}
            <button 
              onClick={onClose}
              className="fixed top-8 right-8 z-30 w-10 h-10 rounded-none bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
            >
              <X size={18} />
            </button>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-8 md:px-10 py-28 md:py-36">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-auto">
                {/* div1: Photo - spans 1 column, 2 rows on desktop */}
                <div className="md:col-span-1 md:row-span-2 bg-slate-900 overflow-hidden group h-[350px] md:h-[500px] relative border border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    alt="Ellen"
                  />
                  <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-slate-900 to-transparent w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Ellen.sys</h2>
                    <p className="text-blue-400 text-[9px] uppercase tracking-widest font-mono">v6.0.0 // ENGINEERING</p>
                  </div>
                </div>

                {/* div2: Manifesto - spans 2 columns */}
                <div className="md:col-span-2 bg-white border-2 border-slate-200 p-8 md:p-10 flex flex-col justify-center min-h-[220px]">
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-blue-600 mb-4">Manifesto</span>
                  <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed text-slate-700">
                    Developing high-performance digital ecosystems through algorithmic precision. 
                    Specializing in crafting experiences that harmonize complex architectural logic 
                    with minimalist, high-fidelity aesthetics. Optimized in Tamil Nadu for global scale.
                  </p>
                </div>

                {/* div3: Location */}
                <div className="bg-blue-50 border-2 border-blue-200 p-8 md:p-10 flex flex-col items-start justify-center min-h-[180px]">
                  <Globe size={24} className="text-blue-600 mb-4" />
                  <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500 mb-1.5 font-bold">Node Location</span>
                  <span className="font-mono text-lg md:text-xl text-slate-900">11.01°N, 76.95°E</span>
                </div>

                {/* div4: Build Version */}
                <div className="bg-blue-600 border-2 border-blue-700 p-8 md:p-10 flex flex-col justify-between min-h-[180px]">
                  <Zap className="text-white/90" size={28} />
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-tighter">6.0.0</div>
                    <div className="text-[8px] uppercase tracking-[0.2em] text-white/70 font-bold">Build Version (Years)</div>
                  </div>
                </div>

                {/* div5: Tech Stack/Tools Carousel */}
                <div className="md:col-span-2 bg-white border-2 border-slate-200 p-8 md:p-10 overflow-hidden min-h-[180px]">
                  <div className="flex items-center gap-2 mb-6">
                    <Terminal size={18} className="text-blue-600" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Daily Stack</span>
                  </div>
                  <div className="overflow-hidden relative">
                    <div className="flex gap-3 animate-scroll whitespace-nowrap">
                      {/* First set */}
                      {['React', 'TypeScript', 'Web3', 'Rust', 'Docker', 'AWS', 'TensorFlow', 'Python', 'Go', 'Swift'].map(s => (
                        <span key={s} className="inline-block px-4 py-2 bg-slate-900 text-white text-[9px] font-mono tracking-tighter whitespace-nowrap border border-slate-700">{s}</span>
                      ))}
                      {/* Duplicate for seamless loop */}
                      {['React', 'TypeScript', 'Web3', 'Rust', 'Docker', 'AWS', 'TensorFlow', 'Python', 'Go', 'Swift'].map(s => (
                        <span key={`${s}-2`} className="inline-block px-4 py-2 bg-slate-900 text-white text-[9px] font-mono tracking-tighter whitespace-nowrap border border-slate-700">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* div6: Code Philosophy */}
                <div className="bg-slate-50 border-2 border-slate-200 p-8 md:p-10 flex flex-col justify-between min-h-[180px]">
                  <Code size={24} className="text-slate-500" />
                  <p className="text-[10px] md:text-xs font-mono text-slate-600 leading-relaxed uppercase tracking-wider">// code is poetry<br/>optimized for performance</p>
                </div>

                {/* div7: System Status - spans full width */}
                <div className="md:col-span-3 bg-gradient-to-r from-slate-900 to-blue-900 border-2 border-slate-700 p-5 md:p-6 flex items-center justify-between">
                  <span className="text-blue-400 font-mono text-sm md:text-base flex items-center gap-3">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                    System active. Seeking collaborative protocols.
                  </span>
                  <MagneticButton 
                    onClick={onClose}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-none text-[9px] uppercase tracking-[0.2em] font-bold transition-all border border-white/20 hover:border-white/40"
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
// --- Modal 2: Inspirations (Stacking Scroll) ---
// --- Modal 2: Inspirations (Stacking Scroll) ---
const InspirationsModal = ({ isOpen, onClose }) => {
  const figures = [
    {
      name: "Isaac Newton",
      legacy: "Laws of Motion, Gravity, Differential and Integral Calculus.",
      achievement: "Achieved his primary breakthroughs before turning 26.",
      color: "bg-blue-600"
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
      color: "bg-blue-500"
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
      color: "bg-blue-700"
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
              <div className="mb-20 md:mb-32">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-6">ARCHETYPES</h2>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Architects of the modern intellectual landscape.</p>
              </div>

              <div className="space-y-[15vh] md:space-y-[20vh] pb-[30vh]">
                {figures.map((figure, idx) => (
                  <InspirationCard key={figure.name} figure={figure} index={idx} total={figures.length} />
                ))}
              </div>
            </div>

            {/* Sticky controls */}
            <div className="fixed top-8 right-8 z-[210]">
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
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

const InspirationCard = ({ figure, index, total }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  // Scale: start at 0.9, reach 1, then stay at 1
  const scale = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8], 
    [0.9, 1, 1]
  );

  // Opacity: start at 0.5, become fully visible, stay visible
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.9], 
    [0.5, 1, 1]
  );

  // Y position: slight upward movement
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [50, -50]
  );

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

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  const isExpanded = !isScrolled || isHovered;

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar - with "About" instead of "Admin" */}
      <div className="fixed top-6 md:top-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4 md:px-6">
        <motion.nav 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={false}
          animate={{
            width: isExpanded ? "min(650px, 90vw)" : "160px",
            paddingLeft: isExpanded ? "24px" : "16px",
            paddingRight: isExpanded ? "24px" : "16px",
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(248, 250, 252, 0.85)",
            boxShadow: isScrolled ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.01)",
            borderColor: isScrolled ? "rgba(37, 99, 235, 0.4)" : "rgba(15, 23, 42, 0.2)"
          }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className="pointer-events-auto h-11 md:h-12 rounded-sm border backdrop-blur-xl items-center justify-center overflow-hidden hidden md:flex"
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
                    <a key={item} href={`#${item.toLowerCase() === 'work' ? 'repositories' : item.toLowerCase()}`} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold text-slate-500 hover:text-blue-600 transition-colors">{item}</a>
                  ))}
                  <button onClick={onOpenInspirations} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold text-slate-500 hover:text-blue-600 transition-colors">Inspirations</button>
                </div>
                <button onClick={onOpenAbout} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold text-slate-900 border-l border-slate-200 pl-4 md:pl-6 hover:text-blue-600 transition-colors">About</button>
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
                <div className="w-1.5 h-1.5 bg-blue-600 shadow-[0_0_15px_#2563eb]" />
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-slate-900 font-mono">SYS.LIVE</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Mobile Navbar - Small and centered */}
      <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 md:hidden">
        <div className="flex items-center justify-between w-auto min-w-[200px] px-4 py-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-sm shadow-sm">
          {/* Name */}
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="text-sm font-bold text-slate-900 font-mono tracking-tight mr-4"
          >
            Ellen
          </button>

          {/* Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 rounded-sm transition-colors"
          >
            <span className={`w-4 h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-4 h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-4 h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
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

      {/* Overlay for mobile menu */}
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

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-white text-center px-6 pt-0 md:pt-20">
      {/* Top blue blur blob - mobile only, near navbar */}
      <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/20 rounded-full blur-[60px] z-0 md:hidden" />
      
      {/* Subtle blue blur blob - always visible */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[900px] h-[300px] md:h-[900px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[160px] z-0" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Mouse-following blobs - desktop only */}
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
          <div className="overflow-hidden py-1">
            <motion.span 
              initial={{ y: "110%" }} 
              animate={{ y: 0 }} 
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-blue-600 font-mono italic"
            >
              STABLE_LOGIC
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

const ProjectItem = ({ project, index }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const xTitle = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scanLineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      ref={container}
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
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

      <div className="absolute inset-x-0 bottom-0 p-8 md:p-24 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-4 md:mb-8">
            {project.tags.map(t => (
               <span key={t} className="px-2 py-0.5 bg-slate-900 text-[8px] uppercase tracking-widest text-white font-mono">{t}</span>
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

const PhilosophySection = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const xText = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={container} id="protocol" className="py-24 md:py-52 bg-slate-900 overflow-hidden relative border-y border-white/5">
      <motion.div style={{ x: xText }} className="flex whitespace-nowrap mb-16 md:mb-24 opacity-10 pointer-events-none">
        <h2 className="text-[20vw] md:text-[15vw] font-mono uppercase tracking-tighter leading-none text-blue-500">
          PERFORMANT &middot; SECURE &middot; ATOMIC &middot; 
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <div className="w-12 md:w-16 h-[2px] bg-blue-600 mb-8 md:mb-12" />
            <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold text-blue-500 mb-6 md:mb-10">Core Protocols</h3>
            <p className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1] mb-8">
              Reliability is <br className="hidden md:block" /> the highest form <br className="hidden md:block" /> of <span className="text-blue-600 italic font-mono">interface</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-6 md:p-10 bg-slate-800 border border-white/5 flex flex-col gap-6 md:gap-10 aspect-square justify-between group">
              <Layers className="text-blue-500" size={24} />
              <span className="text-[8px] md:text-[10px] font-mono text-slate-500 uppercase">Architecture</span>
            </div>
            <div className="p-6 md:p-10 bg-blue-600 flex flex-col gap-6 md:gap-10 aspect-square justify-between">
              <Sparkles className="text-white" size={24} />
              <span className="text-[8px] md:text-[10px] font-mono text-white/60 uppercase">Heuristics</span>
            </div>
            <div className="p-6 md:p-10 bg-slate-900 border border-white/10 flex flex-col gap-6 md:gap-10 aspect-square justify-between">
              <Cpu className="text-blue-500" size={24} />
              <span className="text-[8px] md:text-[10px] font-mono text-slate-500 uppercase">Compute</span>
            </div>
            <div className="p-6 md:p-10 bg-white flex flex-col gap-6 md:gap-10 aspect-square justify-between">
              <Code className="text-slate-900" size={24} />
              <span className="text-[8px] md:text-[10px] font-mono text-slate-400 uppercase">Syntax</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenInspirations }) => {
  const [time, setTime] = useState("");

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
    <footer className="relative bg-white pt-24 md:pt-52 pb-10 md:pb-20 px-6 md:px-10 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6 md:mb-10 text-slate-900">ELLEN_STUDIO<span className="text-blue-600 font-mono">.BIN</span></h2>
          <p className="text-slate-500 max-w-sm text-sm md:text-lg leading-relaxed font-mono uppercase tracking-tighter">Developing the future of digital interaction through code-first methodologies.</p>
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
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-12 h-12 md:w-16 md:h-16 border border-slate-300 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 bg-slate-50 transition-all group">
            <ArrowUpRight size={20} className="-rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isInspirationsOpen, setIsInspirationsOpen] = useState(false);
  
  const projects = [
    { title: "NEURAL", tags: ["Python", "C++"], description: "Optimized inference engine for low-latency neural processing on the edge." },
    { title: "QUBIT", tags: ["Go", "React"], description: "Visual debugger for quantum circuit execution and state monitoring." },
    { title: "SHARD", tags: ["Rust", "Wasm"], description: "Distributed file storage protocol with sub-millisecond propagation." },
    { title: "KINETIC", tags: ["Swift", "ThreeJS"], description: "Motion-sensitive architectural visualization using volumetric rendering." },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=JetBrains+Mono:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      
      <Navbar onOpenAbout={() => setIsAboutOpen(true)} onOpenInspirations={() => setIsInspirationsOpen(true)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <InspirationsModal isOpen={isInspirationsOpen} onClose={() => setIsInspirationsOpen(false)} />
      
      <Hero />

      <section id="repositories" className="px-6 md:px-24 max-w-[1600px] mx-auto py-20 md:py-40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 border-b border-slate-100 pb-12 gap-8">
          <div>
            <h2 className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold text-blue-600 mb-4 md:mb-6 font-mono">Stack // 2026</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tighter">Verified Deployments</p>
          </div>
          <span className="text-[8px] md:text-[10px] text-slate-300 uppercase tracking-[0.4em] font-bold font-mono">Status: Online</span>
        </div>
        
        <div className="space-y-[6vh] md:space-y-[10vh]">
          {projects.map((p, i) => (
            <ProjectItem key={p.title} project={p} index={i} />
          ))}
        </div>
      </section>

      <PhilosophySection />

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
            <MagneticButton className="px-12 md:px-20 py-6 md:py-10 bg-blue-600 text-white font-bold rounded-sm text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-slate-900 transition-all shadow-2xl">
               Initiate Thread <ArrowRight size={18} className="ml-3 md:ml-4 inline" />
            </MagneticButton>
          </div>
        </div>
      </section>

      <Footer onOpenInspirations={() => setIsInspirationsOpen(true)} />

      <style>{`
        * { cursor: none; scroll-behavior: smooth; }
        @media (max-width: 1024px) {
          * { cursor: auto !important; }
          .cursor-follow { display: none !important; }
        }
        body { background: #ffffff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
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
        }
        
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #ffffff; }
        ::-webkit-scrollbar-thumb { background: #2563eb; }
      `}</style>
      
      <CursorFollower />
    </div>
  );
};

const CursorFollower = () => {
  const { mouseX, mouseY } = useMousePosition();
  const springX = useSpring(mouseX, { stiffness: 1000, damping: 60 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 60 });

  return (
    <motion.div 
      style={{ left: springX, top: springY }}
      className="cursor-follow"
    />
  );
}

export default App;
