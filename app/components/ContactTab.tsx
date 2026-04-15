import { useState } from 'react';

export default function ContactTab() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = () => {
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 2500);
    }, 1000);
  };

  return (
    <div className="p-4">
      <div
        className="rounded-[5px] border border-[#4a4430] p-[11px]"
        style={{ background: 'linear-gradient(160deg,#2a2818,#141208)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}
      >
        <div className="text-[7px] font-bold tracking-[0.22em] text-[#8a7020] uppercase text-center mb-2.5 border-b border-[#4a4430] pb-[5px]">
          ── CONTACT TRANSMISSION ──
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
            {[
              { label: 'SENDER DESIGNATION', type: 'text', placeholder: 'YOUR NAME' },
              { label: 'RETURN ADDRESS', type: 'email', placeholder: 'name@domain.com' },
              { label: 'SUBJECT', type: 'text', placeholder: 'INQUIRY TYPE' },
            ].map(({ label, type, placeholder }) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="text-[7px] tracking-[0.18em] text-[#8a7020]">{label}</div>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="bg-[#0a0908] border border-[#4a4430] rounded-[2px] px-2 py-[6px] text-[11px] text-[#f0cc50] font-['Share_Tech_Mono',monospace] outline-none focus:border-[#8a7020] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-[7px] tracking-[0.18em] text-[#8a7020]">MESSAGE BODY</div>
              <textarea
                rows={7}
                placeholder="ENTER MESSAGE..."
                className="bg-[#0a0908] border border-[#4a4430] rounded-[2px] px-2 py-[6px] text-[11px] text-[#f0cc50] font-['Share_Tech_Mono',monospace] outline-none resize-none focus:border-[#8a7020] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={status !== 'idle'}
              className="self-end px-4 py-[6px] border border-[#4a4430] rounded-[3px] text-[10px] tracking-[0.1em] uppercase text-[#c8a832] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all active:translate-y-[2px]"
              style={{ background: 'linear-gradient(180deg,#2e2c20,#0e0c08)', boxShadow: '0 3px 0 #0e0c08,0 4px 0 #050400,inset 0 1px 0 rgba(200,168,50,0.1)', fontFamily: "'Share Tech Mono', monospace" }}
            >
              {status === 'sending' ? 'TRANSMITTING...' : status === 'sent' ? 'SENT ✓' : 'TRANSMIT →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
