import * as dns from "dns";
import { URL } from "url";

export class SsrfSecurityException extends Error {
  constructor(message: string) {
    super(`SSRF Security Violation: ${message}`);
    this.name = "SsrfSecurityException";
  }
}

export function isPrivateIp(ip: string): boolean {
  // IPv4 checks
  if (ip === "0.0.0.0" || ip === "255.255.255.255") return true;

  // 127.0.0.0/8 (Loopback)
  if (ip.startsWith("127.")) return true;

  // 10.0.0.0/8 (Private)
  if (ip.startsWith("10.")) return true;

  // 169.254.0.0/16 (Link-local / Cloud Metadata 169.254.169.254)
  if (ip.startsWith("169.254.")) return true;

  // 192.168.0.0/16 (Private)
  if (ip.startsWith("192.168.")) return true;

  // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
  const parts = ip.split(".").map(Number);
  if (parts.length === 4) {
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
      return true;
    }
  }

  // IPv6 checks
  const ipLower = ip.toLowerCase();
  if (ipLower === "::1" || ipLower === "::") return true;
  if (ipLower.startsWith("fc") || ipLower.startsWith("fd")) return true; // Unique Local Address
  if (ipLower.startsWith("fe80:")) return true; // Link-local IPv6

  return false;
}

export async function validateSafeUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  } catch {
    throw new SsrfSecurityException(`Invalid URL format: ${rawUrl}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new SsrfSecurityException(`Prohibited protocol: ${parsed.protocol}`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block obvious internal names
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan")
  ) {
    throw new SsrfSecurityException(`Blocked internal hostname: ${hostname}`);
  }

  // If hostname is directly an IP, verify immediately
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(":")) {
    if (isPrivateIp(hostname)) {
      throw new SsrfSecurityException(
        `Blocked private IP address: ${hostname}`,
      );
    }
  }

  // DNS Lookup to verify resolved IP is not private (guards against DNS rebinding)
  try {
    const lookup = await dns.promises.lookup(hostname);
    if (isPrivateIp(lookup.address)) {
      throw new SsrfSecurityException(
        `Hostname [${hostname}] resolved to prohibited private IP: ${lookup.address}`,
      );
    }
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityException) throw err;
    throw new SsrfSecurityException(
      `DNS resolution failed for [${hostname}]: ${(err as Error).message}`,
    );
  }

  return parsed;
}
