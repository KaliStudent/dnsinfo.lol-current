import { useState, useRef, useCallback } from 'react';
import type { ScanData, ScanOpts, LedState } from './types';

export type ScanPhase = 'idle' | 'scanning' | 'done' | 'error';

const INITIAL_LEDS: LedState = { scan: false, dns: false, health: false, sub: false, whois: false, err: false };

export function isValidDomain(d: string): boolean {
  return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(d.trim());
}

function gradeFromScore(s: number): string {
  if (s >= 90) return 'A';
  if (s >= 80) return 'B';
  if (s >= 65) return 'C';
  if (s >= 50) return 'D';
  return 'F';
}

async function dohFallback(domain: string): Promise<ScanData> {
  const types = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA'];
  const records: Record<string, { type: string; name: string; value: string; ttl: number }[]> = {};
  await Promise.all(
    types.map(async (t) => {
      try {
        const r = await fetch(
          `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${t}`,
          { headers: { Accept: 'application/dns-json' } },
        );
        const j = await r.json();
        if (j.Answer && j.Answer.length) {
          records[t] = j.Answer.map((a: { name: string; data: string; TTL: number }) => ({
            type: t,
            name: a.name,
            value: a.data,
            ttl: a.TTL,
          }));
        }
      } catch {
        // silent
      }
    }),
  );
  return { success: true, domain, records, _fallback: true };
}

export function useScan() {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [lcdLines, setLcdLines] = useState<string[]>([
    '»» DNSINFO.LOL — NETWORK INTELLIGENCE TERMINAL v1.0',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '» ENTER TARGET DOMAIN IN INPUT MODULE',
    '» TOGGLE SCAN MODULES AS NEEDED',
    '» PRESS [QUERY] OR HIT ENTER TO SCAN',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'SYSTEM: READY — AWAITING TARGET█',
  ]);
  const [meter, setMeter] = useState(0);
  const [leds, setLeds] = useState<LedState>(INITIAL_LEDS);
  const [result, setResult] = useState<ScanData | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const meterRef = useRef(0);

  const setLed = useCallback((id: keyof LedState, on: boolean) => {
    setLeds((prev) => ({ ...prev, [id]: on }));
  }, []);

  const animateMeter = useCallback(async (to: number, ms: number): Promise<void> => {
    const start = meterRef.current;
    const steps = Math.max(1, Math.round(ms / 16));
    const delta = (to - start) / steps;
    return new Promise((resolve) => {
      let count = 0;
      const iv = setInterval(() => {
        count++;
        const next = Math.min(start + delta * count, to);
        meterRef.current = next;
        setMeter(next);
        if (count >= steps) {
          clearInterval(iv);
          resolve();
        }
      }, 16);
    });
  }, []);

  const runScan = useCallback(
    async (domain: string, opts: ScanOpts) => {
      if (phase === 'scanning') return;
      setPhase('scanning');
      setResult(null);
      setIsFallback(false);
      meterRef.current = 0;
      setMeter(0);
      setLeds(INITIAL_LEDS);
      setLed('scan', true);

      const params = new URLSearchParams({
        subdomains: opts.sub ? 'true' : 'false',
        whois: opts.whois ? 'true' : 'false',
        propagation: opts.prop ? 'true' : 'false',
      });

      setLcdLines([
        `»» SCAN INITIATED: ${domain.toUpperCase()}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '» ESTABLISHING DNS LINK...',
        `» MODULES: ${Object.entries(opts).filter(([, v]) => v).map(([k]) => k.toUpperCase()).join(' · ')}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'STATUS: QUERYING█',
      ]);

      await animateMeter(20, 400);

      try {
        let data: ScanData;
        let fallback = false;

        try {
          setLcdLines([
            `»» QUERYING: ${domain.toUpperCase()}`,
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '» [■■■░░░░░░░] DNS RECORDS...',
            '» [■░░░░░░░░░] ZONE HEALTH...',
            '» [░░░░░░░░░░] SUBDOMAINS...',
            '» [░░░░░░░░░░] WHOIS...',
            'STATUS: IN PROGRESS█',
          ]);
          await animateMeter(45, 600);

          const res = await fetch(`/api/scan/${encodeURIComponent(domain)}?${params}`, {
            signal: AbortSignal.timeout(15000),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = await res.json();
        } catch {
          setLcdLines([
            `»» API OFFLINE — FALLBACK MODE`,
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '» USING CLOUDFLARE DOH RESOLVER',
            `» TARGET: ${domain.toUpperCase()}`,
            '» QUERYING RECORD TYPES...',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            'STATUS: BROWSER-SIDE LOOKUP█',
          ]);
          await animateMeter(50, 500);
          data = await dohFallback(domain);
          fallback = true;
        }

        await animateMeter(100, 300);

        const recCount = data.records ? Object.values(data.records).flat().length : 0;
        const subCount = data.subdomains?.found?.length ?? 0;
        const grade = data.health?.score != null ? gradeFromScore(data.health.score) : fallback ? 'N/A' : '—';

        setLcdLines([
          `»» SCAN COMPLETE: ${domain.toUpperCase()}`,
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          `» DNS RECORDS: ${recCount} found`,
          `» ZONE HEALTH: Grade ${grade}`,
          `» SUBDOMAINS:  ${subCount > 0 ? subCount : fallback ? 'N/A (fallback)' : '0'} discovered`,
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'STATUS: DATA READY — SEE RESULTS BELOW█',
        ]);

        if (data.records) setLed('dns', true);
        if (data.health) setLed('health', true);
        if (data.subdomains?.found?.length) setLed('sub', true);
        if (data.whois) setLed('whois', true);

        setResult(data);
        setIsFallback(fallback);
        setPhase('done');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message.slice(0, 50) : 'Unknown error';
        setLcdLines([
          '»» SCAN FAILED',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          `» ERROR: ${msg}`,
          '» CHECK DOMAIN AND TRY AGAIN',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'STATUS: ERROR█',
        ]);
        setLed('err', true);
        setTimeout(() => setLed('err', false), 3000);
        setPhase('error');
      } finally {
        setLed('scan', false);
      }
    },
    [phase, animateMeter, setLed],
  );

  return { phase, lcdLines, meter, leds, result, isFallback, runScan };
}
