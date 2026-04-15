import type { ScanData, ScanOpts, DnsRecord, SubdomainEntry } from '../types';

interface Props {
  data: ScanData;
  opts: ScanOpts;
  isFallback: boolean;
}

function gradeFromScore(s: number): string {
  if (s >= 90) return 'A';
  if (s >= 80) return 'B';
  if (s >= 65) return 'C';
  if (s >= 50) return 'D';
  return 'F';
}

function gradeColor(g: string): string {
  if (g === 'A') return '#00ff44';
  if (g === 'B') return '#f0cc50';
  if (g === 'C') return '#ff9900';
  return '#ff2200';
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] text-[#c8a832] border-b border-[#4a4430] pb-1 mb-1.5">
      <span className="text-[7px] text-[#8a7020]">▶</span>
      {title}
    </div>
  );
}

function Panel({ children, full }: { children: React.ReactNode; full?: boolean }) {
  return (
    <div
      className={`rounded-[5px] border border-[#4a4430] p-[11px] relative ${full ? 'col-span-2' : ''}`}
      style={{ background: 'linear-gradient(160deg,#2a2818,#141208)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6),inset 0 -1px 0 rgba(200,168,50,0.05),0 1px 0 rgba(200,168,50,0.08)' }}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#0a0908] border border-[#4a4430] rounded-[3px] p-[7px_9px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
      <div className="text-[7px] tracking-[0.18em] text-[#8a7020] mb-0.5">{label}</div>
      <div className="font-['VT323',monospace] text-[17px] text-[#ffaa00]" style={{ fontFamily: "'VT323',monospace", textShadow: '0 0 4px #ff9900' }}>{value}</div>
      {sub && <div className="text-[8px] text-[#4a3c10] mt-0.5">{sub}</div>}
    </div>
  );
}

