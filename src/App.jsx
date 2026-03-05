import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import * as THREE from 'three';
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
  User,
  Lightbulb,
  MapPin,
  Navigation,
  TrendingUp,
  Activity,
  Award,
  Target,
  Clock,
  Github,
  Linkedin,
  Mail,
  BookOpen,
  Target as TargetIcon,
  Compass,
  Fingerprint,
  Shield,
  Cpu as CpuIcon,
  Wifi,
  Download,
  Eye,
  Star
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

// --- Typewriter Hook ---
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

// --- Cartoony 3D Earth Component ---
const CartoonEarth = () => {
  const containerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [myLocation] = useState({ lat: 11.0168, lon: 76.9558, name: "Coimbatore, TN" }); // Your location
  const [distance, setDistance] = useState(null);
  const [locationName, setLocationName] = useState('');

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create cartoony earth sphere
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    
    // Create cartoon-style texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Bright blue base
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add cartoon continents in bright green
    ctx.fillStyle = '#22c55e';
    
    // Continent shapes (simplified and cartoony)
    // North America
    ctx.beginPath();
    ctx.arc(150, 150, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.arc(180, 300, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Europe
    ctx.beginPath();
    ctx.arc(350, 120, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Africa
    ctx.beginPath();
    ctx.arc(370, 250, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.arc(450, 180, 45, 0, Math.PI * 2);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.arc(450, 380, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Add white clouds (cartoon style)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(200, 100, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(300, 350, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(400, 280, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Add some cartoony eyes to make it fun
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(250, 200, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(300, 200, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(253, 202, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(303, 202, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(275, 230, 15, 0.1, Math.PI - 0.1);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 30,
      emissive: new THREE.Color(0x1e3a8a)
    });
    
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    // Add colorful lights for cartoon effect
    const light1 = new THREE.PointLight(0xff6b6b, 0.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0x4ecdc4, 0.5);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    // Add stars background (fewer, brighter stars for cartoon look)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 200;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPositions[i] = (Math.random() - 0.5) * 200;
      starsPositions[i+1] = (Math.random() - 0.5) * 200;
      starsPositions[i+2] = (Math.random() - 0.5) * 200;
      
      // Random colors for stars
      starsColors[i] = Math.random();
      starsColors[i+1] = Math.random();
      starsColors[i+2] = Math.random();
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    const starsMaterial = new THREE.PointsMaterial({ 
      size: 0.3, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 15;

    // Animation
    let animationFrame;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      earth.rotation.y += 0.002;
      stars.rotation.y += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          // Calculate distance
          const dist = calculateDistance(
            myLocation.lat, myLocation.lon,
            latitude, longitude
          );
          setDistance(Math.round(dist));
          
          // Reverse geocoding to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocationName(data.address.city || data.address.town || data.address.village || 'Unknown');
          } catch (error) {
            console.error('Error getting location name:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [myLocation.lat, myLocation.lon]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div ref={containerRef} className="w-[300px] h-[300px]" />
      
      {/* My Location Pin */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="relative">
          <MapPin size={24} className="text-red-500 fill-red-500/20" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-500/20 rounded-full blur-sm"
          />
        </div>
      </motion.div>

      {/* User Location Info */}
      {userLocation && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-slate-900/90 backdrop-blur-sm px-4 py-3 border border-blue-500/30 rounded-sm w-full"
        >
          <div className="flex items-center gap-2 text-xs mb-2">
            <Navigation size={12} className="text-blue-400" />
            <span className="text-white font-mono">
              You are in {locationName}
            </span>
          </div>
          {distance && (
            <div className="flex items-center gap-2 text-xs">
              <Compass size={12} className="text-green-400" />
              <span className="text-green-400 font-mono">
                Distance: {distance} km from me
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-[10px] mt-2 text-slate-500 font-mono">
            <span>{userLocation.latitude.toFixed(4)}°N</span>
            <span>{userLocation.longitude.toFixed(4)}°E</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// --- Stats Ticker Component (Angled) ---
const StatsTicker = () => {
  const stats = [
    { label: 'Projects Delivered', value: '47', icon: Award, change: '+12' },
    { label: 'Lines of Code', value: '2.4M', icon: Code, change: '+180K' },
    { label: 'Happy Clients', value: '32', icon: User, change: '+8' },
    { label: 'GitHub Stars', value: '1.8K', icon: Star, change: '+342' },
    { label: 'Contributions', value: '856', icon: Activity, change: '+156' },
    { label: 'Countries Reached', value: '24', icon: Globe, change: '+5' },
    { label: 'Response Time', value: '45ms', icon: Clock, change: '-12ms' },
    { label: 'Uptime', value: '99.99%', icon: Zap, change: '+0.02%' },
    { label: 'Downloads', value: '12.5K', icon: Download, change: '+2.3K' },
    { label: 'Unique Visitors', value: '8.2K', icon: Eye, change: '+1.1K' },
  ];

  return (
    <div className="w-full bg-slate-900 border-y border-blue-500/20 overflow-hidden py-6 transform rotate-180">
      <div className="relative transform -rotate-180">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, -2000] }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...stats, ...stats, ...stats].map((stat, index) => (
            <div key={index} className="flex items-center gap-4 mx-6">
              <div className="flex items-center gap-2">
                <stat.icon size={14} className="text-blue-400" />
                <span className="text-white/50 text-[8px] font-mono uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-sm">{stat.value}</span>
                <span className="text-green-400 text-[8px] font-mono">{stat.change}</span>
              </div>
              <div className="w-px h-4 bg-blue-500/20 mx-2" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- Enhanced Cursor with Trail ---
const EnhancedCursor = () => {
  const { mouseX, mouseY } = useMousePosition();
  const [trailPositions, setTrailPositions] = useState([]);
  
  const cursorX = useSpring(mouseX, { stiffness: 800, damping: 40 });
  const cursorY = useSpring(mouseY, { stiffness: 800, damping: 40 });

  useEffect(() => {
    const updateTrail = () => {
      setTrailPositions(prev => {
        const newPos = { x: cursorX.get(), y: cursorY.get() };
        return [...prev, newPos].slice(-12);
      });
    };

    const interval = setInterval(updateTrail, 50);
    return () => clearInterval(interval);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        style={{ 
          left: cursorX, 
          top: cursorY,
          x: '-50%',
          y: '-50%'
        }}
        className="fixed pointer-events-none z-[9999]"
      >
        <div className="relative">
          <div className="w-5 h-5 border border-blue-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full" />
        </div>
      </motion.div>

      {/* Trail */}
      {trailPositions.map((pos, i) => {
        const opacity = 0.25 - i * 0.02;
        const scale = 1 - i * 0.08;
        
        return (
          <motion.div
            key={i}
            style={{
              left: pos.x,
              top: pos.y,
              x: '-50%',
              y: '-50%',
              scale: scale,
              opacity: opacity > 0 ? opacity : 0
            }}
            className="fixed pointer-events-none z-[9998] w-4 h-4 border border-blue-400/60 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: scale }}
            transition={{ duration: 0.15 }}
          />
        );
      })}
    </>
  );
};

// --- Magnetic Button Component ---
const MagneticButton = ({ children, onClick, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
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
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {children}
    </motion.button>
  );
};

// --- About Page Component ---
const AboutPage = () => {
  const myLocation = { lat: 11.0168, lon: 76.9558 };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-20">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-bold tracking-tighter text-slate-900 mb-4"
          >
            ABOUT_<span className="text-blue-600">ME</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.3 }}
            className="h-1 bg-blue-600 mb-8"
          />
        </div>

        {/* Bio Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-slate-900 font-mono">// WHOAMI</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              I'm a full-stack developer and systems architect based in Tamil Nadu, India. 
              I specialize in building high-performance digital ecosystems that combine 
              algorithmic precision with minimalist aesthetics.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              With over 6 years of experience, I've worked on projects ranging from 
              real-time data processing systems to interactive 3D web applications. 
              My approach combines engineering rigor with creative problem-solving.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 p-8 rounded-sm"
          >
            <h3 className="text-blue-400 text-xs uppercase tracking-widest mb-4 font-mono">Core Competencies</h3>
            <div className="space-y-4">
              {[
                { label: 'System Architecture', value: '95%', color: 'bg-blue-600' },
                { label: 'Frontend Development', value: '92%', color: 'bg-green-500' },
                { label: 'Backend Engineering', value: '88%', color: 'bg-purple-500' },
                { label: 'DevOps & Cloud', value: '85%', color: 'bg-orange-500' },
                { label: 'UI/UX Design', value: '82%', color: 'bg-pink-500' },
              ].map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span className="font-mono">{skill.label}</span>
                    <span className="text-slate-400">{skill.value}</span>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: skill.value }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                      className={`h-full ${skill.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
          {[
            { icon: Award, label: 'Projects', value: '47+' },
            { icon: User, label: 'Clients', value: '32' },
            { icon: Clock, label: 'Hours Coded', value: '12K+' },
            { icon: Globe, label: 'Countries', value: '24' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-slate-50 border border-slate-200 p-6 text-center"
            >
              <stat.icon size={24} className="mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Location with Cartoon Earth */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold mb-8 text-slate-900 font-mono flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            MY_LOCATION
          </h2>
          <div className="bg-blue-50 border-2 border-blue-200 p-10 rounded-sm flex flex-col items-center">
            <CartoonEarth />
            <div className="mt-6 text-center">
              <p className="text-slate-700 font-mono mb-2">
                Based in <span className="font-bold text-blue-600">Coimbatore, Tamil Nadu</span>
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {myLocation.lat}°N, {myLocation.lon}°E
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Inspirations Page Component ---
const InspirationsPage = () => {
  const figures = [
    {
      name: "Isaac Newton",
      legacy: "Laws of Motion, Gravity, Calculus",
      achievement: "Breakthroughs before age 26",
      icon: TargetIcon,
      color: "bg-blue-600"
    },
    {
      name: "Steve Jobs",
      legacy: "Apple, Design Philosophy",
      achievement: "Revolutionized personal computing",
      icon: Eye,
      color: "bg-slate-900"
    },
    {
      name: "Ada Lovelace",
      legacy: "First Computer Algorithm",
      achievement: "Envisioned computers beyond calculation",
      icon: Code,
      color: "bg-purple-600"
    },
    {
      name: "Linus Torvalds",
      legacy: "Linux, Git",
      achievement: "Democratized open source software",
      icon: Github,
      color: "bg-orange-600"
    },
    {
      name: "Grace Hopper",
      legacy: "First Compiler, COBOL",
      achievement: "Pioneered programming languages",
      icon: Terminal,
      color: "bg-green-600"
    },
    {
      name: "Alan Turing",
      legacy: "Turing Machine, AI",
      achievement: "Father of theoretical computer science",
      icon: CpuIcon,
      color: "bg-indigo-600"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-20">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-bold tracking-tighter text-slate-900 mb-4"
          >
            INSPIR<span className="text-blue-600">ATIONS</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.3 }}
            className="h-1 bg-blue-600 mb-8"
          />
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl font-mono"
          >
            Architects of the modern intellectual landscape who shaped my thinking and approach to technology.
          </motion.p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {figures.map((figure, index) => (
            <motion.div
              key={figure.name}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`${figure.color} rounded-sm p-8 text-white relative overflow-hidden group cursor-pointer`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
              
              <figure.icon size={32} className="mb-6 text-white/80" />
              
              <h3 className="text-2xl font-bold mb-2">{figure.name}</h3>
              <p className="text-white/80 text-sm mb-4 font-mono">{figure.legacy}</p>
              
              <div className="border-t border-white/20 pt-4 mt-4">
                <span className="text-[10px] uppercase tracking-wider text-white/60">Key Achievement</span>
                <p className="text-sm mt-1">{figure.achievement}</p>
              </div>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-32 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <Lightbulb size={48} className="mx-auto mb-6 text-blue-600" />
            <blockquote className="text-3xl md:text-4xl font-light text-slate-700 mb-6">
              "Stand on the shoulders of giants, then build your own mountain."
            </blockquote>
            <p className="text-slate-500 font-mono text-sm">— Personal Mantra</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- About Modal (Legacy) ---
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
          <button 
            onClick={onClose}
            className="fixed top-8 right-8 z-30 w-10 h-10 bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
          >
            <X size={18} />
          </button>
          <AboutPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Inspirations Modal (Legacy) ---
const InspirationsModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-white overflow-y-auto"
        >
          <button 
            onClick={onClose}
            className="fixed top-8 right-8 z-30 w-10 h-10 bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
          >
            <X size={18} />
          </button>
          <InspirationsPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Navbar Component ---
const Navbar = ({ onOpenAbout, onOpenInspirations }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            width: isExpanded ? "min(550px, 90vw)" : "160px",
            paddingLeft: isExpanded ? "24px" : "16px",
            paddingRight: isExpanded ? "24px" : "16px",
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(248, 250, 252, 0.85)",
            boxShadow: isScrolled ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.01)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className="pointer-events-auto h-11 md:h-12 border border-slate-200 backdrop-blur-xl items-center justify-center overflow-hidden hidden md:flex"
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
                <div className="flex items-center gap-4 md:gap-6">
                  <a href="#repositories" className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-blue-600 transition-colors">Work</a>
                  <a href="#protocol" className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-blue-600 transition-colors">Protocol</a>
                  <button onClick={onOpenInspirations} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-blue-600 transition-colors">Inspirations</button>
                  <button onClick={onOpenAbout} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-slate-900 hover:text-blue-600 transition-colors">About</button>
                </div>
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
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-slate-900 font-mono">ELLEN.DEV</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 md:hidden">
        <div className="flex items-center justify-between w-auto min-w-[200px] px-4 py-2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm">
          <button 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="text-sm font-bold text-slate-900 font-mono tracking-tight mr-4"
          >
            Ellen
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-colors"
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
              className="absolute top-[52px] left-1/2 -translate-x-1/2 w-[200px] bg-white border border-slate-200 shadow-lg"
            >
              <div className="flex flex-col p-2">
                <a href="#repositories" onClick={handleLinkClick} className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors text-center">Work</a>
                <a href="#protocol" onClick={handleLinkClick} className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors text-center">Protocol</a>
                <button onClick={() => { onOpenInspirations(); handleLinkClick(); }} className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors text-center">Inspirations</button>
                <div className="border-t border-slate-100 my-1" />
                <button onClick={() => { onOpenAbout(); handleLinkClick(); }} className="px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors text-center">About</button>
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
const Hero = ({ onOpenAbout }) => {
  const { mouseX, mouseY } = useMousePosition();
  const spotlightX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  const words = ["STABLE_LOGIC", "ZERO_LATENCY", "QUANTUM_CODING", "NEURAL_LINK", "EDGE_COMPUTE", "CLOUD_NATIVE"];
  const typewriterText = useTypewriter(words, 120, 60, 2000);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-white text-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[900px] h-[300px] md:h-[900px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[160px] z-0" />
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        style={{ left: spotlightX, top: spotlightY, transform: 'translate(-50%, -50%)' }}
        className="pointer-events-none absolute w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-blue-600/10 rounded-full blur-[120px] md:blur-[160px] z-0 hidden md:block"
      />

      <div className="relative z-10 max-w-7xl">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="mb-6 md:mb-14"
        >
          <span className="px-4 md:px-8 py-2 md:py-3 bg-slate-900 text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-blue-400 font-bold font-mono">
            &lt; DEV_SYSTEM /&gt; V2.6
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
              className="inline-block text-blue-600 font-mono italic"
            >
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
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 md:bottom-16 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-10 md:h-16 bg-blue-100" />
        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-blue-600 font-bold">SCROLL</span>
      </motion.div>
    </section>
  );
};

// --- Project Item Component ---
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
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative w-full h-[70vh] md:h-[90vh] mb-[8vh] md:mb-[15vh] overflow-hidden group border border-slate-200 bg-white shadow-2xl"
    >
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
          <h3 className="text-5xl md:text-[8rem] font-bold text-slate-900 mb-4 md:mb-6 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-500 text-sm md:text-xl leading-relaxed font-light max-w-lg font-mono uppercase tracking-tighter">
            {project.description}
          </p>
        </div>
        
        <MagneticButton className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 text-white hover:bg-slate-900 transition-all shadow-xl group/btn">
          <ArrowUpRight size={24} className="group-hover/btn:scale-125 transition-transform" />
        </MagneticButton>
      </div>
    </motion.div>
  );
};

// --- Philosophy Section ---
const PhilosophySection = ({ onOpenAbout }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const xText = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={container} id="protocol" className="py-24 md:py-52 bg-slate-900 overflow-hidden relative border-y border-white/5">
      <motion.div style={{ x: xText }} className="flex whitespace-nowrap mb-16 md:mb-24 opacity-10 pointer-events-none">
        <h2 className="text-[20vw] md:text-[15vw] font-mono uppercase tracking-tighter leading-none text-blue-500">
          PERFORMANT · SECURE · ATOMIC · 
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <div className="w-12 md:w-16 h-[2px] bg-blue-600 mb-8 md:mb-12" />
            <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] font-bold text-blue-500 mb-6 md:mb-10">CORE PROTOCOLS</h3>
            <p className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1] mb-8">
              Reliability is <br /> the highest form <br /> of <span className="text-blue-600 italic font-mono">interface</span>.
            </p>
            <motion.button
              onClick={onOpenAbout}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-all"
            >
              More About Me
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
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

// --- Footer Component ---
const Footer = ({ onOpenInspirations, onOpenAbout }) => {
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
    <footer className="relative bg-white pt-24 md:pt-40 pb-10 md:pb-16 px-6 md:px-10 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20">
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-slate-900">ELLEN<span className="text-blue-600 font-mono">.DEV</span></h2>
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed font-mono uppercase tracking-tighter">
            Developing the future of digital interaction through code-first methodologies.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
              <Github size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-[8px] uppercase tracking-[0.4em] text-slate-500 mb-6 font-bold font-mono">Explore</h3>
          <ul className="flex flex-col gap-3 text-[10px] font-bold">
            <li><a href="#repositories" className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">Work</a></li>
            <li><a href="#protocol" className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">Protocol</a></li>
            <li><button onClick={onOpenInspirations} className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">Inspirations</button></li>
            <li><button onClick={onOpenAbout} className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">About</button></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-[8px] uppercase tracking-[0.4em] text-slate-500 mb-6 font-bold font-mono">Connect</h3>
          <ul className="flex flex-col gap-3 text-[10px] font-bold">
            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">GitHub</a></li>
            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">LinkedIn</a></li>
            <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest font-mono">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 md:mt-24 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-6 text-[8px] uppercase tracking-[0.4em] font-mono text-slate-500">
          <span>&copy; 2026 ELLEN.DEV</span>
          <span>NODE: TN, INDIA</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-[7px] uppercase tracking-[0.4em] text-blue-600 font-bold mb-1 font-mono">LOCAL_TIME</span>
             <span className="text-xs font-mono font-bold text-slate-700 tracking-widest">{time} IST</span>
          </div>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-10 h-10 border border-slate-300 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 bg-slate-50 transition-all group">
            <ArrowUpRight size={16} className="-rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---
const App = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isInspirationsOpen, setIsInspirationsOpen] = useState(false);
  
  const projects = [
    { title: "NEURAL", tags: ["Python", "C++"], description: "Optimized inference engine for low-latency neural processing." },
    { title: "QUBIT", tags: ["Go", "React"], description: "Visual debugger for quantum circuit execution." },
    { title: "SHARD", tags: ["Rust", "Wasm"], description: "Distributed file storage with sub-millisecond propagation." },
    { title: "KINETIC", tags: ["Swift", "ThreeJS"], description: "Motion-sensitive architectural visualization." },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=JetBrains+Mono:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      
      <Navbar onOpenAbout={() => setIsAboutOpen(true)} onOpenInspirations={() => setIsInspirationsOpen(true)} />
      
      <AnimatePresence mode="wait">
        {!isAboutOpen && !isInspirationsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onOpenAbout={() => setIsAboutOpen(true)} />

            <section id="repositories" className="px-6 md:px-24 max-w-[1600px] mx-auto py-20 md:py-40">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 border-b border-slate-100 pb-12 gap-8">
                <div>
                  <h2 className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] font-bold text-blue-600 mb-4 md:mb-6 font-mono">STACK // 2026</h2>
                  <p className="text-3xl md:text-4xl font-bold tracking-tighter">Verified Deployments</p>
                </div>
                <span className="text-[8px] md:text-[10px] text-slate-300 uppercase tracking-[0.4em] font-bold font-mono">STATUS: ONLINE</span>
              </div>
              
              <div className="space-y-[6vh] md:space-y-[10vh]">
                {projects.map((p, i) => (
                  <ProjectItem key={p.title} project={p} index={i} />
                ))}
              </div>
            </section>

            <PhilosophySection onOpenAbout={() => setIsAboutOpen(true)} />

            <section id="cta" className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-white pt-20">
              <div className="text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 md:mb-12"
                >
                  <span className="px-6 md:px-10 py-3 md:py-4 bg-slate-900 text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-blue-400 font-bold font-mono shadow-sm">CONNECTION: LISTENING</span>
                </motion.div>
                
                <h2 className="text-6xl md:text-[12vw] font-bold tracking-tighter mb-16 md:mb-24 leading-[0.8] text-slate-900 uppercase">
                  Execute <br /> <span className="text-blue-600 italic font-mono">Command.</span>
                </h2>
                
                <div className="pb-20 md:pb-0">
                  <MagneticButton className="px-12 md:px-20 py-6 md:py-10 bg-blue-600 text-white font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-2xl">
                     Initiate Thread <ArrowRight size={18} className="ml-3 md:ml-4 inline" />
                  </MagneticButton>
                </div>
              </div>
            </section>

            {/* Stats Ticker - Positioned right before footer */}
            <StatsTicker />
          </motion.div>
        )}
      </AnimatePresence>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <InspirationsModal isOpen={isInspirationsOpen} onClose={() => setIsInspirationsOpen(false)} />
      
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
        
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #ffffff; }
        ::-webkit-scrollbar-thumb { background: #2563eb; }
      `}</style>
      
      <EnhancedCursor />
    </div>
  );
};

export default App;
