
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { HeroVisual, BallotBoxAnimation, PartyLogo3D } from './components/ThreeDScene';
import Dashboard from './components/Dashboard';
import { Language, VotingStage, PoliticalParty } from './types';
import { TRANSLATIONS, PARTIES } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Fingerprint, Lock, Eye, EyeOff,
  CheckCircle2, Download, Info, AlertTriangle, ChevronRight, Activity,
  Globe, Smartphone, Shield, History, RefreshCw, Vote, ArrowLeft
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [stage, setStage] = useState<VotingStage>(VotingStage.LANDING);
  const [voterId, setVoterId] = useState('');
  const [voterIdVisible, setVoterIdVisible] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [selectedParty, setSelectedParty] = useState<PoliticalParty | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (stage === VotingStage.CONFIRMING) {
      const timer = setTimeout(() => {
        setStage(VotingStage.SUCCESS);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const startVerify = () => setStage(VotingStage.VERIFY);
  
  const validateVoter = () => {
    if (voterId.length === 10) {
      setLoading(true);
      setLoadingText("Searching National Database...");
      setTimeout(() => setLoadingText("Verifying Biometric Hash..."), 1000);
      setTimeout(() => {
        setLoading(false);
        setStage(VotingStage.OTP);
        setResendTimer(30);
      }, 2500);
    }
  };

  const handleOtp = (index: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const verifyOtp = () => {
    if (otp.every(v => v !== '')) {
      setLoading(true);
      setLoadingText("Decrypting Private Key...");
      setTimeout(() => {
        setLoading(false);
        setStage(VotingStage.BALLOT);
      }, 1500);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
    }
  };

  // Generic Detail Page Component
  const DetailPage = ({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto py-12"
    >
      <button 
        onClick={() => setStage(VotingStage.LANDING)}
        className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Overview
      </button>
      <div className="glass p-12 rounded-[3rem] space-y-8">
        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500">
          {icon}
        </div>
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="text-xl text-slate-400 leading-relaxed">
          {content}
        </p>
        <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold mb-2">Security Protocol</h4>
            <p className="text-sm text-slate-500">TLS 1.3 Encryption, Zero-Knowledge Proof, AES-256 Storage</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Availability</h4>
            <p className="text-sm text-slate-500">7 Provinces, 77 Districts, International verified IP ranges</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-red-500/30">
      <Header lang={lang} setLang={setLang} onGoHome={() => setStage(VotingStage.LANDING)} />

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* LANDING STAGE */}
          {stage === VotingStage.LANDING && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold"
                  >
                    <ShieldCheck size={16} />
                    <span>General Election 2025</span>
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">
                      {t.heroTitle}
                    </span>
                  </h1>
                  <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                    {t.heroSub}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={startVerify}
                      className="group relative px-8 py-4 bg-red-600 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:bg-red-700 active:scale-95 shadow-xl shadow-red-900/30"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {t.startVoting} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                    <button 
                      onClick={() => setStage(VotingStage.RESULTS)}
                      className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
                    >
                      {t.exploreResults}
                    </button>
                  </div>
                </div>
                <HeroVisual />
              </div>

              {/* How it Works Section */}
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">{t.howItWorks}</h2>
                  <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: <Fingerprint />, title: t.step1, desc: t.step1Desc, stage: VotingStage.DETAIL_IDENTIFY },
                    { icon: <Smartphone />, title: t.step2, desc: t.step2Desc, stage: VotingStage.DETAIL_AUTHENTICATE },
                    { icon: <Globe />, title: t.step3, desc: t.step3Desc, stage: VotingStage.DETAIL_VOTE },
                    { icon: <Shield />, title: t.step4, desc: t.step4Desc, stage: VotingStage.DETAIL_SECURE },
                  ].map((step, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -10, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                      onClick={() => setStage(step.stage)}
                      className="glass p-8 rounded-3xl border-white/5 transition-all text-center cursor-pointer group"
                    >
                      <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{step.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                      <div className="mt-4 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Learn More →</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Live Status Ticker */}
              <div className="glass p-8 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                  <Activity className="text-red-500 animate-pulse" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center divide-x divide-white/5">
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white">84%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Digital Participation</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white">12.8M</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Verified Identites</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white">0s</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Transaction Delay</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DETAIL PAGES */}
          {stage === VotingStage.DETAIL_IDENTIFY && (
            <DetailPage title={t.step1} content={t.identifyDetails} icon={<Fingerprint size={40} />} />
          )}
          {stage === VotingStage.DETAIL_AUTHENTICATE && (
            <DetailPage title={t.step2} content={t.authenticateDetails} icon={<Smartphone size={40} />} />
          )}
          {stage === VotingStage.DETAIL_VOTE && (
            <DetailPage title={t.step3} content={t.voteDetails} icon={<Globe size={40} />} />
          )}
          {stage === VotingStage.DETAIL_SECURE && (
            <DetailPage title={t.step4} content={t.secureDetails} icon={<Shield size={40} />} />
          )}

          {/* VERIFY STAGE */}
          {stage === VotingStage.VERIFY && (
            <motion.div 
              key="verify"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto py-12"
            >
              <div className="glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-white/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl -z-10" />
                {loading ? (
                   <div className="space-y-10 py-10">
                      <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Activity className="text-blue-500 animate-spin" size={40} />
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-white/5 rounded-full w-3/4 mx-auto animate-pulse" />
                        <div className="h-3 bg-white/5 rounded-full w-1/2 mx-auto animate-pulse" />
                      </div>
                      <p className="text-center font-mono text-sm text-blue-400">{loadingText}</p>
                   </div>
                ) : (
                  <>
                    <div className="mb-8 text-center">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Fingerprint className="text-blue-500" size={32} />
                      </div>
                      <h2 className="text-3xl font-bold mb-2">{t.verifyTitle}</h2>
                      <p className="text-slate-400">{t.enterVoterId}</p>
                    </div>
                    <div className="space-y-6">
                      <div className="relative">
                        <input 
                          type={voterIdVisible ? "text" : "password"}
                          maxLength={10}
                          value={voterId}
                          onChange={(e) => setVoterId(e.target.value.replace(/\D/g, ''))}
                          placeholder={t.idPlaceholder}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-2xl tracking-[0.2em] font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-700 pr-16"
                        />
                        <button 
                          onClick={() => setVoterIdVisible(!voterIdVisible)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {voterIdVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <button 
                        disabled={voterId.length !== 10}
                        onClick={validateVoter}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                      >
                        {t.validate} <ChevronRight size={20} />
                      </button>
                      <button 
                        onClick={() => setStage(VotingStage.LANDING)}
                        className="w-full py-3 text-slate-500 hover:text-white transition-colors text-sm font-medium"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* OTP STAGE */}
          {stage === VotingStage.OTP && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto py-12"
            >
              <div className="glass p-10 rounded-[2.5rem] shadow-2xl relative">
                {loading ? (
                  <div className="py-12 space-y-6 text-center">
                    <RefreshCw className="mx-auto text-red-500 animate-spin" size={48} />
                    <p className="font-mono text-sm text-red-400">{loadingText}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 text-center">
                      <h2 className="text-3xl font-bold mb-2">{t.otpTitle}</h2>
                      <p className="text-slate-400 text-sm">{t.otpSub}</p>
                    </div>
                    <div className="flex justify-between gap-2 mb-8">
                      {otp.map((digit, i) => (
                        <input 
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtp(i, e.target.value)}
                          className="w-12 h-16 md:w-16 md:h-20 bg-slate-900/50 border border-white/10 rounded-2xl text-center text-3xl font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        />
                      ))}
                    </div>
                    <div className="space-y-4">
                      <button 
                        disabled={otp.some(v => v === '')}
                        onClick={verifyOtp}
                        className="w-full py-5 bg-red-600 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all disabled:opacity-50"
                      >
                        {t.verifyOtp}
                      </button>
                      <button 
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0}
                        className="w-full py-3 text-sm font-bold text-blue-400 disabled:text-slate-600 transition-colors flex items-center justify-center gap-2"
                      >
                        {resendTimer > 0 ? `${t.wait} (${resendTimer}s)` : t.resendOtp}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* BALLOT STAGE */}
          {stage === VotingStage.BALLOT && (
            <motion.div 
              key="ballot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-black mb-4 tracking-tight">{t.ballotTitle}</h2>
                <p className="text-slate-400">{t.ballotSub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {PARTIES.map((party) => (
                  <motion.div 
                    key={party.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedParty(party)}
                    className={`cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all group relative overflow-hidden ${
                      selectedParty?.id === party.id 
                        ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10' 
                        : 'border-white/5 glass hover:border-white/20'
                    }`}
                  >
                    {selectedParty?.id === party.id && (
                      <motion.div 
                        layoutId="active-bg"
                        className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none"
                      />
                    )}
                    <div className="flex flex-col items-center gap-4 mb-6 relative z-10 text-center">
                      <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                        <PartyLogo3D type={party.symbol} color={party.color} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white leading-tight">
                          {lang === Language.EN ? party.nameEn : party.nameNe}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mt-1">Certified Political Entity</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed relative z-10 text-center">
                      {lang === Language.EN ? party.descriptionEn : party.descriptionNe}
                    </p>
                    <div className="flex justify-center relative z-10">
                       <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                         selectedParty?.id === party.id ? 'bg-red-500 border-red-500 scale-110' : 'border-white/20'
                       }`}>
                         {selectedParty?.id === party.id && <CheckCircle2 size={20} className="text-white" />}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {selectedParty && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-10 inset-x-0 flex justify-center z-50 px-6"
                  >
                    <button 
                      onClick={() => setStage(VotingStage.CONFIRMING)}
                      className="w-full max-w-xl py-5 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl font-bold text-xl shadow-2xl shadow-red-950/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <Lock size={20} /> {t.confirmVote}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* CONFIRMING / ANIMATION STAGE */}
          {stage === VotingStage.CONFIRMING && (
            <motion.div 
              key="confirming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8 py-10"
            >
              <div className="max-w-md mx-auto">
                <div className="glass p-12 rounded-[3rem] border-red-500/30">
                  <BallotBoxAnimation />
                  <h3 className="text-2xl font-bold mb-4">Finalizing 2025 Transaction...</h3>
                  <div className="flex flex-col gap-2 items-center text-sm text-slate-500 font-mono">
                    <span className="flex items-center gap-2">
                      <Lock size={14} className="text-blue-500" /> AES-256 Encryption
                    </span>
                    <span className="flex items-center gap-2">
                       <Shield size={14} className="text-green-500" /> Proof-of-Work Verification
                    </span>
                  </div>
                  <div className="mt-8 w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,20,60,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUCCESS STAGE */}
          {stage === VotingStage.SUCCESS && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto py-12 text-center"
            >
              <div className="glass p-12 rounded-[3rem] border-green-500/20 shadow-2xl shadow-green-900/10">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h2 className="text-5xl font-black mb-4">{t.successTitle}</h2>
                <p className="text-slate-400 text-lg mb-10">{t.successSub}</p>
                
                <div className="glass bg-slate-900/40 p-6 rounded-2xl mb-10 text-left space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Blockchain Receipt ID</span>
                    <span className="text-xs text-blue-400 font-mono">0x2025...fE9D</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Certified Timestamp</span>
                    <span className="text-xs text-white">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Network Verification</span>
                    <span className="text-xs text-green-500 font-bold">IMMUTABLE</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                    <Download size={20} /> {t.receiptBtn}
                  </button>
                  <button 
                    onClick={() => setStage(VotingStage.RESULTS)}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
                  >
                    {t.exploreResults}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS DASHBOARD */}
          {stage === VotingStage.RESULTS && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black mb-2">{t.resultsTitle}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-500 font-bold uppercase tracking-wider">{t.integrityStatus}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                   <div className="glass px-6 py-4 rounded-2xl text-center min-w-[120px]">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">2025 Total Votes</p>
                      <p className="text-2xl font-black">12.8M</p>
                   </div>
                   <div className="glass px-6 py-4 rounded-2xl text-center min-w-[120px] bg-red-600/10 border-red-500/20">
                      <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest mb-1">Live Turnout</p>
                      <p className="text-2xl font-black text-red-500">71.2%</p>
                   </div>
                </div>
              </div>

              <Dashboard />

              <div className="p-8 rounded-[3rem] glass bg-gradient-to-br from-blue-600/5 to-red-600/5 border border-white/10 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center flex-shrink-0">
                  <History className="text-blue-500" size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white italic">"Modern Elections, Timeless Values."</h4>
                  <p className="text-slate-400 max-w-2xl">
                    Our 2025 platform features Zero-Knowledge Proof (ZKP) technology, ensuring that your identity is never linked to your selection in the public ledger. 
                    Decentralized nodes are running across all 7 provinces.
                  </p>
                </div>
                <div className="flex-shrink-0 ml-auto">
                   <button className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/10">Audit Log</button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-lg">
                <Vote size={18} className="text-white" />
             </div>
             <span className="font-bold tracking-tighter text-slate-200">MATDAAN 2025</span>
          </div>
          <div className="flex gap-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
             <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
             <a href="#" className="hover:text-blue-400 transition-colors">Commission</a>
             <a href="#" className="hover:text-blue-400 transition-colors">Security</a>
             <a href="#" className="hover:text-blue-400 transition-colors">Help</a>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/5">
             <AlertTriangle size={14} className="text-yellow-500" />
             <span className="text-[10px] font-bold text-slate-500 tracking-tight">SECURE GOVERNMENT DOMAIN</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
