import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  ArrowUpRight,
  X,
  Globe,
  Terminal,
  Zap,
  Code,
  Layers,
  Sparkles,
  Cpu,
  ArrowRight,
  Lightbulb,
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  Coffee,
  Rocket
} from 'lucide-react';

// --- Theme Context ---
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
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

// --- Animated Text Sequence ---
const useTextSequence = (texts, delay = 2000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 500);
    }, delay);

    return () => clearInterval(interval);
  }, [texts, delay]);

  return { text: texts[currentIndex], isVisible };
};

// --- Letter Animation Component ---
const AnimatedLetters = ({ text, className = "", delay = 0.03 }) => {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay }
    }
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    hidden: {
      opacity: 0,
      y: 20
    }
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// --- Loading Screen Component ---
const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING');
  const [showWelcome, setShowWelcome] = useState(false);
  const { isDark } = useTheme();
  
  useEffect(() => {
    const statuses = [
      'INITIALIZING',
      'COMPILING_ASSETS',
      'RENDERING_COMPONENTS',
      'ESTABLISHING_CONNECTION',
      'LOADING_PROTOCOLS',
      'READY'
    ];
    
    let currentStatus = 0;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowWelcome(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 1500);
          return 100;
        }
        
        if (prev % 20 === 0 && prev < 100) {
          currentStatus = Math.min(currentStatus + 1, statuses.length - 1);
          setStatus(statuses[currentStatus]);
        }
        
        return prev + 1;
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(${isDark ? '#60a5fa' : '#2563eb'} 0.5px, transparent 0.5px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />
      
      <div className="relative z-10 w-full max-w-2xl px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className={`text-[10px] font-mono uppercase tracking-[0.4em] ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          } font-bold mb-4 block`}>
            BOOT SEQUENCE
          </span>
          <h1 className={`text-7xl md:text-8xl font-bold tracking-tighter ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            ELLEN<span className={`font-mono italic ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>.sys</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ scaleX: 0.9, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <span className={`text-[9px] font-mono uppercase tracking-widest ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>{status}</span>
            <span className={`text-[9px] font-mono font-bold ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>{progress}%</span>
          </div>
          <div className={`h-[2px] w-full relative overflow-hidden ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <motion.div 
              className={`absolute top-0 left-0 h-full ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
        
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <span className={`text-sm font-mono flex items-center justify-center gap-3 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                WELCOME TO THE SYSTEM
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-center gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className={`w-1.5 h-1.5 rounded-none ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Particle Effect Component ---
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const { mouseX, mouseY } = useMousePosition();
  const particles = useRef([]);
  const animationFrame = useRef();
  const mousePos = useRef({ x: 0, y: 0 });
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const createParticles = () => {
      const particleCount = Math.min(40, Math.floor(window.innerWidth / 40));
      particles.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.2 + 0.05,
        });
      }
    };
    
    createParticles();
    
    const unsubscribeMouseX = mouseX.onChange(value => {
      mousePos.current.x = value;
    });
    const unsubscribeMouseY = mouseY.onChange(value => {
      mousePos.current.y = value;
    });
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particleColor = isDark ? '#60a5fa' : '#2563eb';
      
      particles.current.forEach(p => {
        if (mousePos.current.x && mousePos.current.y) {
          const dx = mousePos.current.x - p.x;
          const dy = mousePos.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) / 150 * 0.3;
            p.x -= Math.cos(angle) * force;
            p.y -= Math.sin(angle) * force;
          }
        }
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      
      ctx.strokeStyle = particleColor;
      ctx.lineWidth = 0.3;
      
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = particleColor;
            ctx.globalAlpha = opacity;
            ctx.stroke();
          }
        }
      }
      
      particles.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      
      animationFrame.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      unsubscribeMouseX();
      unsubscribeMouseY();
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [mouseX, mouseY, isDark]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};

// --- Animated Icon Component ---
const AnimatedIcon = ({ icon: Icon, size = 24, className = "", href }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const Component = href ? 'a' : 'div';
  
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="inline-block cursor-pointer"
    >
      <Component
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
      >
        <Icon 
          size={size} 
          className={`transition-all duration-300 ${
            isHovered ? 'text-blue-600 dark:text-blue-400' : className
          }`}
        />
      </Component>
    </motion.div>
  );
};

