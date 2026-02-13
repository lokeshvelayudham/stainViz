import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, Sparkles, MoveRight } from 'lucide-react';

interface UploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  direction: "AtoB" | "BtoA";
  onDirectionChange: (dir: "AtoB" | "BtoA") => void;
}

export function Upload({ onFileSelect, isProcessing, direction, onDirectionChange }: UploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  const isBtoA = direction === "BtoA";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        {/* Toggle Pills - Floating */}
        <div className="flex justify-center">
            <div className="bg-secondary/40 backdrop-blur-sm p-1.5 rounded-full inline-flex items-center relative border border-white/10 shadow-sm">
                <button
                    onClick={() => onDirectionChange("AtoB")}
                    className={`relative z-10 px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${!isBtoA ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                >
                    Brightfield Model
                </button>
                <div className="px-2 text-muted-foreground/40">
                    <MoveRight className="w-4 h-4" />
                </div>
                <button
                    onClick={() => onDirectionChange("BtoA")}
                    className={`relative z-10 px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${isBtoA ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                >
                    H&E Model
                </button>
            </div>
        </div>

        {/* Prompt Input / Drop Zone */}
        <div
            className={`
                relative group rounded-[2rem] transition-all duration-300 ease-in-out
                ${dragActive 
                ? "bg-primary/5 ring-2 ring-primary scale-[1.01]" 
                : "bg-secondary/30 hover:bg-secondary/50"
                }
                ${isProcessing ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}
                min-h-[200px] flex flex-col justify-between p-6 border border-transparent hover:border-border/50
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                onChange={handleChange}
                accept="image/*"
                disabled={isProcessing}
            />

            {/* Input Area Look */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                {isProcessing ? (
                    <div className="space-y-4">
                        <div className="relative w-12 h-12 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary/50 border-b-primary/20 border-l-primary/10 animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <p className="text-lg font-medium bg-clip-text text-transparent bg-[image:var(--image-gemini-gradient)] animate-pulse">
                            Generating stain...
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-2xl bg-background shadow-sm flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                             <ImageIcon className="w-6 h-6" />
                        </div>
                        <p className="text-xl md:text-2xl text-foreground/80 font-medium">
                            {isBtoA ? "Generate Brightfield from H&E" : "Generate H&E from Brightfield"}
                        </p>
                        <p className="text-muted-foreground/70 max-w-md">
                            Upload an image to start high-resolution virtual staining
                        </p>
                    </>
                )}
            </div>

            {/* Bottom Bar Actions */}
            {!isProcessing && (
                <div className="flex items-center justify-between pt-4 border-t border-border/10">
                    <div className="flex gap-2">
                        <span className="p-2 rounded-full hover:bg-background/50 transition-colors text-muted-foreground cursor-pointer">
                            <UploadCloud className="w-5 h-5" />
                        </span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
                        HybridGAN v1.0
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
