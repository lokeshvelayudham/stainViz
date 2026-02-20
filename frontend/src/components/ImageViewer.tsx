import React from 'react';
import Image from 'next/image';
import { ArrowRight, Download, Maximize2 } from 'lucide-react';

interface ImageViewerProps {
  bfUrl: string | null;
  heUrl: string | null;
}

export function ImageViewer({ bfUrl, heUrl }: ImageViewerProps) {
  if (!bfUrl) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 lg:gap-8 items-center w-full">
        {/* Before */}
        <div className="space-y-3 group">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Input (Brightfield)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">Original</span>
          </div>
          <div className="relative aspect-[4/3] w-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-all">
            <Image 
              src={bfUrl} 
              alt="Brightfield Input" 
              fill 
              className="object-contain p-2"
              unoptimized
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center text-muted-foreground/30 rotate-90 lg:rotate-0">
          <ArrowRight className="w-8 h-8 lg:w-10 lg:h-10 animate-pulse" />
        </div>

        {/* After */}
        <div className="space-y-3 group">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Output (Virtual H&E)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">CycleGAN</span>
          </div>
          <div className="relative aspect-[4/3] w-full bg-card rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm group-hover:shadow-lg group-hover:border-primary/40 transition-all min-h-[300px] flex items-center justify-center">
              {heUrl ? (
                  <Image 
                      src={heUrl} 
                      alt="Virtual H&E Output" 
                      fill 
                      className="object-contain p-2"
                      unoptimized
                  />
              ) : (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground/50">
                      <div className="relative w-16 h-16">
                         <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                         <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
                      </div>
                      <span className="text-sm font-medium animate-pulse">Generating Stain...</span>
                  </div>
              )}
          </div>
        </div>
      </div>

    </div>
  );
}