// --- Magnetic Button with Animations ---
const MagneticButton = ({ children, onClick, className = "", icon: Icon }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center overflow-hidden group ${className}`}
    >
      {Icon && (
        <motion.div
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="mr-2"
        >
          <Icon size={18} />
        </motion.div>
      )}
      
      {children}
    </motion.button>
  );
};

// --- Theme Toggle Component ---
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-sm transition-colors ${
        isDark ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </motion.div>
    </motion.button>
  );
};

// --- About Modal ---
const AboutModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[200] overflow-y-auto transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      <div className="min-h-screen w-full relative">
        <motion.button 
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className={`fixed top-8 right-8 z-30 w-10 h-10 rounded-none border flex items-center justify-center transition-all shadow-sm ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-white hover:bg-blue-600 hover:border-blue-600' 
              : 'bg-white border-slate-200 text-slate-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'
          }`}
        >
          <X size={18} />
        </motion.button>

        <div className="w-full max-w-7xl mx-auto px-8 md:px-10 py-28 md:py-36">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1 md:row-span-2 bg-slate-900 overflow-hidden group h-[350px] md:h-[500px] relative border border-slate-800"
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <span className="text-white text-2xl font-mono">Photo</span>
              </div>
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-slate-900 to-transparent w-full"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Ellen.sys</h2>
                <p className="text-blue-400 text-[9px] uppercase tracking-widest font-mono">v6.0.0 // ENGINEERING</p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`md:col-span-2 border-2 p-8 md:p-10 flex flex-col justify-center min-h-[220px] ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-blue-600 mb-4">Manifesto</span>
              <p className="text-base md:text-lg font-medium tracking-wide leading-relaxed">
                Developing high-performance digital ecosystems through algorithmic precision. 
                Specializing in crafting experiences that harmonize complex architectural logic 
                with minimalist, high-fidelity aesthetics.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`border-2 p-8 md:p-10 flex flex-col items-start justify-center min-h-[180px] ${
                isDark 
                  ? 'bg-slate-800 border-blue-800' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <Globe size={24} className="text-blue-600 mb-4" />
              <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500 mb-1.5 font-bold">Node Location</span>
              <span className={`font-mono text-lg md:text-xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>11.01°N, 76.95°E</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-blue-600 border-2 border-blue-700 p-8 md:p-10 flex flex-col justify-between min-h-[180px]"
            >
              <Zap className="text-white/90" size={28} />
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white tracking-tighter">6.0.0</div>
                <div className="text-[8px] uppercase tracking-[0.2em] text-white/70 font-bold">Build Version (Years)</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`md:col-span-2 border-2 p-8 md:p-10 overflow-hidden min-h-[180px] ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Terminal size={18} className="text-blue-600" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Daily Stack</span>
              </div>
              <div className="overflow-hidden relative">
                <div className="flex gap-3 whitespace-nowrap animate-scroll">
                  {['React', 'TypeScript', 'Web3', 'Rust', 'Docker', 'AWS', 'TensorFlow', 'Python', 'Go', 'Swift'].map(s => (
                    <span key={s} className={`inline-block px-4 py-2 text-white text-[9px] font-mono tracking-tighter whitespace-nowrap border ${
                      isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-900 border-slate-700'
                    }`}>{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`border-2 p-8 md:p-10 flex flex-col justify-between min-h-[180px] ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Code size={24} className={isDark ? 'text-slate-400' : 'text-slate-700'} />
              <p className={`text-[10px] md:text-xs font-mono leading-relaxed uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-700'
              }`}>// code is poetry<br/>optimized for performance</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="md:col-span-3 bg-gradient-to-r from-slate-900 to-blue-900 border-2 border-slate-700 p-5 md:p-6 flex items-center justify-between"
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Inspirations Modal ---
const InspirationsModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  
  const figures = [
    {
      name: "Isaac Newton",
      legacy: "Laws of Motion, Gravity, Differential and Integral Calculus.",
      achievement: "Achieved his primary breakthroughs before turning 26.",
      color: isDark ? "bg-blue-800" : "bg-blue-600"
    },
    {
      name: "Steve Jobs",
      legacy: "Apple, Transformative Marketing, and Mindmastery.",
      achievement: "Revolutionized personal computing and design aesthetics.",
      color: isDark ? "bg-slate-800" : "bg-slate-900"
    },
    {
      name: "Guido Van Rossum",
      legacy: "Benevolent Dictator for Life of the Python Language.",
      achievement: "Prioritized code readability and programmer productivity.",
      color: isDark ? "bg-blue-700" : "bg-blue-500"
    },
    {
      name: "Ada Lovelace",
      legacy: "The First Computer Algorithm for the Analytical Engine.",
      achievement: "Envisioned computers as more than just calculating machines.",
      color: isDark ? "bg-slate-700" : "bg-slate-800"
    },
    {
      name: "Mark Zuckerberg",
      legacy: "Facebook, Connectivity, and Young Entrepreneurship.",
      achievement: "Redefined social interaction and scaled systems globally.",
      color: isDark ? "bg-blue-800" : "bg-blue-700"
    }
  ];

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[200] flex items-start justify-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      <div className="w-full h-full relative overflow-y-auto px-6 py-24 md:py-16 scrollbar-hide">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-32"
          >
            <h2 className={`text-6xl md:text-8xl font-bold tracking-tighter mb-6 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>ARCHETYPES</h2>
            <p className={`font-mono text-xs uppercase tracking-widest ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>Architects of the modern intellectual landscape.</p>
          </motion.div>

          <div className="space-y-[15vh] md:space-y-[20vh] pb-[30vh]">
            {figures.map((figure, idx) => (
              <InspirationCard key={figure.name} figure={figure} index={idx} />
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed top-8 right-8 z-[210]"
        >
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
          >
            <X size={24} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const InspirationCard = ({ figure, index }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [0.95, 1, 1, 0.95]
  );

  const y = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [30, 0, -30]
  );

  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [0.9, 1, 1, 0.9]
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
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 p-8 md:p-12 opacity-10"
      >
        <Lightbulb size={200} strokeWidth={1} />
      </motion.div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-8 h-[1px] bg-white/40" />
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Sequence_0{index + 1}</span>
        </div>
        <motion.h3 
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-7xl font-bold tracking-tighter mb-6"
        >
          {figure.name}
        </motion.h3>
        <motion.p 
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl font-light opacity-80 max-w-xl mb-12 italic leading-tight"
        >
          "{figure.legacy}"
        </motion.p>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div className="max-w-md">
          <span className="text-[8px] uppercase tracking-widest font-bold opacity-40 mb-2 block">Breakthrough_Event</span>
          <p className="text-sm font-mono leading-relaxed">{figure.achievement}</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 45 }}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"
        >
          <ArrowRight size={20} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- Navbar ---
const Navbar = ({ onOpenAbout, onOpenInspirations }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const isExpanded = !isScrolled || isHovered;

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-6 md:top-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4 md:px-6">
        <motion.nav 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            width: isExpanded ? "min(750px, 90vw)" : "200px",
            paddingLeft: isExpanded ? "24px" : "16px",
            paddingRight: isExpanded ? "24px" : "16px",
            backgroundColor: isScrolled 
              ? (isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)')
              : (isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(248, 250, 252, 0.85)'),
            boxShadow: isScrolled 
              ? (isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.08)')
              : '0 4px 20px rgba(0,0,0,0.01)',
            borderColor: isScrolled 
              ? (isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.4)')
              : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.2)')
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
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase() === 'work' ? 'repositories' : item.toLowerCase()}`}
                      whileHover={{ y: -2 }}
                      className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold transition-colors ${
                        isDark 
                          ? 'text-slate-400 hover:text-blue-400' 
                          : 'text-slate-500 hover:text-blue-600'
                      }`}
                    >
                      {item}
                    </motion.a>
                  ))}
                  <motion.button
                    onClick={onOpenInspirations}
                    whileHover={{ y: -2 }}
                    className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold transition-colors ${
                      isDark 
                        ? 'text-slate-400 hover:text-blue-400' 
                        : 'text-slate-500 hover:text-blue-600'
                    }`}
                  >
                    Inspirations
                  </motion.button>
                </div>
                
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <motion.button
                    onClick={onOpenAbout}
                    whileHover={{ y: -2 }}
                    className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold border-l pl-4 md:pl-6 transition-colors ${
                      isDark 
                        ? 'text-slate-200 border-slate-700 hover:text-blue-400' 
                        : 'text-slate-900 border-slate-200 hover:text-blue-600'
                    }`}
                  >
                    About
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="shrunk-nav"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-4 whitespace-nowrap"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-1.5 h-1.5 ${
                    isDark ? 'bg-blue-400' : 'bg-blue-600'
                  } shadow-lg`}
                />
                <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold font-mono ${
                  isDark ? 'text-slate-200' : 'text-slate-900'
                }`}>SYS.LIVE</span>
                <ThemeToggle />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 md:hidden">
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`flex items-center justify-between w-auto min-w-[200px] px-4 py-2 backdrop-blur-md border rounded-sm shadow-sm ${
            isDark 
              ? 'bg-slate-900/95 border-slate-800' 
              : 'bg-white/95 border-slate-200'
          }`}
        >
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className={`text-sm font-bold font-mono tracking-tight mr-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Ellen
          </motion.button>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className={`w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-sm transition-colors ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className={`w-4 h-0.5 ${isDark ? 'bg-slate-400' : 'bg-slate-600'}`}
              />
              <motion.span 
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`w-4 h-0.5 ${isDark ? 'bg-slate-400' : 'bg-slate-600'}`}
              />
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className={`w-4 h-0.5 ${isDark ? 'bg-slate-400' : 'bg-slate-600'}`}
              />
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-[52px] left-1/2 -translate-x-1/2 w-[200px] border shadow-lg rounded-sm ${
                isDark 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col p-2">
                {['Work', 'Protocol', 'Root', 'Inspirations', 'About'].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 5 }}
                  >
                    {item === 'Inspirations' ? (
                      <button 
                        onClick={() => {
                          onOpenInspirations();
                          handleLinkClick();
                        }}
                        className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold w-full text-center rounded-sm transition-colors ${
                          isDark 
                            ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' 
                            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                      >
                        {item}
                      </button>
                    ) : item === 'About' ? (
                      <button 
                        onClick={() => {
                          onOpenAbout();
                          handleLinkClick();
                        }}
                        className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold w-full text-center rounded-sm transition-colors ${
                          isDark 
                            ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' 
                            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                      >
                        {item}
                      </button>
                    ) : (
                      <a 
                        href={`#${item.toLowerCase() === 'work' ? 'repositories' : item.toLowerCase()}`}
                        onClick={handleLinkClick}
                        className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold w-full block text-center rounded-sm transition-colors ${
                          isDark 
                            ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' 
                            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                      >
                        {item}
                      </a>
                    )}
                  </motion.div>
                ))}
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

