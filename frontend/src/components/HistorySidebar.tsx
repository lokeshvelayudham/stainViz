import React from 'react';
import { MessageSquarePlus, Clock, ChevronRight, PanelLeftClose, PanelLeftOpen, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  bfUrl: string;
  heUrl: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onNewChat: () => void;
  isOpen: boolean;
}

export function HistorySidebar({ history, onSelect, onNewChat, isOpen }: HistorySidebarProps) {
  return (
    <div 
        className={`
            ${isOpen ? 'w-64' : 'w-20'} 
            bg-background/80 backdrop-blur-lg h-screen flex flex-col z-20 
            transition-all duration-300 ease-in-out border-r border-border/50
        `}
    >
      
      {/* New Chat Button */}
      <div className="p-4 mt-2 flex justify-center">
        <button 
          onClick={onNewChat}
          className={`
            flex items-center gap-3 bg-secondary/50 hover:bg-secondary text-foreground rounded-full transition-all font-medium text-sm group
            ${isOpen ? 'w-full px-4 py-3' : 'w-12 h-12 justify-center p-0 rounded-full'}
          `}
          title="New Chat"
        >
          <MessageSquarePlus className={`w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors`} />
          {isOpen && <span className="opacity-90">New chat</span>}
        </button>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-border">
        {isOpen && history.length > 0 && (
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">Recent</div>
        )}
        
        {history.length === 0 ? (
          <div className={`text-center text-muted-foreground py-10 text-xs flex flex-col items-center gap-2 opacity-60 ${!isOpen && 'hidden'}`}>
            <Clock className="w-6 h-6" />
            <p>No recent history</p>
          </div>
        ) : (
            history.map((item) => (
              isOpen ? (
                <button 
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-secondary/50 cursor-pointer transition-colors group text-left"
                >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
                        <Image src={item.heUrl} alt="Result" fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm text-foreground truncate w-full">Stain Result</p>
                        <span className="text-[10px] text-muted-foreground">
                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </button>
              ) : (
                 <button 
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="w-full flex justify-center p-2 rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors group"
                    title={item.timestamp.toLocaleTimeString()}
                >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
                        <Image src={item.heUrl} alt="Result" fill className="object-cover" unoptimized />
                    </div>
                </button>
              )
            ))
        )}
      </div>

       {/* ISCT Link */}
       <div className="p-2 border-t border-border/50">
            <Link href="/" className={`
                flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 transition-all group
                ${isOpen ? 'justify-start' : 'justify-center'}
            `}>
                <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400" /> 
                {isOpen && (
                    <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-foreground">ISCT 2026</span>
                        <span className="text-[10px] text-muted-foreground">Dublin Conference</span>
                    </div>
                )}
            </Link>
        </div>

       <div className={`p-4 text-[10px] text-center text-muted-foreground/50 ${!isOpen && 'hidden'}`}>
        StainViz Gen 1.0
      </div>
    </div>
  );
}
