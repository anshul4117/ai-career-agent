/**
 * Placeholder token parser helper.
 * This is a structural skeleton and will be completed during Clerk integration.
 */
export function parseToken(token: string): Record<string, unknown> | null {
  if (!token) return null;
  // TODO: Add actual JWT decoding
  return {};
}

/**
 * Validates if a route is in a specific list.
 */
export function isRouteInList(pathname: string, list: readonly string[]): boolean {
  return list.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
