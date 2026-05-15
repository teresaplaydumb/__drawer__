import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shuffle, RefreshCcw, Users, Cpu, Zap, Terminal, Activity 
} from 'lucide-react';

const TEAM_A_POOL = ['A-01', 'A-03', 'A-04', 'A-05'];
const ANCHOR_A = 'A-02';
const TEAM_B_POOL = ['B-01', 'B-02'];

type DrawItem = { lane: number; team: string; revealed: boolean };

const ScanlineEffect = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
       style={{ background: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 50%), linear-gradient(90deg, rgba(255,0,0,0.05), rgba(0,255,0,0.02), rgba(0,0,255,0.05))', backgroundSize: '100% 2px, 3px 100%' }} />
);

export default function App() {
  const [state, setState] = useState({ drawing: false, processing: false, revealed: 0 });
  const [results, setResults] = useState<DrawItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (m: string) => setLogs(p => [...p.slice(-3), `> ${m}`]);

  const runDraw = async () => {
    setState({ drawing: true, processing: true, revealed: 0 });
    setLogs(['> INIT DRAW SYSTEM...', '> SEQUESTERING DATA...']);
    
    const seq = [...[...TEAM_A_POOL].sort(() => Math.random() - 0.5), ANCHOR_A, ...[...TEAM_B_POOL].sort(() => Math.random() - 0.5)];
    const initialResults = seq.map((t, i) => ({ lane: i + 1, team: t, revealed: false }));
    setResults(initialResults);

    for (let i = 0; i < seq.length; i++) {
      addLog(`DECODING LANE ${i + 1}...`);
      await new Promise(r => setTimeout(r, 1000));
      setResults(prev => prev.map((it, idx) => idx === i ? { ...it, revealed: true } : it));
      setState(s => ({ ...s, revealed: i + 1 }));
      addLog(`ASSIGNED: ${seq[i]}`);
    }
    setState(s => ({ ...s, processing: false }));
    addLog('DECODING COMPLETE.');
  };

  const reset = () => {
    setResults([]); setState({ drawing: false, processing: false, revealed: 0 }); setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans selection:bg-[#00F0FF] overflow-x-hidden p-4 md:p-8">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#1A1A1C_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2A2C] pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#00F0FF] mb-2 font-mono text-[10px] tracking-[0.3em] font-bold">
              <Cpu className="w-4 h-4 animate-pulse" /> NEURAL DRAW CORE v2.0
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase italic">競賽<span className="text-[#00F0FF]">決賽</span>抽籤機</h1>
          </div>
          <div className="bg-[#1A1A1C] border border-[#2A2A2C] p-3 flex items-center gap-4">
            <div className="text-right text-xs font-mono">
              <div className="text-[10px] text-[#00F0FF] mb-1">SYSTEM STATUS</div>
              <div className="font-bold">OPERATIONAL</div>
            </div>
            <Activity className="text-[#00F0FF] w-8 h-8 opacity-50" />
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#141415] border border-[#2A2A2C] p-4 font-mono text-[11px] h-36 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-[#888] uppercase text-[10px]"><Terminal className="w-3 h-3" /> Process Logs</div>
              {logs.length ? logs.map((l, i) => <div key={i} className={i === logs.length - 1 ? "text-[#00F0FF]" : "opacity-40"}>{l}</div>) : <div className="opacity-20 animate-pulse">SYSTEM STANDBY...</div>}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00F0FF] opacity-30" />
            </div>

            <div className="bg-[#1A1A1B] border border-[#2A2A2C] p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-[#2A2A2C] pb-3 text-xs font-bold tracking-widest uppercase italic"><Users className="w-4 h-4 text-[#00F0FF]" /> 參賽核心數據</div>
              <div className="grid grid-cols-2 gap-4 text-[11px] opacity-60">
                <div className="bg-[#0A0A0B] p-3 border border-[#2A2A2C]">GROUP A: <span className="text-white font-bold italic">05</span></div>
                <div className="bg-[#0A0A0B] p-3 border border-[#2A2A2C]">GROUP B: <span className="text-white font-bold italic">02</span></div>
              </div>
              <div className="mt-4 space-y-2 text-[10px] opacity-50 font-medium whitespace-pre-line tracking-tight leading-relaxed">
                {`• A組優先競賽，隨後B組接續\n• A-02 為A組末位 (第5棒)`}
              </div>
            </div>

            {!state.drawing ? (
              <button onClick={runDraw} className="w-full p-6 bg-[#00F0FF] text-black font-black uppercase tracking-tighter text-xl italic hover:shadow-[4px_4px_0px_white] transition-all flex items-center justify-center gap-3"><Shuffle className="w-6 h-6" /> 啟動 AI 自動抽籤</button>
            ) : (
              state.processing ? (
                <div className="w-full p-6 bg-[#1A1A1B] border border-[#00F0FF]/30 text-[#00F0FF] font-black uppercase text-xl italic text-center animate-pulse">系統解碼中...</div>
              ) : (
                <button onClick={reset} className="w-full p-4 border border-[#2A2A2C] text-[#888] font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2C] hover:text-white transition-all flex items-center justify-center gap-2 tracking-tighter"><RefreshCcw className="w-4 h-4" /> 系統重置</button>
              )
            )}
          </aside>

          <main className="lg:col-span-8">
            <div className="bg-[#141416] border border-[#2A2A2C] min-h-[500px] relative p-6 flex flex-col overflow-hidden">
              <ScanlineEffect />
              <div className="relative z-10 flex items-center justify-between mb-8 border-b border-[#2A2A2C] pb-4">
                <div className="flex items-center gap-3 italic text-xl font-bold uppercase text-[#00F0FF] tracking-tighter"><Zap className="w-4 h-4" /> 棒次分配結果陣列</div>
                <div className="text-[10px] font-mono text-[#888]">{state.revealed} / 7 ASSIGNED</div>
              </div>

              {!state.drawing ? (
                <div className="flex-grow flex flex-col items-center justify-center opacity-20 animate-pulse uppercase font-mono text-xs tracking-[.4em]">AWAITING SYSTEM START</div>
              ) : (
                <div className="space-y-3 relative z-10">
                  {results.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={r.revealed ? { opacity: 1 } : { opacity: 0.4 }}
                      className={`relative flex items-center gap-4 p-4 border transition-colors duration-500 overflow-hidden ${r.revealed ? 'bg-[#1A1A1B] border-[#2A2A2C]' : 'bg-[#0F0F10] border-[#1A1A1B]'}`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center font-black text-2xl italic border-r pr-4 ${r.revealed ? 'text-[#00F0FF] border-[#2A2A2C]' : 'border-transparent text-[#333]'}`}>
                        {(r.lane).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-grow">
                        <div className="text-[9px] font-mono text-[#888] uppercase tracking-[0.2em] mb-1">Vector {r.lane}</div>
                        <div className="flex items-center justify-between">
                          <div className={`text-xl font-bold tracking-tight uppercase italic transition-all duration-700 ${r.revealed ? 'opacity-100' : 'opacity-20 blur-sm'}`}>{r.revealed ? `第 ${r.lane} 棒次` : 'DECODING...'}</div>
                          <AnimatePresence mode="wait">
                            {r.revealed ? (
                              <motion.div key="v" initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} className={`text-3xl font-black italic tracking-tighter ${r.team.startsWith('A') ? 'text-white' : 'text-[#00F0FF]'}`}>
                                {r.team} {r.team === ANCHOR_A && <span className="text-[9px] font-mono ml-2 border border-white/20 px-1 py-0.5 align-middle not-italic opacity-40 uppercase tracking-normal">Anchor</span>}
                              </motion.div>
                            ) : (
                              <div className="w-16 h-8 bg-[#1A1A1C] rounded-sm relative overflow-hidden">
                                <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 w-4 bg-[#2A2A2C] skew-x-12 opacity-50" />
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      {r.revealed && <div className="absolute right-0 inset-y-0 w-1 bg-[#00F0FF]" />}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
        <footer className="mt-12 text-center text-[10px] opacity-20 font-mono tracking-[0.5em]">AI-CORE ENVIRONMENT · {new Date().getFullYear()}</footer>
      </div>
    </div>
  );
}
