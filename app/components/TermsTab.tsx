const TOS_SECTIONS = [
  {
    title: '1. Acceptable Use',
    body: 'DNSINFO.LOL is provided for lawful network intelligence and research purposes only. You may not use this service to facilitate attacks, unauthorized access attempts, or any illegal activity. Results are for informational purposes only.',
  },
  {
    title: '2. Data & Privacy',
    body: 'We do not store the domains you query beyond the immediate session. No personally identifiable information is retained. All lookups are logged anonymously for abuse prevention only.',
  },
  {
    title: '3. Rate Limiting',
    body: 'Free tier usage is subject to rate limiting. Abuse of the API or attempts to circumvent rate limits will result in IP-level blocking without notice.',
  },
  {
    title: '4. Disclaimer',
    body: 'Results are aggregated from public DNS infrastructure and third-party data sources. DNSINFO.LOL makes no warranty regarding completeness or accuracy of results. WHOIS and subdomain data may be incomplete or outdated.',
  },
  {
    title: '5. Limitation of Liability',
    body: 'DNSINFO.LOL and its operators shall not be liable for any damages arising from use or inability to use this service. Use of this service constitutes acceptance of these terms.',
  },
];

export default function TermsTab() {
  return (
    <div className="p-4">
      <div
        className="rounded-[5px] border border-[#4a4430] p-[11px]"
        style={{ background: 'linear-gradient(160deg,#2a2818,#141208)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}
      >
        <div className="text-[7px] font-bold tracking-[0.22em] text-[#8a7020] uppercase text-center mb-2.5 border-b border-[#4a4430] pb-[5px]">
          ── TERMS OF SERVICE ──
        </div>
        <div className="text-[11px] leading-[1.7] text-[#8a7020] max-h-[320px] overflow-y-auto pr-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {TOS_SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <div className="text-[8px] tracking-[0.15em] text-[#c8a832] mt-2.5 mb-1 uppercase">{title}</div>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
