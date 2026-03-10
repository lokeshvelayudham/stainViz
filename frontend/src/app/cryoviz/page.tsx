'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileDown, BrainCircuit, Activity, ChevronRight, Layers, Box, Microchip } from 'lucide-react';

export default function CryoVizDemo() {
  const [step, setStep] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  const maxDimensions = {
    x: 1143,
    y: 457,
    z: 164
  };

  const [coords, setCoords] = useState({
    x: Math.floor(maxDimensions.x / 2),
    y: Math.floor(maxDimensions.y / 2),
    z: Math.floor(maxDimensions.z / 2),
  });

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>, plane: 'xy' | 'xz' | 'yz') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const pctX = Math.max(0, Math.min(1, clickX / rect.width));
    const pctY = Math.max(0, Math.min(1, clickY / rect.height));

    if (plane === 'xy') {
      setCoords(prev => ({ ...prev, x: Math.round(pctX * maxDimensions.x), y: Math.round(pctY * maxDimensions.y) }));
    } else if (plane === 'xz') {
      setCoords(prev => ({ ...prev, x: Math.round(pctX * maxDimensions.x), z: Math.round(pctY * maxDimensions.z) }));
    } else if (plane === 'yz') {
      setCoords(prev => ({ ...prev, y: Math.round(pctX * maxDimensions.y), z: Math.round(pctY * maxDimensions.z) }));
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>, plane: 'xy' | 'xz' | 'yz') => {
    // Scroll through the slices (Z for XY, Y for XZ, X for YZ)
    const delta = e.deltaY > 0 ? 1 : -1;
    if (plane === 'xy') {
      setCoords(prev => ({ ...prev, z: Math.max(0, Math.min(maxDimensions.z, prev.z + delta)) }));
    } else if (plane === 'xz') {
      setCoords(prev => ({ ...prev, y: Math.max(0, Math.min(maxDimensions.y, prev.y + delta)) }));
    } else if (plane === 'yz') {
      setCoords(prev => ({ ...prev, x: Math.max(0, Math.min(maxDimensions.x, prev.x + delta)) }));
    }
  };

  // Step 1: Simulated Upload
  const handleUpload = () => {
    setStep(1); // Uploading state
    
    const messages = [
      'Loading cryo-image slices...',
      'Preparing orthographic views...',
      'Generating volumetric dataset...'
    ];
    let i = 0;
    setLoadingText(messages[0]);
    
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setLoadingText(messages[i]);
      } else {
        clearInterval(interval);
        setStep(2); // Orthographic views ready
      }
    }, 1500);
  };

  // Step 2 & 3: Simulated Processing -> 3D Reconstruction
  const handleNextToProcessing = () => {
    setStep(3); // Processing state
    const messages = [
      'Reconstructing 3D volume...',
      'Running tissue analysis pipeline...',
      'Preparing visualization...'
    ];
    let i = 0;
    setLoadingText(messages[0]);
    
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setLoadingText(messages[i]);
      } else {
        clearInterval(interval);
        setStep(4); // 3D Video + Highlights
        
        // Auto progress to show MSC quantification after a few seconds
        setTimeout(() => {
          setStep(5);
        }, 4000);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-wide text-lg text-white">CryoViz™</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-2">
              BETA
            </span>
          </div>
          <div className="text-sm font-medium text-slate-400">
            AI Imaging Pipeline
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">
            Imaging of a Mouse Liver Injury Model
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            with Qtracker-Labeled MSCs
          </p>
        </div>

        {/* STEP 0: Initial Upload */}
        {step === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
            <button
              onClick={handleUpload}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:ring-offset-[#0a0a0c] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-white/20 to-indigo-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Upload className="w-5 h-5 mr-3" />
              Upload CryoViz Dataset
            </button>
            <p className="mt-4 text-sm text-slate-500">Supported formats: .tiff, .ndpi, .svs, .zarr</p>
          </div>
        )}

        {/* STEP 1 & 3: Loading Screens */}
        {(step === 1 || step === 3) && (
          <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin" />
              <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
              <div className="absolute inset-4 border-b-2 border-blue-500 rounded-full animate-[spin_2s_linear_infinite]" />
              <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-medium text-slate-300 animate-pulse">{loadingText}</h2>
          </div>
        )}

        {/* STEP 2: Orthographic Views */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Orthographic Slices
              </h2>
              <button
                onClick={handleNextToProcessing}
                className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: 'XY Plane (Axial)', 
                  plane: 'xy', 
                  slice: coords.z, 
                  max: maxDimensions.z,
                  crosshairX: (coords.x / maxDimensions.x) * 100,
                  crosshairY: (coords.y / maxDimensions.y) * 100,
                  axisLabel: 'Z',
                  onSliderChange: (v: number) => setCoords(c => ({ ...c, z: v }))
                },
                { 
                  title: 'XZ Plane (Coronal)', 
                  plane: 'xz', 
                  slice: coords.y, 
                  max: maxDimensions.y,
                  crosshairX: (coords.x / maxDimensions.x) * 100,
                  crosshairY: (coords.z / maxDimensions.z) * 100,
                  axisLabel: 'Y',
                  onSliderChange: (v: number) => setCoords(c => ({ ...c, y: v }))
                },
                { 
                  title: 'YZ Plane (Sagittal)', 
                  plane: 'yz', 
                  slice: coords.x, 
                  max: maxDimensions.x,
                  crosshairX: (coords.y / maxDimensions.y) * 100,
                  crosshairY: (coords.z / maxDimensions.z) * 100,
                  axisLabel: 'X',
                  onSliderChange: (v: number) => setCoords(c => ({ ...c, x: v }))
                }
              ].map((view, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden group flex flex-col">
                  <div className="px-4 py-3 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">{view.title}</span>
                    <span className="text-xs text-slate-500 tracking-wider font-mono">
                      {view.axisLabel}: {view.slice} / {view.max}
                    </span>
                  </div>
                  <div 
                    className="relative aspect-square flex items-center justify-center bg-[#111] overflow-hidden cursor-crosshair"
                    onClick={(e) => handleImageClick(e, view.plane as 'xy' | 'xz' | 'yz')}
                    onWheel={(e) => handleWheel(e, view.plane as 'xy' | 'xz' | 'yz')}
                  >
                    {/* Crosshair Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-50 z-10">
                      <div className="absolute top-0 w-[1px] h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" style={{ left: `${view.crosshairX}%` }} />
                      <div className="absolute left-0 w-full h-[1px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" style={{ top: `${view.crosshairY}%` }} />
                    </div>
                    {/* Coordinate Tooltip */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-[10px] text-green-400 px-2 py-1 rounded font-mono pointer-events-none z-20 border border-green-500/20">
                      X:{coords.x} Y:{coords.y} Z:{coords.z}
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`/cryoviz/s367/${view.plane}/${view.slice.toString().padStart(3, '0')}.png`} 
                      alt={view.title} 
                      className="w-full h-full object-contain filter contrast-125 brightness-90 transition-transform duration-700 pointer-events-none"
                    />
                  </div>
                  {/* Slider */}
                  <div className="p-4 bg-black/40 border-t border-white/5 flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 w-8">{view.axisLabel} Pos</span>
                    <input 
                      type="range" 
                      min="0" 
                      max={view.max} 
                      value={view.slice} 
                      onChange={(e) => view.onSliderChange(parseInt(e.target.value))}
                      className="flex-1 accent-indigo-500 bg-white/10 rounded-lg appearance-none h-2 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 & 5: 3D Reconstruction and Quantification */}
        {(step === 4 || step === 5) && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 3D Viewport Simulation */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Box className="w-5 h-5 text-purple-400" />
                    3D CryoViz™ Reconstruction
                  </h2>
                </div>

                <div className="relative aspect-video bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group">
                  
                  <video 
                    src="/cryoviz/Media1.mp4"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90 filter contrast-125"
                  />

                  {/* Organ Highlights Overlay (Visible in step 4 & 5) */}
                  {step >= 4 && (
                    <div className="absolute inset-0 w-full h-full transform-style-3d animate-in fade-in duration-1000 delay-500 z-10">
                        <div className="absolute top-[30%] left-[30%] w-1/4 h-1/4 bg-blue-500/30 rounded-full blur-xl mix-blend-screen animate-pulse" />
                        <div className="absolute top-[40%] left-[45%] w-1/3 h-1/3 bg-orange-500/30 rounded-full blur-xl mix-blend-screen animate-pulse delay-75" />
                        <div className="absolute bottom-[20%] right-[30%] w-1/5 h-1/5 bg-purple-500/30 rounded-full blur-xl mix-blend-screen animate-pulse delay-150" />
                    </div>
                  )}

                  {/* Cell Marker Highlights (Visible in step 5) */}
                  {/* {step === 5 && (
                      <div className="absolute inset-0 w-full h-full transform-style-3d text-red-500 delay-300 z-20">
                          {[...Array(60)].map((_, i) => (
                            <div 
                              key={`cell-${i}`} 
                              className="absolute w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] animate-ping"
                              style={{
                                top: `${Math.random() * 50 + 25}%`,
                                left: `${Math.random() * 50 + 25}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${Math.random() * 1 + 1}s`
                              }}
                            />
                          ))}
                      </div>
                  )} */}
                  
                  {/* Overlays */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur border border-white/10 text-xs font-medium text-slate-300">
                      LIVE RENDER
                    </span>
                    {step >= 4 && (
                      <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 backdrop-blur border border-indigo-500/30 text-xs font-medium text-indigo-300 animate-in fade-in zoom-in">
                        AI Segmentation Active
                      </span>
                    )}
                  </div>
                  
                  {step >= 4 && (
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 animate-in slide-in-from-left fade-in delay-500">
                           <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                           <span className="text-sm font-medium drop-shadow-md">Lung</span>
                         </div>
                         <div className="flex items-center gap-2 animate-in slide-in-from-left fade-in delay-700">
                           <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                           <span className="text-sm font-medium drop-shadow-md">Liver</span>
                         </div>
                         <div className="flex items-center gap-2 animate-in slide-in-from-left fade-in delay-1000">
                           <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                           <span className="text-sm font-medium drop-shadow-md">Spleen</span>
                         </div>
                      </div>

                      {step === 5 && (
                        <div className="flex items-center gap-2 animate-in zoom-in fade-in delay-300">
                          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] animate-pulse" />
                          <span className="text-sm font-medium drop-shadow-md">Qtracker MSCs</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Side Panel: Results & Quantification */}
              <div className="space-y-6">
                 {/* AI Analysis Status */}
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                      <Microchip className="w-5 h-5 text-indigo-400" />
                      Analysis Status
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Tissue Model</span>
                        <span className="font-medium">Mouse Liver Injury</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Resolution</span>
                        <span className="font-medium">High (0.5µm/voxel)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Registration</span>
                        <span className="text-green-400 font-medium tracking-wide">ALIGNED</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Cell Detection</span>
                        {step === 5 ? (
                          <span className="text-indigo-400 font-medium tracking-wide">COMPLETE</span>
                        ) : (
                          <span className="text-amber-400 font-medium tracking-wide animate-pulse">RUNNING...</span>
                        )}
                      </div>
                    </div>
                 </div>

                 {/* Results Panel */}
                 {step === 5 && (
                   <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6 animate-in slide-in-from-right fade-in duration-500">
                      <h3 className="font-semibold text-lg mb-6 text-indigo-100">MSC Distribution</h3>
                      
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm text-slate-300">Lung</span>
                            <span className="font-mono text-blue-400 font-semibold tracking-tight">109,767</span>
                          </div>
                          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[88%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm text-slate-300">Liver</span>
                            <span className="font-mono text-orange-400 font-semibold tracking-tight">15,049</span>
                          </div>
                          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[12%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm text-slate-300">Spleen</span>
                            <span className="font-mono text-purple-400 font-semibold tracking-tight">30</span>
                          </div>
                          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[1%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Total MSC Count</span>
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">124,846</span>
                      </div>
                      
                      <button className="mt-6 w-full flex items-center justify-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                        <FileDown className="w-4 h-4 mr-2" />
                        Export Report
                      </button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global styles for 3D */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-[1000px] { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-x-60 { transform: rotateX(60deg) rotateZ(0deg); }
      `}} />
    </div>
  );
}
