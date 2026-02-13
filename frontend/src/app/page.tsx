'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, Calendar, MapPin, Sparkles } from 'lucide-react';

export default function ISCTLanding() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold text-lg tracking-tight">StainViz</span>
        </div>
        <Link href="/app" className="text-sm font-medium bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-full transition-colors flex items-center gap-2">
           Try App <ArrowLeft className="w-4 h-4 rotate-180" /> 
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground/80 mx-auto backdrop-blur-md shadow-sm hover:bg-secondary/80 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Showcasing at ISCT 2026
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-[1.1] pb-2 drop-shadow-sm">
                The Future of <br />
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Staining</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                Experience AI-powered histology. Convert Brightfield scans to high-fidelity H&E stains instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
                <Link href="/app" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-indigo-500/25">
                    <span className="mr-2">Try StainViz</span>
                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-20" />
                </Link>
                <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="text-foreground/80 hover:text-foreground font-medium px-6 py-3 rounded-full hover:bg-secondary/50 transition-all border border-transparent hover:border-border/50">
                    Join Waitlist
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-foreground/70 pt-8 border-t border-border/30 mt-8">
                <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-lg border border-border/50">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>May 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-lg border border-border/50">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Dublin, Ireland</span>
                </div>
            </div>

            {/* Signup Form */}
            <div className="w-full max-w-md mx-auto mt-12">
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-left">
                            <h3 className="text-xl font-semibold mb-2 text-center">Join the Waitlist</h3>
                            <p className="text-sm text-muted-foreground mb-6 text-center">Get early API access and product updates.</p>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-secondary/50 border border-border focus:border-primary/50 rounded-lg px-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground/50"
                                    placeholder="Dr. Jane Doe"
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-secondary/50 border border-border focus:border-primary/50 rounded-lg px-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground/50"
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground ml-1">Organization</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-secondary/50 border border-border focus:border-primary/50 rounded-lg px-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground/50"
                                    placeholder="University / Lab"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Join Waitlist <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold">You're on the list!</h3>
                            <p className="text-muted-foreground text-center">
                                Thank you for your interest. We'll be in touch with updates leading up to ISCT 2026.
                            </p>
                            <button 
                                onClick={() => setSubmitted(false)}
                                className="text-primary text-sm font-medium hover:underline mt-4"
                            >
                                Register another person
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
            {/* 3D App Mockup */}
            <div className="relative w-full max-w-5xl mt-20 perspective-[2000px] group">
                <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 shadow-2xl transition-all duration-500 [transform:rotateX(20deg)] group-hover:[transform:rotateX(5deg)] overflow-hidden">
                     {/* Window Controls */}
                     <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                     </div>
                     
                     {/* Mock Interface */}
                     <div className="mt-8 flex gap-4 h-[400px] overflow-hidden p-4 bg-black/40">
                         {/* Sidebar Mock */}
                         <div className="w-16 h-full bg-white/5 rounded-lg flex flex-col items-center gap-4 py-4">
                             <div className="w-8 h-8 rounded-full bg-indigo-500/30" />
                             <div className="w-8 h-8 rounded-lg bg-white/5" />
                             <div className="w-8 h-8 rounded-lg bg-white/5" />
                         </div>
                         {/* Main Content Mock */}
                         <div className="flex-1 flex gap-4">
                             <div className="flex-1 h-full bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                                <div className="text-center space-y-2 opacity-50">
                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 mx-auto" />
                                    <div className="text-xs">Input Brightfield</div>
                                </div>
                             </div>
                             <div className="w-12 h-full flex items-center justify-center text-white/20">
                                 <ArrowLeft className="w-6 h-6 rotate-180 animate-pulse" />
                             </div>
                             <div className="flex-1 h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl border border-indigo-500/20 flex items-center justify-center relative shadow-inner shadow-indigo-500/10">
                                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                 <div className="text-center space-y-2">
                                     <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-spin-slow" />
                                     <div className="text-xs font-medium text-indigo-300">Virtual H&E Result</div>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
                {/* Glow behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/30 blur-[100px] -z-10" />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24 text-left">
                {[
                    { title: 'Bi-Directional', desc: <span>Convert Brightfield ↔ H&E with a single click using HybridGAN<sup>tm</sup>.</span>, icon: <ArrowLeft className="w-5 h-5 rotate-45" /> },
                    { title: 'Zero Stain Costs', desc: 'Generate virtual stains instantly without chemical reagents.', icon: <Sparkles className="w-5 h-5" /> },
                    { title: 'Secure & Private', desc: 'Processing runs in isolated containers. Your data is never trained on.', icon: <CheckCircle className="w-5 h-5" /> }
                ].map((feature, i) => (
                    <div key={i} className="group p-6 rounded-2xl bg-secondary/20 border border-white/5 hover:bg-secondary/40 transition-colors hover:border-indigo-500/30">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                ))}
            </div>

      </main>

      <footer className="p-6 text-center text-xs text-muted-foreground">
        © 2026 StainViz. Presented at ISCT Dublin.
      </footer>
    </div>
  );
}
