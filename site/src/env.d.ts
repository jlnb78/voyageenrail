/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Server-only (no PUBLIC_ prefix on purpose) — long-lived Instagram Graph
   * API token for @voyageenrail. See src/lib/instagram.ts for setup. */
  readonly INSTAGRAM_ACCESS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
