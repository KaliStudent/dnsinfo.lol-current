import type { ScanOpts } from '../types';

interface Props {
  opts: ScanOpts;
  onChange: (key: keyof ScanOpts, val: boolean) => void;
}

const MODULES: { key: keyof ScanOpts; label: string }[] = [
  { key: 'dns', label: 'DNS RECORDS' },
  { key: 'health', label: 'ZONE HEALTH' },
  { key: 'sub', label: 'SUBDOMAINS' },
  { key: 'whois', label: 'WHOIS' },
  { key: 'prop', label: 'PROPAGATION' },
  { key: 'ssl', label: 'SSL CHECK' },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative w-[44px] h-[20px] bg-[#0a0908] border border-[#4a4430] rounded-[2px] cursor-pointer shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] flex-shrink-0"
    >
      <div
        className="absolute top-[2px] h-[16px] w-[16px] bg-gradient-to-br from-[#2e2c20] to-[#0e0c08] border border-[#4a4430] rounded-[1px] shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition-[left] duration-[120ms]"
        style={{ left: on ? 'calc(100% - 18px)' : '2px' }}
      />
      <div
        className={`absolute top-1/2 right-[4px] -translate-y-1/2 w-[5px] h-[5px] rounded-full transition-all duration-150 ${on ? 'bg-[#f0cc50] shadow-[0_0_4px_#f0cc50]' : 'bg-[#ff2200] shadow-[0_0_3px_#ff2200]'}`}
      />
    </div>
  );
}

export default function ScanModuleToggles({ opts, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {MODULES.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between gap-1.5">
          <span className="text-[8px] tracking-[0.12em] text-[#8a7020]">{label}</span>
          <Toggle on={opts[key]} onClick={() => onChange(key, !opts[key])} />
        </div>
      ))}
    </div>
  );
}
