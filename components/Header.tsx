
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
    <nav className="fixed top-0 w-full z-50 glass py-4 px-6 md:px-12 flex justify-between items-center border-b border-white/5">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onGoHome}
      >
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-900/40">
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
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-sm font-medium hover:border-blue-500/50"
        >
          <Languages size={18} className="text-blue-400" />
          <span>{lang === Language.EN ? 'नेपाली' : 'English'}</span>
        </button>
      </div>
    </nav>
  );
};

export default Header;