// --- Hero Section ---
const Hero = () => {
  const { isDark } = useTheme();
  const [showGreeting, setShowGreeting] = useState(true);
  
  const roles = [
    "Front-End Developer",
    "Backend Engineer",
    "Tech Enthusiast",
    "Open-Source Contributor",
    "Database Engineer",
    "Crazy Fool"
  ];
  
  const { text: currentRole, isVisible } = useTextSequence(roles, 2500);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 px-6 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <ParticleBackground />
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[900px] h-[300px] md:h-[900px] rounded-full blur-[80px] md:blur-[160px] z-0 ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-600/5'
      }`} />
      
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(${isDark ? '#60a5fa' : '#2563eb'} 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} />

      {/* Left Side - Social Icons */}
      <div className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <div className="flex flex-col items-center gap-6">
          <AnimatedIcon icon={Github} size={20} href="https://github.com" className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          <AnimatedIcon icon={Linkedin} size={20} href="https://linkedin.com" className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          <AnimatedIcon icon={Mail} size={20} href="mailto:ellen@example.com" className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          <AnimatedIcon icon={Coffee} size={20} href="#" className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          <div className={`w-[1px] h-16 mt-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        </div>
      </div>

      {/* Right Side - Email */}
      <div className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <div className="flex flex-col items-center gap-4">
          <a 
            href="mailto:ellen@example.com" 
            className={`text-[10px] font-mono tracking-[0.3em] rotate-90 origin-center whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            ellen@example.com
          </a>
          <div className={`w-[1px] h-16 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl text-center">
        <AnimatePresence mode="wait">
          {showGreeting ? (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedLetters 
                text="Hi There !"
                className={`text-5xl md:text-7xl font-bold block ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              />
              <AnimatedLetters 
                text="I'm Ellen"
                className={`text-6xl md:text-8xl font-bold block mt-4 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}
                delay={0.05}
              />
            </motion.div>
          ) : (
            <motion.div
              key="roles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className={`px-4 md:px-8 py-2 md:py-3 text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold font-mono inline-block mb-8 ${
                  isDark 
                    ? 'bg-slate-800 text-blue-400' 
                    : 'bg-slate-900 text-blue-400'
                }`}
              >
                &lt; DEV_PORTFOLIO /&gt; V2.6
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showGreeting && (
            <motion.div
              key="role-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-[150px] md:h-[200px] flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {isVisible && (
                  <motion.div
                    key={currentRole}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatedLetters 
                      text={currentRole}
                      className={`text-3xl md:text-5xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                      delay={0.02}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// --- Project Item ---
const ProjectItem = ({ project, index }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });
  const { isDark } = useTheme();

  const xTitle = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scanLineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={container}
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative w-full h-[70vh] md:h-[90vh] mb-[8vh] md:mb-[15vh] overflow-hidden group border-2 shadow-2xl transition-all duration-500 ${
        isDark 
          ? 'border-slate-800 bg-slate-900 hover:border-blue-500' 
          : 'border-slate-200 bg-white hover:border-blue-500'
      }`}
    >
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0 }}
        className={`absolute inset-2 border pointer-events-none transition-colors duration-500 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}
      />
      
      <motion.div 
        style={{ top: scanLineY }}
        className={`absolute left-0 right-0 h-[1px] z-40 pointer-events-none ${
          isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'
        }`}
      />

      <div className="absolute top-0 left-0 p-6 md:p-8 z-30">
        <span className={`text-[8px] md:text-[10px] font-mono tracking-widest ${
          isDark ? 'text-blue-400/40' : 'text-blue-600/40'
        }`}>00{index + 1}_NODE</span>
      </div>

      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ x: xTitle }}
          className="opacity-[0.03] select-none whitespace-nowrap"
        >
          <span className={`font-bold text-[35vw] md:text-[40vw] uppercase font-mono leading-none ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {project.title}
          </span>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-8 md:p-24 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-4 md:mb-8">
            {project.tags.map(t => (
              <motion.span 
                key={t}
                whileHover={{ y: -2, scale: 1.05 }}
                className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-mono ${
                  isDark 
                    ? 'bg-slate-800 text-blue-400' 
                    : 'bg-slate-900 text-white'
                }`}
              >
                {t}
              </motion.span>
            ))}
          </div>
          <motion.h3 
            animate={{ color: isHovered ? (isDark ? '#60a5fa' : '#2563eb') : (isDark ? '#ffffff' : '#0f172a') }}
            className="text-5xl md:text-[9rem] font-bold mb-4 md:mb-6 tracking-tighter leading-none transition-colors"
          >
            {project.title}
          </motion.h3>
          <p className={`text-sm md:text-xl leading-relaxed font-light max-w-lg font-mono uppercase tracking-tighter ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {project.description}
          </p>
        </div>
        
        <div className="flex flex-col items-start md:items-center gap-2">
          <motion.span 
            animate={{ opacity: isHovered ? 1 : 0 }}
            className={`text-[7px] uppercase tracking-[0.4em] font-bold hidden md:block ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Execute_Launch
          </motion.span>
          <MagneticButton className={`w-16 h-16 md:w-24 md:h-24 text-white transition-all shadow-xl ${
            isDark ? 'bg-blue-600 hover:bg-slate-800' : 'bg-blue-600 hover:bg-slate-900'
          }`}>
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight size={28} />
            </motion.div>
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
};

