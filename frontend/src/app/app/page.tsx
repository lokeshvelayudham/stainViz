'use client';

import React, { useState } from 'react';
import { Upload } from '../../components/Upload';
import { ImageViewer } from '../../components/ImageViewer';
import { HistorySidebar } from '../../components/HistorySidebar';
import { Menu, Sparkles } from 'lucide-react';

interface HistoryItem {
  id: string;
  bfUrl: string;
  heUrl: string;
  timestamp: Date;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
        const res = await fetch(`${apiUrl}/history`);
        if (res.ok) {
            const data = await res.json();
            // Map API response to HistoryItem
            const mapped = data.map((item: { id: number | string; bf_path: string; he_path: string; timestamp: string }) => ({
                id: item.id.toString(),
                bfUrl: `${apiUrl}${item.bf_path}`,
                heUrl: `${apiUrl}${item.he_path}`,
                timestamp: new Date(item.timestamp)
            }));
            setHistory(mapped);
        }
    } catch (err) {
        console.error("Failed to fetch history", err);
    }
  };

  const handleFileSelect = async (file: File) => {
    // Reset state for new upload
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setResultUrl(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('direction', direction); 

      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate stain');
      }

      const data = await response.json();
      
      // Data contains relative paths e.g. /data/images/...
      const resultObjectUrl = `${apiUrl}${data.he_path}`;
      setResultUrl(resultObjectUrl);

      // Refresh history to get the new item with ID
      fetchHistory();

    } catch (error) {
      console.error("Error generating stain:", error);
      alert("Failed to process image. Make sure backend is running.");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setSelectedFile(null);
    setPreviewUrl(item.bfUrl);
    setResultUrl(item.heUrl);
  };

  const handleNewChat = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      
      {/* Sidebar */}
      <HistorySidebar 
          history={history} 
          onSelect={handleHistorySelect} 
          onNewChat={handleNewChat}
          isOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <header className="h-16 px-4 flex items-center gap-4 z-10 w-full pt-4">
          <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
              <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/stainViz.png" alt="StainViz Logo" className="object-contain" />
            </div>
            <span className="text-xl font-medium tracking-tight bg-clip-text text-transparent bg-[image:var(--image-gemini-gradient)]">
                StainViz
            </span>
            <div className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                Beta
            </div>
          </div>


        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-border">
            <div className="max-w-4xl mx-auto w-full space-y-12 pb-20 pt-8 sm:pt-16">
                
                {/* Intro / Empty State */}
                {!previewUrl && (
                    <div className="flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                        <div className="space-y-2 text-center">
                             <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-foreground/20">
                                Hello, Researcher
                            </h1>
                             <h1 className="text-5xl md:text-6xl font-medium tracking-tight bg-clip-text text-transparent bg-[image:var(--image-gemini-gradient)]">
                                How can I help visualize tissue?
                            </h1>
                        </div>
                        
                         <div className="w-full mt-10">
                             <Upload 
                                onFileSelect={handleFileSelect} 
                                isProcessing={isProcessing} 
                                direction={direction}
                                onDirectionChange={setDirection}
                             />
                        </div>
                    </div>
                )}

                {/* Results View */}
                {previewUrl && (
                     <div className="space-y-6 animate-in fade-in duration-500">
                         {/* User "Prompt" */}
                         <div className="flex gap-4 items-start max-w-3xl mx-auto">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-muted-foreground">U</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium mt-1.5">Processed Image Analysis</p>
                                <div className="rounded-xl overflow-hidden border border-border/50 inline-block">
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img src={previewUrl} alt="Input" className="h-32 object-contain bg-black/5" />
                                </div>
                            </div>
                         </div>

                        {/* Standard separator */}
                        <div className="w-full h-px bg-transparent"></div>

                         {/* AI Response */}
                         <div className="flex gap-4 items-start max-w-3xl mx-auto">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            </div>
                            <div className="space-y-4 w-full">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium mt-1.5 bg-clip-text text-transparent bg-[image:var(--image-gemini-gradient)]">
                                    StainViz Generation
                                  </p>
                                  {resultUrl && (
                                     <a 
                                        href={resultUrl} 
                                        download={`stainviz_${Date.now()}.png`}
                                        className="text-xs text-primary hover:underline hover:text-primary/80 transition-colors"
                                    >
                                        Download Full Resolution
                                    </a>
                                  )}
                                </div>
                                
                                <div className="w-full bg-card rounded-[1.5rem] overflow-hidden border border-border/50 shadow-sm">
                                    <ImageViewer bfUrl={previewUrl} heUrl={resultUrl} />
                                </div>
                                
                                <div className="flex gap-2">
                                     {/* Action Chips */}
                                     {['Regenerate', 'Adjust Contrast', 'Share'].map(action => (
                                         <button key={action} className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                                             {action}
                                         </button>
                                     ))}
                                </div>
                            </div>
                         </div>
                     </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
