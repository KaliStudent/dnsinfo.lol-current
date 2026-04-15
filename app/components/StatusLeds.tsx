import type { LedState } from '../types';

interface Props {
  leds: LedState;
}

type LedConfig = {
  id: keyof LedState;
  label: string;
};

const LED_ITEMS: LedConfig[] = [
  { id: 'scan', label: 'SCANNING' },
  { id: 'dns', label: 'DNS' },
  { id: 'health', label: 'ZONE HEALTH' },
  { id: 'sub', label: 'SUBDOMAINS' },
  { id: 'whois', label: 'WHOIS' },
  { id: 'err', label: 'ERROR' },
];

function getLedStyle(id: keyof LedState, on: boolean): string {
  if (!on) return 'w-[9px] h-[9px] rounded-full bg-[#1a0800] shadow-[0_0_0_1px_rgba(0,0,0,0.4)]';
  if (id === 'scan') return 'w-[9px] h-[9px] rounded-full bg-[#ffaa00] shadow-[0_0_6px_#ffaa00,0_0_0_1px_rgba(0,0,0,0.4)] animate-[blink_0.7s_infinite]';
  if (id === 'err') return 'w-[9px] h-[9px] rounded-full bg-[#ff2200] shadow-[0_0_6px_#ff2200,0_0_0_1px_rgba(0,0,0,0.4)] animate-[blink_0.7s_infinite]';
  return 'w-[9px] h-[9px] rounded-full bg-[#f0cc50] shadow-[0_0_8px_#f0cc50,0_0_0_1px_rgba(0,0,0,0.4)]';
}

export default function StatusLeds({ leds }: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-[6px] bg-black/40 border-b border-[#4a4430]">
      {/* Power LED always on */}
      <div className="flex items-center gap-[5px]">
        <div className="w-[9px] h-[9px] rounded-full bg-[#f0cc50] shadow-[0_0_8px_#f0cc50,0_0_0_1px_rgba(0,0,0,0.4)]" />
        <span className="text-[7px] tracking-[0.18em] text-[#8a7020]">ONLINE</span>
      </div>
      {LED_ITEMS.map(({ id, label }) => (
        <div key={id} className="flex items-center gap-[5px]">
          <div className={getLedStyle(id, leds[id])} />
          <span className="text-[7px] tracking-[0.18em] text-[#8a7020]">{label}</span>
        </div>
      ))}
    </div>
  );
}
