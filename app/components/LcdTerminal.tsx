interface Props {
  lines: string[];
}

export default function LcdTerminal({ lines }: Props) {
  return (
    <div
      className="relative bg-[#0c0800] border-2 border-[#1a1200] rounded-[3px] min-h-[130px] p-[10px_12px] overflow-hidden"
      style={{ boxShadow: 'inset 0 0 24px rgba(0,0,0,0.8), inset 0 0 8px rgba(255,153,0,0.03), 0 2px 0 rgba(200,168,50,0.05)' }}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.1) 0px,rgba(0,0,0,0.1) 1px,transparent 1px,transparent 3px)' }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.5) 100%)' }}
      />
      {lines.map((line, i) => {
        const isGold = line.startsWith('»»');
        const isDim = line.startsWith('━') || line.startsWith('─');
        return (
          <div
            key={i}
            className={`relative z-10 whitespace-pre-wrap break-all font-['VT323',monospace] text-[15px] leading-[1.55] ${
              isGold
                ? 'text-[#f0cc50]' + ' [text-shadow:0_0_6px_#c8a832]'
                : isDim
                ? 'text-[#5a3800]'
                : 'text-[#ffaa00]'
            }`}
            style={{
              fontFamily: "'VT323', monospace",
              color: isGold ? '#f0cc50' : isDim ? '#5a3800' : '#ffaa00',
              textShadow: isGold ? '0 0 6px #c8a832' : isDim ? 'none' : '0 0 5px #ff9900',
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}
