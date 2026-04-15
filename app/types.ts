export interface DnsRecord {
  type: string;
  name: string;
  value?: string;
  data?: string;
  ttl?: number;
  TTL?: number;
}

export interface SubdomainEntry {
  subdomain?: string;
  name?: string;
  hostname?: string;
  hasSSL?: boolean;
  ssl?: boolean;
  resolves?: boolean;
}

export interface HealthData {
  score?: number;
  issues?: string[];
  checks?: Record<string, boolean>;
}

export interface WhoisData {
  registrar?: string;
  creationDate?: string;
  created?: string;
  expirationDate?: string;
  expires?: string;
  updatedDate?: string;
  updated?: string;
  registrantName?: string;
  registrant?: string;
  status?: string | string[];
  privacyProtected?: boolean;
  registrantCountry?: string;
  country?: string;
}

export interface PropResult {
  resolver?: string;
  server?: string;
  propagated?: boolean;
  resolved?: boolean;
  success?: boolean;
}

export interface PropData {
  results?: PropResult[];
  analysis?: { propagatedCount?: number; consistent?: boolean };
}

export interface ScanData {
  success?: boolean;
  domain?: string;
  records?: Record<string, DnsRecord[]>;
  health?: HealthData;
  subdomains?: { found?: (SubdomainEntry | string)[] };
  whois?: WhoisData;
  propagation?: PropData;
  _fallback?: boolean;
}

export interface ScanOpts {
  dns: boolean;
  health: boolean;
  sub: boolean;
  whois: boolean;
  prop: boolean;
  ssl: boolean;
}

export type LedId = 'scan' | 'dns' | 'health' | 'sub' | 'whois' | 'err';
export type LedState = Record<LedId, boolean>;

export type ActiveTab = 'scan' | 'contact' | 'tos';
