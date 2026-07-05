/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Maximize2, Move, Minimize2, Camera, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  name: string;
  category?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name, category = "Electronics" }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [viewMode, setViewMode] = useState<'standard' | '360' | '3d' | 'ar'>('standard');
  
  // 360 Spin state
  const [spinAngle, setSpinAngle] = useState(0);
  const [isSpinPlaying, setIsSpinPlaying] = useState(false);
  const spinInterval = useRef<any>(null);
  const isDraggingSpin = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  // 3D Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelRotation, setModelRotation] = useState({ x: 0.5, y: 0.5 });
  const [modelZoom, setModelZoom] = useState(1.5);
  const isDragging3d = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartRotation = useRef({ x: 0, y: 0 });
  
  // AR Simulation state
  const [arScale, setArScale] = useState(1);
  const [isArCameraActive, setIsArCameraActive] = useState(false);
  const arVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  // Handle Standard Magnifier Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  // 360 Spin auto-rotation
  useEffect(() => {
    if (viewMode === '360' && isSpinPlaying) {
      spinInterval.current = setInterval(() => {
        setSpinAngle(prev => (prev + 3) % 360);
      }, 50);
    } else {
      if (spinInterval.current) clearInterval(spinInterval.current);
    }
    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, [viewMode, isSpinPlaying]);

  // 360 Spin drag handlers
  const handleSpinStart = (clientX: number) => {
    isDraggingSpin.current = true;
    dragStartX.current = clientX;
    dragStartAngle.current = spinAngle;
  };

  const handleSpinMove = (clientX: number) => {
    if (!isDraggingSpin.current) return;
    const deltaX = clientX - dragStartX.current;
    // Map movement to 360 degrees
    const sensitivity = 1.2;
    const newAngle = (dragStartAngle.current + deltaX * sensitivity + 360) % 360;
    setSpinAngle(newAngle);
  };

  const handleSpinEnd = () => {
    isDraggingSpin.current = false;
  };

  // 3D Canvas Projection and Rendering
  useEffect(() => {
    if (viewMode !== '3d' && viewMode !== 'ar') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Define 3D geometries depending on category
    let vertices: Point3D[] = [];
    let edges: [number, number][] = [];
    const catLower = category.toLowerCase();

    if (catLower.includes('footwear') || catLower.includes('shoe')) {
      // 3D Sneaker geometry
      vertices = [
        // Sole base
        { x: -80, y: 30, z: -15 }, { x: -40, y: 35, z: -20 }, { x: 10, y: 35, z: -20 }, { x: 50, y: 38, z: -15 }, { x: 80, y: 30, z: -10 },
        { x: 80, y: 30, z: 10 }, { x: 50, y: 38, z: 15 }, { x: 10, y: 35, z: 20 }, { x: -40, y: 35, z: 20 }, { x: -80, y: 30, z: 15 },
        // Upper rim / opening
        { x: -50, y: 0, z: -10 }, { x: -20, y: -15, z: -12 }, { x: 10, y: -10, z: -10 }, { x: 40, y: 15, z: -8 },
        { x: 40, y: 15, z: 8 }, { x: 10, y: -10, z: 10 }, { x: -20, y: -15, z: 12 }, { x: -50, y: 0, z: 8 },
        // Heel tab
        { x: -75, y: -5, z: 0 }
      ];
      edges = [
        // Sole loops
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0],
        // Upper loop
        [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 10],
        // Side connectors
        [0, 10], [9, 17], [4, 13], [5, 14], [2, 12], [7, 15],
        // Heel tab connectors
        [0, 18], [9, 18], [10, 18], [17, 18]
      ];
    } else if (catLower.includes('headphone') || catLower.includes('audio')) {
      // 3D Headphones geometry
      vertices = [
        // Left Ear Cup (cylinder)
        { x: -60, y: 10, z: -15 }, { x: -60, y: 35, z: -15 }, { x: -60, y: 35, z: 15 }, { x: -60, y: 10, z: 15 },
        { x: -50, y: 12, z: -10 }, { x: -50, y: 33, z: -10 }, { x: -50, y: 33, z: 10 }, { x: -50, y: 12, z: 10 },
        // Right Ear Cup (cylinder)
        { x: 60, y: 10, z: -15 }, { x: 60, y: 35, z: -15 }, { x: 60, y: 35, z: 15 }, { x: 60, y: 10, z: 15 },
        { x: 50, y: 12, z: -10 }, { x: 50, y: 33, z: -10 }, { x: 50, y: 33, z: 10 }, { x: 50, y: 12, z: 10 },
        // Headband Arc
        { x: -55, y: 5, z: 0 }, { x: -45, y: -25, z: 0 }, { x: -25, y: -45, z: 0 }, { x: 0, y: -50, z: 0 },
        { x: 25, y: -45, z: 0 }, { x: 45, y: -25, z: 0 }, { x: 55, y: 5, z: 0 }
      ];
      edges = [
        // Left Cup
        [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Right Cup
        [8, 9], [9, 10], [10, 11], [11, 8], [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
        // Headband
        [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22]
      ];
    } else {
      // 3D Smartphone / Electronics block geometry
      vertices = [
        // Front face (rounded corner cube)
        { x: -45, y: -80, z: -6 }, { x: 45, y: -80, z: -6 }, { x: 45, y: 80, z: -6 }, { x: -45, y: 80, z: -6 },
        // Back face
        { x: -45, y: -80, z: 6 },  { x: 45, y: -80, z: 6 },  { x: 45, y: 80, z: 6 },  { x: -45, y: 80, z: 6 },
        // Inner Screen
        { x: -40, y: -74, z: -6.1 }, { x: 40, y: -74, z: -6.1 }, { x: 40, y: 74, z: -6.1 }, { x: -40, y: 74, z: -6.1 },
        // Camera module back
        { x: -25, y: -65, z: 6.1 }, { x: 0, y: -65, z: 6.1 }, { x: 0, y: -40, z: 6.1 }, { x: -25, y: -40, z: 6.1 }
      ];
      edges = [
        // Front loop
        [0, 1], [1, 2], [2, 3], [3, 0],
        // Back loop
        [4, 5], [5, 6], [6, 7], [7, 4],
        // Connectors
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Screen loop
        [8, 9], [9, 10], [10, 11], [11, 8],
        // Camera loop
        [12, 13], [13, 14], [14, 15], [15, 12]
      ];
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const radX = modelRotation.x;
      const radY = modelRotation.y;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      // Projects 3D to 2D
      const projected = vertices.map(v => {
        // Rotate Y
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.x * sinY + v.z * cosY;

        // Rotate X
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = v.y * sinX + z1 * cosX;

        // Perspective projection
        const dist = 320;
        const zoomFactor = modelZoom * 1.5;
        const scale = dist / (dist + z2);
        
        return {
          x: x1 * scale * zoomFactor + canvas.width / 2,
          y: y2 * scale * zoomFactor + canvas.height / 2
        };
      });

      // Draw Edges
      ctx.strokeStyle = '#00D9A6'; // Brand primary green
      ctx.lineWidth = 2;
      ctx.beginPath();
      edges.forEach(([startIdx, endIdx]) => {
        const start = projected[startIdx];
        const end = projected[endIdx];
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      });
      ctx.stroke();

      // Draw vertex nodes
      ctx.fillStyle = '#4f46e5'; // Indigo accent
      projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Auto rotation in idle mode
      if (!isDragging3d.current && viewMode === '3d') {
        setModelRotation(prev => ({
          x: prev.x + 0.003,
          y: prev.y + 0.005
        }));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewMode, modelRotation, modelZoom, category]);

  // 3D Canvas mouse handlers
  const handle3dStart = (clientX: number, clientY: number) => {
    isDragging3d.current = true;
    dragStartPos.current = { x: clientX, y: clientY };
    dragStartRotation.current = { ...modelRotation };
  };

  const handle3dMove = (clientX: number, clientY: number) => {
    if (!isDragging3d.current) return;
    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;
    const sensitivity = 0.008;

    setModelRotation({
      x: dragStartRotation.current.x + deltaY * sensitivity,
      y: dragStartRotation.current.y + deltaX * sensitivity
    });
  };

  const handle3dEnd = () => {
    isDragging3d.current = false;
  };

  // Simulated AR camera toggle
  const toggleArCamera = async () => {
    if (isArCameraActive) {
      if (arVideoRef.current && arVideoRef.current.srcObject) {
        const stream = arVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setIsArCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (arVideoRef.current) {
          arVideoRef.current.srcObject = stream;
        }
        setIsArCameraActive(true);
      } catch (err) {
        console.warn("Camera access denied or unavailable", err);
        // Fallback: active state without camera (uses bedroom mockup background)
        setIsArCameraActive(true);
      }
    }
  };

  useEffect(() => {
    if (viewMode !== 'ar') {
      if (arVideoRef.current && arVideoRef.current.srcObject) {
        const stream = arVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setIsArCameraActive(false);
    }
  }, [viewMode]);

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full">
      {/* Thumbnails Column (left on desktop, bottom scroll on mobile) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[480px] order-2 lg:order-1 scrollbar-none py-1">
        {/* Gallery thumbnails */}
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setViewMode('standard');
              setSelectedImage(img);
            }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-all duration-350 shadow-md ${
              selectedImage === img && viewMode === 'standard'
                ? 'border-primary ring-2 ring-primary/20 scale-105'
                : 'border-transparent hover:border-gray-300 dark:hover:border-slate-800'
            }`}
          >
            <img src={img} alt="thumb" className="w-full h-full object-cover" />
          </button>
        ))}

        {/* 360 Spin trigger button */}
        <button
          onClick={() => setViewMode('360')}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center border-2 cursor-pointer flex-shrink-0 transition-all duration-350 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-500 font-bold text-[10px] sm:text-xs shadow-md ${
            viewMode === '360' ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-105' : 'border-transparent hover:border-indigo-300'
          }`}
        >
          <RotateCw className="w-5 h-5 mb-1 animate-spin-slow" />
          <span>360° SPIN</span>
        </button>

        {/* 3D Model trigger button */}
        <button
          onClick={() => setViewMode('3d')}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center border-2 cursor-pointer flex-shrink-0 transition-all duration-350 bg-emerald-50/50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-xs shadow-md ${
            viewMode === '3d' ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-105' : 'border-transparent hover:border-emerald-300'
          }`}
        >
          <Maximize2 className="w-5 h-5 mb-1 animate-pulse" />
          <span>3D VIEW</span>
        </button>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 order-1 lg:order-2 w-full">
        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden glass border border-gray-200/50 dark:border-gray-800/80 shadow-2xl bg-bg-surface/20 flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            {/* Standard Media Viewer with hover zoom */}
            {viewMode === 'standard' && (
              <motion.div
                key="standard-media"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full cursor-zoom-in relative"
              >
                <img src={selectedImage} alt={name} className="w-full h-full object-cover rounded-3xl" />
                <div
                  style={{
                    ...zoomStyle,
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: '220%',
                    backgroundRepeat: 'no-repeat'
                  }}
                  className="absolute inset-0 pointer-events-none rounded-3xl"
                />
              </motion.div>
            )}

            {/* 360 Spin Viewer */}
            {viewMode === '360' && (
              <motion.div
                key="360-spin"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950/5 cursor-grab active:cursor-grabbing relative select-none touch-pan-y"
                onMouseDown={e => handleSpinStart(e.clientX)}
                onMouseMove={e => handleSpinMove(e.clientX)}
                onMouseUp={handleSpinEnd}
                onMouseLeave={handleSpinEnd}
                onTouchStart={e => handleSpinStart(e.touches[0].clientX)}
                onTouchMove={e => handleSpinMove(e.touches[0].clientX)}
                onTouchEnd={handleSpinEnd}
              >
                {/* 3D Perspective Rotation Card */}
                <div 
                  className="w-2/3 h-2/3 relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/20 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-350"
                  style={{
                    transform: `perspective(800px) rotateY(${spinAngle}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <img src={selectedImage} alt={name} className="w-full h-full object-cover pointer-events-none" />
                </div>

                <div className="absolute bottom-4 flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-gray-250/20 text-xs">
                  <button 
                    onClick={() => setIsSpinPlaying(!isSpinPlaying)}
                    className="p-1 text-slate-700 dark:text-slate-200 hover:text-primary transition-colors cursor-pointer"
                  >
                    {isSpinPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-gray-300 select-none">|</span>
                  <span className="flex items-center gap-1 font-bold text-text-secondary select-none">
                    <Move className="w-3.5 h-3.5" /> Drag to Rotate
                  </span>
                </div>
              </motion.div>
            )}

            {/* 3D Model Interactive Canvas Viewer */}
            {viewMode === '3d' && (
              <motion.div
                key="3d-canvas"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full bg-slate-950/10 dark:bg-slate-950/50 flex flex-col items-center justify-center p-4 relative cursor-grab active:cursor-grabbing select-none"
                onMouseDown={e => handle3dStart(e.clientX, e.clientY)}
                onMouseMove={e => handle3dMove(e.clientX, e.clientY)}
                onMouseUp={handle3dEnd}
                onMouseLeave={handle3dEnd}
                onTouchStart={e => handle3dStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={e => handle3dMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handle3dEnd}
              >
                <canvas 
                  ref={canvasRef} 
                  width={400} 
                  height={300} 
                  className="w-full max-w-[400px] h-auto object-contain pointer-events-none" 
                />

                {/* 3D Control panel */}
                <div className="absolute bottom-4 flex items-center gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-250/20 text-[10px] sm:text-xs">
                  <button 
                    onClick={() => setModelZoom(prev => Math.max(0.8, prev - 0.2))}
                    className="px-2 py-0.5 font-bold hover:text-primary transition-colors cursor-pointer"
                  >
                    ZOOM -
                  </button>
                  <span className="text-gray-300 select-none">|</span>
                  <button 
                    onClick={() => setModelZoom(prev => Math.min(2.5, prev + 0.2))}
                    className="px-2 py-0.5 font-bold hover:text-primary transition-colors cursor-pointer"
                  >
                    ZOOM +
                  </button>
                  <span className="text-gray-300 select-none">|</span>
                  <button 
                    onClick={() => {
                      setModelRotation({ x: 0.5, y: 0.5 });
                      setModelZoom(1.5);
                    }}
                    className="px-2 py-0.5 font-bold hover:text-primary transition-colors cursor-pointer"
                  >
                    RESET
                  </button>
                  <span className="text-gray-300 select-none">|</span>
                  <button 
                    onClick={() => setViewMode('ar')}
                    className="px-2.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-450 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" /> AR ROOM
                  </button>
                </div>
              </motion.div>
            )}

            {/* AR Viewer simulated mode */}
            {viewMode === 'ar' && (
              <motion.div
                key="ar-room"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative flex items-center justify-center overflow-hidden bg-slate-950"
              >
                {/* Camera stream or Mock room preview */}
                {isArCameraActive ? (
                  <video 
                    ref={arVideoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" 
                    alt="Mock room" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60" 
                  />
                )}

                {/* Overlaid 3D Canvas element */}
                <div 
                  className="relative z-10 w-[240px] h-[180px] cursor-grab active:cursor-grabbing select-none"
                  style={{ transform: `scale(${arScale})` }}
                  onMouseDown={e => handle3dStart(e.clientX, e.clientY)}
                  onMouseMove={e => handle3dMove(e.clientX, e.clientY)}
                  onMouseUp={handle3dEnd}
                  onMouseLeave={handle3dEnd}
                  onTouchStart={e => handle3dStart(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchMove={e => handle3dMove(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchEnd={handle3dEnd}
                >
                  <canvas ref={canvasRef} width={300} height={200} className="w-full h-full object-contain pointer-events-none" />
                </div>

                {/* AR Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <button 
                    onClick={toggleArCamera}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] sm:text-xs font-bold rounded-xl border border-white/10 backdrop-blur-md cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    {isArCameraActive ? "Freeze Camera" : "Activate Room Camera"}
                  </button>

                  <button 
                    onClick={() => setViewMode('3d')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 text-white text-[10px] sm:text-xs font-bold rounded-xl border border-white/10 backdrop-blur-md cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Back to 3D
                  </button>
                </div>

                {/* AR Scale Slider */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 text-white text-[10px] sm:text-xs min-w-[200px]">
                  <span className="font-bold whitespace-nowrap">Size:</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={arScale} 
                    onChange={e => setArScale(parseFloat(e.target.value))}
                    className="w-full accent-primary bg-slate-800 rounded-lg cursor-pointer h-1" 
                  />
                  <span className="font-mono font-bold select-none">{Math.round(arScale * 100)}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
