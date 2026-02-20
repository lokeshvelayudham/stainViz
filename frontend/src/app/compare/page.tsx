'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MoveHorizontal, Sparkles } from 'lucide-react';

export default function ComparePage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.buttons !== 1) return; // Only if mouse is pressed
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

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
        
        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Evaluate <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">StainViz</span> Accuracy
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Drag the slider to compare the authentic ground truth against our CycleGAN AI generated virtual H&E stain.
              </p>
          </div>

          {/* Labels */}
          <div className="flex justify-between items-center w-full max-w-4xl mx-auto px-4 md:px-0">
             <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest text-[10px]">Ground Truth</span>
             </div>
             <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                 <span className="text-sm font-semibold text-purple-400 uppercase tracking-widest text-[10px]">AI Inferred</span>
                 <div className="w-2 h-2 rounded-full bg-purple-500" />
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
            >
              {/* Ground Truth Image (Base) */}
              <div className="absolute inset-0">
                <Image
                  src="/1.png"
                  alt="Ground Truth"
                  fill
                  className="object-contain pointer-events-none"
                  unoptimized
                  draggable={false}
                />
              </div>

              {/* AI Inferred Image (Overlay) */}
              <div 
                className="absolute inset-0"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <div className="absolute inset-0">
                  <Image
                    src="/2.png"
                    alt="AI Inferred"
                    fill
                    className="object-contain pointer-events-none"
                    unoptimized
                    draggable={false}
                  />
                </div>
              </div>

              {/* Enhanced Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,0.7)] z-10 transition-transform duration-75"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              >
                {/* Center knob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl border border-white/40 ring-4 ring-black/10 transition-transform group-hover:scale-110">
                  <MoveHorizontal className="w-5 h-5 drop-shadow-md" />
                </div>
                {/* Sparkle effects on handle */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1 h-8 bg-white/50 blur-[2px]" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-1 h-8 bg-white/50 blur-[2px]" />
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground/60 flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full border border-border/50">
             <MoveHorizontal className="w-4 h-4" /> 
             Interactive comparison interface. Click and drag to evaluate model performance.
          </div>
          
        </div>
      </main>
    </div>
  );
}
