
import React from 'react';
import { Language } from '../types';
import { Vote, Languages } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, onGoHome }) => {
  return (
    <nav className="fixed top-0 w-full z-50 glass py-4 px-6 md:px-12 flex justify-between items-center border-b border-white/5" role="navigation" aria-label="Main Navigation">
      <div 
        className="flex items-center gap-2 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
        onClick={onGoHome}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onGoHome()}
        aria-label="Go to Home"
      >
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-900/40" aria-hidden="true">
          <Vote className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">MATDAAN</h1>
          <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Nepal Digital Vote 2025</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setLang(lang === Language.EN ? Language.NE : Language.EN)}
          aria-label={lang === Language.EN ? "नेपाली भाषामा परिवर्तन गर्नुहोस्" : "Switch to English"}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-sm font-medium hover:border-blue-500/50"
        >
          <Languages size={18} className="text-blue-400" aria-hidden="true" />
          <span>{lang === Language.EN ? 'नेपाली' : 'English'}</span>
        </button>
      </div>
    </nav>
  );
};

export default Header;
