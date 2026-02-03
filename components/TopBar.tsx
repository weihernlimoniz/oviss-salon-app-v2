
import React from 'react';
import { SHOP_NAME } from '../constants';

interface TopBarProps {
  onNotificationClick: () => void;
  unreadCount: number;
}

const TopBar: React.FC<TopBarProps> = ({ onNotificationClick, unreadCount }) => {
  return (
    <div 
      className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 flex items-center justify-between fixed top-0 left-0 right-0 mx-auto w-full max-w-md z-30"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        height: 'calc(4rem + env(safe-area-inset-top))' 
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-zinc-950 font-black text-sm">O</span>
        </div>
        <span className="font-black text-lg tracking-tight uppercase text-zinc-900">{SHOP_NAME}</span>
      </div>
      
      <button 
        onClick={onNotificationClick}
        className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default TopBar;
