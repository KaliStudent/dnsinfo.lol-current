'use client';

import '@/index.css';
import { useState, useCallback } from 'react';
import { useScan, isValidDomain } from './useScan';
import StatusLeds from './components/StatusLeds';
import ScanModuleToggles from './components/ScanModuleToggles';
import LcdTerminal from './components/LcdTerminal';
import ScanResults from './components/ScanResults';
import ContactTab from './components/ContactTab';
import TermsTab from './components/TermsTab';
import type { ScanOpts, ActiveTab } from './types';

const INITIAL_OPTS: ScanOpts = { dns: true, health: true, sub: true, whois: true, prop: true, ssl: true };

export default function App() {
  const [domain, setDomain] = useState('');
  const [opts, setOpts] = useState<ScanOpts>(INITIAL_OPTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('scan');
  const [socialOpen, setSocialOpen] = useState(false);
  const { phase, lcdLines, meter, leds, result, isFallback, runScan } = useScan();

  const handleOptChange = useCallback((key: keyof ScanOpts, val: boolean) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleScan = useCallback(() => {
    const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    if (!clean || !isValidDomain(clean)) return;
    runScan(clean, opts);
  }, [domain, opts, runScan]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleScan();
  };

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'scan', label: 'DNS CONSOLE' },
    { id: 'contact', label: 'CONTACT' },
    { id: 'tos', label: 'TERMS' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-[30px] pb-[60px]"
      style={{ background: 'radial-gradient(ellipse at 40% 20%,#1a1608 0%,#080604 70%)', fontFamily: "'Share Tech Mono', monospace", color: '#c8a832' }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&family=Orbitron:wght@400;700;900&display=swap');
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
      @keyframes goldblink{0%,100%{box-shadow:0 5px 0 #0a0800,0 6px 0 #050400,0 8px 14px rgba(0,0,0,0.7),0 0 20px rgba(200,168,50,0.2);}50%{box-shadow:0 5px 0 #0a0800,0 6px 0 #050400,0 8px 14px rgba(0,0,0,0.7),0 0 50px rgba(200,168,50,0.5);}}
      .scan-btn-scanning{animation:goldblink 1.2s ease-in-out infinite!important;}
      .blink-anim{animation:blink 0.7s infinite;}
      `}</style>

      {/* CHASSIS */}
      <div
        className="w-full max-w-[900px] rounded-[10px_10px_6px_6px] border-2 border-[#4a4430] relative"
        style={{ background: 'linear-gradient(160deg,#2e2c20 0%,#1a1810 50%,#0e0c08 100%)', boxShadow: '0 0 0 1px #2a2818,0 8px 0 #0e0c08,0 9px 0 #080604,0 14px 40px rgba(0,0,0,0.9),0 0 60px rgba(200,168,50,0.04),inset 0 1px 0 rgba(200,168,50,0.15)' }}
      >
        {/* Brushed metal overlay */}
        <div className="absolute inset-0 rounded-[10px_10px_6px_6px] pointer-events-none" style={{ background: 'repeating-linear-gradient(92deg,transparent 0px,transparent 3px,rgba(200,168,50,0.012) 3px,rgba(200,168,50,0.012) 4px)' }} />

        {/* Corner rivets */}
        {['top-[7px] left-[7px]', 'top-[7px] right-[7px]', 'bottom-[7px] left-[7px]', 'bottom-[7px] right-[7px]'].map((pos) => (
          <div key={pos} className={`absolute w-[9px] h-[9px] rounded-full ${pos}`} style={{ background: 'radial-gradient(circle at 35% 30%,#3a3828,#0e0c08)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.7),0 1px 0 rgba(200,168,50,0.1)' }} />
        ))}

        {/* Nameplate */}
        <div
          className="mx-5 border-2 border-t-0 border-[#4a4430] px-[18px] py-[7px] flex items-center gap-3 relative"
          style={{ background: 'linear-gradient(180deg,#2a2818,#1a1608)', boxShadow: 'inset 0 -1px 0 rgba(200,168,50,0.1),0 2px 8px rgba(0,0,0,0.5)' }}
        >
          <div className="absolute top-0 left-[10%] right-[10%] h-px opacity-40" style={{ background: 'linear-gradient(90deg,transparent,#c8a832,transparent)' }} />
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, color: '#8a7020' }}>◈</span>
          <div
            className="text-[#f0cc50] font-black tracking-[0.14em]"
            style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(10px,1.8vw,15px)', textShadow: '0 0 20px rgba(200,168,50,0.4),0 1px 0 rgba(0,0,0,0.5)' }}
          >
            DNSINFO.LOL — NETWORK INTELLIGENCE TERMINAL
          </div>
          <div className="ml-auto bg-gradient-to-br from-[#8a7020] to-[#c8a832] px-2 py-[2px] rounded-[2px] text-[8px] tracking-[0.2em] text-black font-bold">
            REV 1.0
          </div>
        </div>

        {/* Status LEDs */}
        <StatusLeds leds={leds} />

        {/* Tabs */}
        <div className="flex gap-0.5 px-5 mt-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-[14px] py-[5px] border border-b-0 rounded-t-[4px] text-[8px] tracking-[0.12em] cursor-pointer transition-all ${
                activeTab === id
                  ? 'border-[#4a4430] text-[#f0cc50]'
                  : 'border-[#4a4430] text-[#8a7020]'
              }`}
              style={{
                background: activeTab === id ? 'linear-gradient(180deg,#2a2818,#141208)' : 'linear-gradient(180deg,#2e2c20,#0e0c08)',
                boxShadow: activeTab === id ? 'inset 0 1px 0 rgba(200,168,50,0.2),0 -1px 0 #c8a832' : 'inset 0 1px 0 rgba(200,168,50,0.08)',
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB: SCAN ── */}
        {activeTab === 'scan' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4">
              {/* Left: Domain input + toggles */}
              <div
                className="rounded-[5px] border border-[#4a4430] p-[11px] relative"
                style={{ background: 'linear-gradient(160deg,#2a2818,#141208)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6),inset 0 -1px 0 rgba(200,168,50,0.05),0 1px 0 rgba(200,168,50,0.08)' }}
              >
                <div className="text-[7px] font-bold tracking-[0.22em] text-[#8a7020] uppercase text-center mb-2.5 border-b border-[#4a4430] pb-[5px]">── TARGET DOMAIN ──</div>
                <div className="flex flex-col gap-2">
                  {/* Domain input */}
                  <div
                    className="relative bg-[#0a0908] border border-[#4a4430] rounded-[3px] overflow-hidden"
                    style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.7),0 1px 0 rgba(200,168,50,0.05)' }}
                  >
                    <span
                      className="absolute top-1/2 left-[10px] -translate-y-1/2 pointer-events-none text-[#8a7020]"
                      style={{ fontFamily: "'VT323',monospace", fontSize: 20, textShadow: '0 0 4px #8a7020' }}
                    >
                      $
                    </span>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="example.com"
                      className="w-full bg-transparent border-none outline-none pl-8 pr-2.5 py-2.5 text-[#ffaa00] caret-[#ffcc44]"
                      style={{ fontFamily: "'VT323',monospace", fontSize: 24, letterSpacing: '0.06em', textShadow: '0 0 8px #ff9900' }}
                    />
                  </div>

                  <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,#4a4430,transparent)' }} />

                  <div className="text-[7px] tracking-[0.18em] text-[#8a7020] mb-1">SCAN MODULES</div>
                  <ScanModuleToggles opts={opts} onChange={handleOptChange} />

                  <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,#4a4430,transparent)' }} />

                  {/* Decorative knobs */}
                  <div className="flex gap-3.5 items-end justify-center py-1">
                    {[{ label: 'DEPTH', rot: -30 }, { label: 'TIMEOUT', rot: 15 }].map(({ label, rot }) => (
                      <div key={label} className="flex flex-col items-center gap-[3px]">
                        <div
                          className="w-9 h-9 rounded-full relative cursor-pointer"
                          style={{ background: 'radial-gradient(circle at 35% 30%,#3a3820,#181610)', border: '2px solid #0a0800', boxShadow: '0 3px 6px rgba(0,0,0,0.6),inset 0 1px 0 rgba(200,168,50,0.08),0 0 0 1px #4a4430', transform: `rotate(${rot}deg)` }}
                        >
                          <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[2px] h-[9px] rounded-[1px]" style={{ background: 'rgba(200,168,50,0.4)' }} />
                        </div>
                        <div className="text-[7px] tracking-[0.12em] text-[#8a7020]">{label}</div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-[3px] p-1 w-9">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[3px] rounded-[1px]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.5),rgba(0,0,0,0.2))', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5)' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Command terminal */}
              <div
                className="rounded-[5px] border border-[#4a4430] p-[11px] relative"
                style={{ background: 'linear-gradient(160deg,#2a2818,#141208)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6),inset 0 -1px 0 rgba(200,168,50,0.05),0 1px 0 rgba(200,168,50,0.08)' }}
              >
                <div className="text-[7px] font-bold tracking-[0.22em] text-[#8a7020] uppercase text-center mb-2.5 border-b border-[#4a4430] pb-[5px]">── COMMAND TERMINAL ──</div>
                <div className="flex flex-col gap-2">
                  {/* Scan button */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-[90px] h-[90px] rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(160deg,#2e2c20,#0e0c08)', border: '2px solid #4a4430', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4),0 2px 4px rgba(0,0,0,0.4),0 0 0 1px rgba(200,168,50,0.1)' }}
                    >
                      <button
                        onClick={handleScan}
                        disabled={phase === 'scanning'}
                        className={`w-[72px] h-[72px] rounded-full border border-[#8a7020] cursor-pointer text-[#f0cc50] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:translate-y-[3px] ${phase === 'scanning' ? 'scan-btn-scanning' : ''}`}
                        style={{
                          fontFamily: "'Orbitron',sans-serif",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          background: phase === 'scanning' ? 'radial-gradient(circle at 35% 30%,#3a2800,#1a1200)' : 'radial-gradient(circle at 35% 30%,#2a2200,#0a0800)',
                          textShadow: '0 0 8px #c8a832',
                          boxShadow: '0 5px 0 #0a0800,0 6px 0 #050400,0 8px 14px rgba(0,0,0,0.7),inset 0 1px 0 rgba(200,168,50,0.15),0 0 20px rgba(200,168,50,0.08)',
                        }}
                      >
                        {phase === 'scanning' ? '...' : 'QUERY'}
                      </button>
                    </div>
                    <div className="text-[7px] tracking-[0.2em] text-[#8a7020]">EXECUTE DNS SCAN</div>
                  </div>

                  <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,#4a4430,transparent)' }} />

                  {/* Progress meter */}
                  <div>
                    <div className="text-[7px] tracking-[0.18em] text-[#8a7020] mb-1">SCAN PROGRESS</div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex-1 h-3 bg-[#0a0908] border border-[#4a4430] rounded-[1px] overflow-hidden relative"
                        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        <div
                          className="h-full transition-[width] duration-[250ms] ease-out relative"
                          style={{
                            width: `${meter}%`,
                            background: 'linear-gradient(90deg,#8a7020,#c8a832,#ffcc44)',
                            boxShadow: '0 0 8px rgba(200,168,50,0.5)',
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{ background: 'repeating-linear-gradient(90deg,transparent 0,transparent 5px,rgba(0,0,0,0.25) 5px,rgba(0,0,0,0.25) 7px)' }}
                          />
                        </div>
                      </div>
                      <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#c8a832', whiteSpace: 'nowrap' }}>
                        {Math.round(meter)}%
                      </div>
                    </div>
                  </div>

                  {/* Quick stats after scan */}
                  {result && (
                    <div className="grid grid-cols-2 gap-[5px] mt-1">
                      {[
                        { label: 'DOMAIN', value: (result.domain ?? '').toUpperCase().slice(0, 14) },
                        { label: 'RECORDS', value: result.records ? Object.values(result.records).flat().length : 0 },
                        { label: 'SUBDOMAINS', value: result.subdomains?.found?.length ?? (isFallback ? 'N/A' : '—') },
                        { label: 'GRADE', value: result.health?.score != null ? (result.health.score >= 90 ? 'A' : result.health.score >= 80 ? 'B' : result.health.score >= 65 ? 'C' : result.health.score >= 50 ? 'D' : 'F') : '—' },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-[#0a0908] border border-[#4a4430] rounded-[3px] px-2 py-[5px]">
                          <div className="text-[7px] tracking-[0.18em] text-[#8a7020]">{label}</div>
                          <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#ffaa00', textShadow: '0 0 4px #ff9900' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* LCD Terminal — full width */}
              <div
                className="col-span-1 sm:col-span-2 rounded-[5px] border border-[#4a4430] p-[11px]"
                style={{ background: 'linear-gradient(160deg,#2a2818,#141208)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}
              >
                <div className="text-[7px] font-bold tracking-[0.22em] text-[#8a7020] uppercase text-center mb-2.5 border-b border-[#4a4430] pb-[5px]">── SYSTEM OUTPUT ──</div>
                <LcdTerminal lines={lcdLines} />
              </div>
            </div>

            {/* Results */}
            {result && (
              <ScanResults data={result} opts={opts} isFallback={isFallback} />
            )}
          </>
        )}

        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'tos' && <TermsTab />}
      </div>

      {/* Footer */}
      <div
        className="w-full max-w-[900px] px-5 py-2 border-2 border-t-0 border-[#4a4430] rounded-b-[8px] flex items-center justify-between flex-wrap gap-2 relative"
        style={{ background: 'linear-gradient(180deg,#0e0c08,#080604)', boxShadow: '0 5px 0 #050400,0 7px 16px rgba(0,0,0,0.7)' }}
      >
        <div className="absolute top-0 left-[8%] right-[8%] h-px opacity-20" style={{ background: 'linear-gradient(90deg,transparent,rgba(200,168,50,0.2),transparent)' }} />
        <div className="flex flex-wrap gap-2 items-center text-[7px] tracking-[0.12em] text-[#4a3c10]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          <span>© 2026 DNSINFO.LOL</span>
          <span>·</span>
          <button onClick={() => setActiveTab('tos')} className="text-[#8a7020] cursor-pointer hover:text-[#c8a832] bg-transparent border-none p-0" style={{ fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit' }}>TERMS OF SERVICE</button>
          <span>·</span>
          <button onClick={() => setActiveTab('contact')} className="text-[#8a7020] cursor-pointer hover:text-[#c8a832] bg-transparent border-none p-0" style={{ fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit' }}>CONTACT</button>
          <span>·</span>
          <span>USA / GLOBAL</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSocialOpen((v) => !v)}
            className="px-[7px] py-[3px] border border-[#4a4430] rounded-[2px] text-[7px] tracking-[0.1em] text-[#c8a832] cursor-pointer"
            style={{ background: 'linear-gradient(180deg,#2e2c20,#0e0c08)', boxShadow: '0 2px 0 #0e0c08', fontFamily: "'Share Tech Mono', monospace" }}
          >
            {socialOpen ? 'SHARE ◀' : 'SHARE ▶'}
          </button>
          {socialOpen && (
            <div className="flex gap-[3px]">
              {['𝕏', '📸', 'in', '🎵', '👽', '✉'].map((icon, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-[2px] flex items-center justify-center text-[10px] cursor-pointer"
                  style={{ background: 'linear-gradient(160deg,#2e2c20,#0e0c08)', border: '1px solid #4a4430', boxShadow: '0 2px 0 #0e0c08' }}
                >
                  {icon}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
