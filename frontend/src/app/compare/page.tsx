'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MoveHorizontal, Sparkles, CheckSquare, Square } from 'lucide-react';

type ImageOption = 'bf' | 'ai' | 'gt';

interface ImageConfig {
  id: ImageOption;
  label: string;
  src: string;
  color: string;
}

const IMAGES: ImageConfig[] = [
  { id: 'bf', label: 'Brightfield Input', src: '/bf.png', color: 'text-zinc-400' },
  { id: 'ai', label: 'AI Inferred', src: '/2.png', color: 'text-blue-400' },
  { id: 'gt', label: 'Ground Truth', src: '/1.png', color: 'text-purple-400' },
];

export default function ComparePage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedImages, setSelectedImages] = useState<ImageOption[]>(['gt', 'ai']); // Default: AI vs GT

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.buttons !== 1) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const toggleImageSelection = (id: ImageOption) => {
    setSelectedImages((prev) => {
      // If already selected, we can't deselect if it leaves us with less than 2
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // Must have exactly 2 selected
        return prev.filter(img => img !== id);
      }
      
      // If adding a new image and we already have 2, keep the most recent one (index 1) and the new one
      return prev.length >= 2 ? [prev[1], id] : [...prev, id];
    });
    setSliderPosition(50); // Reset slider on change
  };

  // Determine rendering order: GT (back layer) -> AI (middle) -> BF (front overlay)
  const sortedSelection = [...selectedImages].sort((a, b) => {
    const layerPriority = { gt: 0, ai: 1, bf: 2 };
    return layerPriority[a] - layerPriority[b];
  });

  // Base image (rendered behind)
  const leftImage = IMAGES.find(img => img.id === sortedSelection[0]);
  // Overlay image (rendered on top, clipped to left side of slider)
  const rightImage = IMAGES.find(img => img.id === sortedSelection[1]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10 relative">
        <Link href="/" className="text-sm font-medium bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-full transition-colors flex items-center gap-2">
           <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Analysis
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Checkbox Selector */}
          <div className="flex flex-col items-center justify-center gap-4 bg-secondary/20 p-5 rounded-2xl border border-white/5 backdrop-blur-sm w-full max-w-3xl mx-auto">
             <div className="text-sm font-medium text-muted-foreground w-full text-center">Select any 2 images to compare:</div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {IMAGES.map((img) => {
                    const isSelected = selectedImages.includes(img.id);
                    // Determine which side it's visually on the slider based on clip-path
                    let sideLabel = '';
                    if (sortedSelection[1] === img.id) sideLabel = 'Left Side';  // Overlay is clipped 0 to X
                    if (sortedSelection[0] === img.id) sideLabel = 'Right Side'; // Base is visible X to 100%

                    return (
                        <button
                            key={img.id}
                            onClick={() => toggleImageSelection(img.id)}
                            className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all duration-300
                                ${isSelected 
                                    ? 'bg-black/40 border-primary/50 shadow-md transform scale-[1.02]' 
                                    : 'bg-black/20 border-white/10 opacity-70 hover:opacity-100 hover:bg-black/30'}`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className={`text-sm font-semibold tracking-wide ${img.color}`}>{img.label}</span>
                                {isSelected ? (
                                    <CheckSquare className={`w-5 h-5 ${img.color}`} />
                                ) : (
                                    <Square className="w-5 h-5 text-muted-foreground" />
                                )}
                            </div>
                            {isSelected && (
                                <div className="text-[10px] uppercase font-bold tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded-full mt-1">
                                    Slider: {sideLabel}
                                </div>
                            )}
                        </button>
                    );
                })}
             </div>
          </div>

          {/* Comparison Area (Only show if we have exactly left and right) */}
          {leftImage && rightImage && (
              <>
                {/* Labels Header (Matched to visual slider layout) */}
                <div className="flex justify-between items-center w-full max-w-4xl mx-auto px-4 md:px-0">
                    <div className="flex items-center gap-2 bg-black/30 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                        <span className={`text-sm font-semibold uppercase tracking-widest text-[10px] ${rightImage.color}`}>
                            {rightImage.label}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-black/30 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                        <span className={`text-sm font-semibold uppercase tracking-widest text-[10px] ${leftImage.color}`}>
                            {leftImage.label}
                        </span>
                    </div>
                </div>

                {/* Comparison Slider Container */}
                <div className="relative group w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-border/50 bg-black/40 backdrop-blur-sm p-2 transition-all duration-500 hover:shadow-indigo-500/20 hover:border-indigo-500/30">
                    <div 
                    ref={containerRef}
                    className="relative w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none bg-black"
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    onMouseDown={(e) => handleMove(e.clientX)}
                    onTouchStart={(e) => handleMove(e.touches[0].clientX)}
                    >
                    {/* Left Image (Base) */}
                    <div className="absolute inset-0">
                        <Image
                        src={leftImage.src}
                        alt="Left Compare Image"
                        fill
                        className="object-contain pointer-events-none"
                        unoptimized
                        draggable={false}
                        />
                    </div>

                    {/* Right Image (Overlay) */}
                    <div 
                        className="absolute inset-0"
                        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                    >
                        <div className="absolute inset-0">
                        <Image
                            src={rightImage.src}
                            alt="Right Compare Image"
                            fill
                            className="object-contain pointer-events-none"
                            unoptimized
                            draggable={false}
                        />
                        </div>
                    </div>

                    {/* Enhanced Slider Handle */}
                    <div 
                        className="absolute top-0 bottom-0 w-[2px] z-10"
                        style={{ 
                            left: `${sliderPosition}%`, 
                            transform: 'translateX(-50%)',
                            background: `linear-gradient(to bottom, transparent, #818cf8, transparent)`,
                            boxShadow: '0 0 15px rgba(129,140,248,0.7)'
                        }}
                    >
                        {/* Center knob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl border border-white/40 ring-4 ring-black/10 transition-transform group-hover:scale-110 group-active:scale-95">
                        <MoveHorizontal className={`w-5 h-5 drop-shadow-md text-indigo-200`} />
                        </div>
                    </div>
                    </div>
                </div>
                
                <div className="text-xs text-muted-foreground/60 flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full border border-border/50">
                    <MoveHorizontal className="w-4 h-4" /> 
                    Drag slider to compare selected images.
                </div>
              </>
          )}

        </div>
      </main>
    </div>
  );
}