function DnsRecordsSection({ records }: { records: Record<string, DnsRecord[]> }) {
  const allRecs: DnsRecord[] = [];
  for (const recs of Object.values(records)) {
    if (Array.isArray(recs)) recs.forEach((r) => allRecs.push(r));
  }

  return (
    <Panel full>
      <SectionTitle title="DNS RECORDS" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {['TYPE', 'NAME', 'VALUE', 'TTL'].map((h) => (
                <th key={h} className="text-[7px] tracking-[0.18em] text-[#8a7020] px-1.5 py-[3px] border-b border-[#4a4430] text-left font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRecs.slice(0, 60).map((r, i) => (
              <tr key={i} className="hover:bg-[rgba(200,168,50,0.04)]">
                <td className="px-1.5 py-[2px] border-b border-[rgba(74,68,48,0.3)]">
                  <span className="inline-block px-[5px] py-[1px] rounded-[1px] bg-[rgba(200,168,50,0.12)] border border-[#8a7020] text-[7px] tracking-[0.1em] text-[#c8a832] font-['Orbitron',sans-serif]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {r.type || ''}
                  </span>
                </td>
                <td className="font-['VT323',monospace] text-[13px] text-[#ffaa00] px-1.5 py-[2px] border-b border-[rgba(74,68,48,0.3)]" style={{ fontFamily: "'VT323',monospace", maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(r.name || '').slice(0, 40)}
                </td>
                <td className="font-['VT323',monospace] text-[13px] text-[#ffaa00] px-1.5 py-[2px] border-b border-[rgba(74,68,48,0.3)] break-all" style={{ fontFamily: "'VT323',monospace", maxWidth: 260 }}>
                  {String(r.value || r.data || '').slice(0, 80)}
                </td>
                <td className="font-['VT323',monospace] text-[13px] text-[#ffaa00] px-1.5 py-[2px] border-b border-[rgba(74,68,48,0.3)]" style={{ fontFamily: "'VT323',monospace" }}>
                  {r.ttl ?? r.TTL ?? ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allRecs.length === 0 && <p className="text-[11px] text-[#4a3c10] py-1">No DNS records returned.</p>}
      </div>
    </Panel>
  );
}

function ZoneHealthSection({ health }: { health: NonNullable<ScanData['health']> }) {
  const score = health.score ?? 0;
  const grade = gradeFromScore(score);
  const color = gradeColor(grade);
  const issues = health.issues ?? [];
  const checks = health.checks ?? {};

  return (
    <Panel full>
      <SectionTitle title="ZONE HEALTH ANALYSIS" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <div className="bg-[#0a0908] border border-[#4a4430] rounded-[3px] p-[7px_9px] flex items-center gap-2.5">
          <div className="font-['Orbitron',sans-serif] text-[28px] font-black px-3 py-1 rounded-[2px] border-2 leading-none" style={{ fontFamily: "'Orbitron',sans-serif", color, borderColor: color, textShadow: `0 0 12px ${color}` }}>
            {grade}
          </div>
          <div>
            <div className="text-[7px] tracking-[0.18em] text-[#8a7020] mb-0.5">HEALTH SCORE</div>
            <div className="font-['VT323',monospace] text-[17px] text-[#ffaa00]" style={{ fontFamily: "'VT323',monospace" }}>{score}/100</div>
          </div>
        </div>
        <StatCard
          label="ISSUES FOUND"
          value={issues.length}
          sub={issues.length === 0 ? 'ALL CHECKS PASSED' : issues.slice(0, 2).join(' · ')}
        />
        {Object.entries(checks).slice(0, 4).map(([k, v]) => (
          <StatCard key={k} label={k.toUpperCase().replace(/_/g, ' ')} value={v ? 'PASS ✓' : 'FAIL ✗'} />
        ))}
      </div>
    </Panel>
  );
}

function SubdomainSection({ subdomains }: { subdomains: NonNullable<ScanData['subdomains']> }) {
  const found = subdomains.found ?? [];
  const sslCount = found.filter((s) => typeof s === 'object' && (s.hasSSL || s.ssl)).length;
  const resolvingCount = found.filter((s) => typeof s !== 'object' || s.resolves !== false).length;

  return (
    <Panel full>
      <SectionTitle title="SUBDOMAIN ENUMERATION" />
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <StatCard label="FOUND" value={found.length} />
        <StatCard label="SSL SECURED" value={sslCount} />
        <StatCard label="RESOLVING" value={resolvingCount} />
      </div>
      <div className="flex flex-wrap gap-[5px] max-h-[200px] overflow-y-auto">
        {found.map((s, i) => {
          const name = typeof s === 'string' ? s : (s.subdomain ?? s.name ?? s.hostname ?? JSON.stringify(s));
          const hasSSL = typeof s === 'object' && (s.hasSSL || s.ssl);
          return (
            <div key={i} className="flex items-center gap-1 px-2 py-[3px] bg-[#0a0908] border border-[#4a4430] rounded-[2px] font-['VT323',monospace] text-[13px] text-[#ffaa00]" style={{ fontFamily: "'VT323',monospace" }}>
              <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${hasSSL ? 'bg-[#00ff44] shadow-[0_0_3px_#00ff44]' : 'bg-[#ff2200] shadow-[0_0_3px_#ff2200]'}`} />
              {name}
            </div>
          );
        })}
        {found.length === 0 && <p className="text-[11px] text-[#4a3c10]">No subdomains discovered.</p>}
      </div>
    </Panel>
  );
}

function WhoisSection({ whois }: { whois: NonNullable<ScanData['whois']> }) {
  const fields: [string, string | undefined][] = [
    ['REGISTRAR', whois.registrar],
    ['REGISTERED', whois.creationDate ?? whois.created],
    ['EXPIRES', whois.expirationDate ?? whois.expires],
    ['UPDATED', whois.updatedDate ?? whois.updated],
    ['REGISTRANT', whois.registrantName ?? whois.registrant],
    ['STATUS', Array.isArray(whois.status) ? whois.status[0] : whois.status],
    ['PRIVACY', whois.privacyProtected != null ? (whois.privacyProtected ? 'ENABLED' : 'DISABLED') : undefined],
    ['COUNTRY', whois.registrantCountry ?? whois.country],
  ];

  return (
    <Panel full>
      <SectionTitle title="WHOIS / REGISTRATION DATA" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {fields.filter(([, v]) => v).map(([label, val]) => (
          <StatCard key={label} label={label} value={String(val ?? '').slice(0, 50).toUpperCase()} />
        ))}
      </div>
    </Panel>
  );
}

function PropSection({ propagation }: { propagation: NonNullable<ScanData['propagation']> }) {
  const results = propagation.results ?? [];
  const analysis = propagation.analysis ?? {};
  const propagatedCount = analysis.propagatedCount ?? results.filter((r) => r.propagated ?? r.resolved ?? r.success).length;

  return (
    <Panel full>
      <SectionTitle title="DNS PROPAGATION STATUS" />
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        <StatCard label="PROPAGATED" value={`${propagatedCount}/${results.length}`} />
        <StatCard label="CONSISTENCY" value={analysis.consistent ? 'CONSISTENT' : 'INCONSISTENT'} />
      </div>
      <div className="flex flex-wrap gap-1">
        {results.map((r, i) => {
          const ok = r.propagated ?? r.resolved ?? r.success;
          const color = ok ? '#00ff44' : '#ff2200';
          return (
            <div key={i} className="flex items-center gap-1 px-[7px] py-[3px] bg-[#0a0908] border border-[#4a4430] rounded-[2px] text-[9px] text-[#8a7020]">
              <div className="w-[5px] h-[5px] rounded-full" style={{ background: color, boxShadow: `0 0 3px ${color}` }} />
              {String(r.resolver ?? r.server ?? 'NODE').slice(0, 20)}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export default function ScanResults({ data, opts, isFallback }: Props) {
  const recCount = data.records ? Object.values(data.records).flat().length : 0;
  const subCount = data.subdomains?.found?.length ?? 0;
  const grade = data.health?.score != null ? gradeFromScore(data.health.score) : '—';

  return (
    <div className="px-4 pb-4 space-y-2.5">
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <StatCard label="DOMAIN" value={(data.domain ?? '').toUpperCase().slice(0, 18)} />
        <StatCard label="RECORDS" value={recCount} />
        <StatCard label="SUBDOMAINS" value={subCount > 0 ? subCount : isFallback ? 'N/A' : '—'} />
        <StatCard label="ZONE GRADE" value={grade} />
      </div>

      {data.records && opts.dns && <DnsRecordsSection records={data.records} />}
      {data.health && opts.health && <ZoneHealthSection health={data.health} />}
      {data.subdomains && opts.sub && <SubdomainSection subdomains={data.subdomains} />}
      {data.whois && opts.whois && <WhoisSection whois={data.whois} />}
      {data.propagation && opts.prop && <PropSection propagation={data.propagation} />}

      {isFallback && (
        <p className="text-center text-[8px] tracking-[0.12em] text-[#4a3c10] py-2">
          ⚠ RUNNING IN BROWSER-SIDE FALLBACK MODE — CONNECT TO DNSINFO.LOL BACKEND FOR FULL RESULTS
        </p>
      )}
    </div>
  );
}