// --- Philosophy Section ---
const PhilosophySection = ({ onOpenAbout }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const xText = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const { isDark } = useTheme();

  return (
    <section ref={container} id="protocol" className={`py-24 md:py-52 overflow-hidden relative border-y transition-colors duration-300 ${
      isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-900 border-white/5'
    }`}>
      <motion.div style={{ x: xText }} className="flex whitespace-nowrap mb-16 md:mb-24 opacity-10 pointer-events-none">
        <h2 className="text-[20vw] md:text-[15vw] font-mono uppercase tracking-tighter leading-none text-blue-500">
          PERFORMANT &middot; SECURE &middot; ATOMIC &middot; 
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "4rem" }}
              transition={{ duration: 0.8 }}
              className="w-12 md:w-16 h-[2px] bg-blue-600 mb-8 md:mb-12"
            />
            <motion.h3 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold text-blue-500 mb-6 md:mb-10"
            >
              Core Protocols
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1] mb-8"
            >
              Reliability is <br className="hidden md:block" /> the highest form <br className="hidden md:block" /> of <span className="text-blue-600 italic font-mono">interface</span>.
            </motion.p>
            <motion.button
              onClick={onOpenAbout}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-all rounded-sm"
            >
              More About Me
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </motion.button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { icon: Layers, label: "Architecture", color: "text-blue-500", bg: "bg-slate-800" },
              { icon: Sparkles, label: "Heuristics", color: "text-white", bg: "bg-blue-600" },
              { icon: Cpu, label: "Compute", color: "text-blue-500", bg: "bg-slate-900" },
              { icon: Code, label: "Syntax", color: isDark ? "text-white" : "text-slate-900", bg: "bg-white" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-6 md:p-10 ${item.bg} border ${isDark ? 'border-white/5' : 'border-white/10'} flex flex-col gap-6 md:gap-10 aspect-square justify-between group`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className={item.color} size={24} />
                </motion.div>
                <span className={`text-[8px] md:text-[10px] font-mono uppercase ${
                  idx === 3 ? (isDark ? 'text-slate-400' : 'text-slate-400') : 'text-slate-500'
                }`}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = ({ onOpenInspirations, onOpenAbout }) => {
  const [time, setTime] = useState("");
  const { isDark } = useTheme();

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
    <footer className={`relative pt-24 md:pt-52 pb-10 md:pb-20 px-6 md:px-10 overflow-hidden border-t transition-colors duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="md:col-span-2">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`text-3xl md:text-4xl font-bold tracking-tighter mb-6 md:mb-10 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            ELLEN_STUDIO
            <span className={`font-mono ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>.BIN</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`max-w-sm text-sm md:text-lg leading-relaxed font-mono uppercase tracking-tighter ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Developing the future of digital interaction through code-first methodologies.
          </motion.p>
        </div>
        
        {['Directories', 'Nodes'].map((category, idx) => (
          <div key={category}>
            <motion.h3 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-6 md:mb-12 font-bold font-mono ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              {category}
            </motion.h3>
            <ul className="flex flex-col gap-3 md:gap-5 text-[10px] md:text-xs font-bold">
              {(idx === 0 
                ? ['Work', 'History', 'Inspirations', 'About'] 
                : ['GitHub', 'NPM', 'LinkedIn']
              ).map((i, index) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  {i === 'Inspirations' ? (
                    <button onClick={onOpenInspirations} className={`transition-colors uppercase tracking-widest font-mono text-left ${
                      isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
                    }`}>{i}</button>
                  ) : i === 'About' ? (
                    <button onClick={onOpenAbout} className={`transition-colors uppercase tracking-widest font-mono text-left ${
                      isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
                    }`}>{i}</button>
                  ) : (
                    <a href="#" className={`transition-colors uppercase tracking-widest font-mono ${
                      isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'
                    }`}>{i}</a>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-24 md:mt-40 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`signature text-5xl md:text-6xl mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Ellen
          </motion.div>
          <div className={`flex gap-6 md:gap-10 text-[8px] uppercase tracking-[0.4em] font-mono ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            <span>&copy; 2026_STUDIO</span>
            <span>NODE: TN_IN</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex flex-col items-end">
            <span className={`text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-bold mb-1 font-mono ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>Local_Time</span>
            <span className={`text-xs md:text-sm font-mono font-bold tracking-widest ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>{time}</span>
          </div>
          <motion.button
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            whileHover={{ scale: 1.1, rotate: -45 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 md:w-16 md:h-16 border flex items-center justify-center transition-all group ${
              isDark 
                ? 'border-slate-700 bg-slate-800 hover:bg-blue-600 hover:border-blue-600 text-white' 
                : 'border-slate-300 bg-slate-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-900'
            }`}
          >
            <ArrowUpRight size={20} className="-rotate-45" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

// --- Cursor Follower ---
const CursorFollower = () => {
  const { mouseX, mouseY } = useMousePosition();
  const springX = useSpring(mouseX, { stiffness: 1000, damping: 60 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 60 });
  const { isDark } = useTheme();

  return (
    <motion.div 
      style={{ left: springX, top: springY }}
      className={`fixed w-1.5 h-1.5 pointer-events-none z-[9999] transition-colors duration-300 ${
        isDark ? 'bg-blue-400' : 'bg-blue-600'
      }`}
    />
  );
};

// --- Main App ---
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isInspirationsOpen, setIsInspirationsOpen] = useState(false);
  
  const projects = [
    { title: "NEURAL", tags: ["Python", "C++"], description: "Optimized inference engine for low-latency neural processing on the edge." },
    { title: "QUBIT", tags: ["Go", "React"], description: "Visual debugger for quantum circuit execution and state monitoring." },
    { title: "SHARD", tags: ["Rust", "Wasm"], description: "Distributed file storage protocol with sub-millisecond propagation." },
    { title: "KINETIC", tags: ["Swift", "ThreeJS"], description: "Motion-sensitive architectural visualization using volumetric rendering." },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=JetBrains+Mono:wght@400;700&family=Great+Vibes&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Space Grotesk', sans-serif;
            overflow-x: hidden;
          }
          
          .font-mono {
            font-family: 'JetBrains Mono', monospace;
          }
          
          .signature {
            font-family: 'Great Vibes', cursive;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
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
        
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>

        <Navbar 
          onOpenAbout={() => setIsAboutOpen(true)} 
          onOpenInspirations={() => setIsInspirationsOpen(true)} 
        />
        
        <AnimatePresence>
          {isAboutOpen && (
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isInspirationsOpen && (
            <InspirationsModal isOpen={isInspirationsOpen} onClose={() => setIsInspirationsOpen(false)} />
          )}
        </AnimatePresence>
        
        <Hero />

        <section id="repositories" className="px-6 md:px-24 max-w-[1600px] mx-auto py-20 md:py-40">
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 border-b pb-12 gap-8 ${
            isInspirationsOpen ? 'border-slate-800' : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-bold font-mono mb-4 md:mb-6 text-blue-600 dark:text-blue-400"
              >
                Stack // 2026
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl md:text-4xl font-bold tracking-tighter ${
                  isInspirationsOpen ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                Verified Deployments
              </motion.p>
            </div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold font-mono ${
                isInspirationsOpen ? 'text-slate-600' : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              Status: Online
            </motion.span>
          </div>
          
          <div className="space-y-[6vh] md:space-y-[10vh]">
            {projects.map((p, i) => (
              <ProjectItem key={p.title} project={p} index={i} />
            ))}
          </div>
        </section>

        <PhilosophySection onOpenAbout={() => setIsAboutOpen(true)} />

        <section id="root" className={`min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden pt-20 transition-colors duration-300 ${
          isInspirationsOpen ? 'bg-slate-900' : 'bg-white dark:bg-slate-900'
        }`}>
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 md:mb-12 mt-20 md:mt-24"
            >
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`px-6 md:px-10 py-3 md:py-4 text-[8px] md:text-[9px] uppercase tracking-[0.6em] font-bold font-mono shadow-sm inline-block ${
                  isInspirationsOpen 
                    ? 'bg-slate-800 text-blue-400' 
                    : 'bg-slate-900 dark:bg-slate-800 text-blue-400'
                }`}
              >
                Connection: Listening
              </motion.span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className={`text-6xl md:text-[12vw] font-bold tracking-tighter mb-16 md:mb-24 leading-[0.8] uppercase ${
                isInspirationsOpen ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
            >
              Execute <br className="hidden md:block" /> <span className="italic font-mono text-blue-600 dark:text-blue-400">Command.</span>
            </motion.h2>
            
            <div className="pb-20 md:pb-0">
              <MagneticButton 
                icon={Rocket}
                className="px-12 md:px-20 py-6 md:py-10 font-bold rounded-sm text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all shadow-2xl bg-blue-600 hover:bg-slate-900 dark:hover:bg-slate-800 text-white"
              >
                Initiate Thread
              </MagneticButton>
            </div>
          </div>
        </section>

        <Footer 
          onOpenInspirations={() => setIsInspirationsOpen(true)} 
          onOpenAbout={() => setIsAboutOpen(true)} 
        />
        
        <CursorFollower />
      </div>
    </ThemeProvider>
  );
};

export default App;
