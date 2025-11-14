#!/usr/bin/env bun
/*  Programming → Trending → Top N (default 10, includes "Others")
    Outputs JSON like:
    [
      {"rank":1,"model":"Grok Code Fast 1","by":"x-ai","tokens":"913B","percent":"48.7%","link":"https://openrouter.ai/models/x-ai/grok-code-fast-1"},
      ...
    ]

    Usage:
      bun models.ts > programming-trending.json

    Optional env:
      URL="https://openrouter.ai/rankings?category=programming&view=trending&_rsc=2nz0s"
      CATEGORY=programming
      N=10
      DEBUG=1           # diagnostics to stderr
      SAVE_HTML=1       # write ./openrouter-ranking-raw.html
*/

const defaultUrl =
  "https://openrouter.ai/rankings?category=programming&view=trending&_rsc=2nz0s";

const url = process.env.URL ?? defaultUrl;
const desiredCategory = (process.env.CATEGORY ?? "programming").toLowerCase();
const N = Number(process.env.N ?? "10");
const DEBUG = process.env.DEBUG === "1";
const SAVE_HTML = process.env.SAVE_HTML === "1";

type SeriesPoint = { x: string; ys: Record<string, number> };

// ---------- small helpers ----------

function humanTokensProgramming(n: number): string {
  const B = 1_000_000_000;
  const b = n / B;
  // Matches page: ≥100B show integer; otherwise one decimal
  if (b >= 100) return `${Math.round(b)}B`;
  return `${b.toFixed(1).replace(/\.0$/, "")}B`;
}
function pct1(v: number): string {
  return `${v.toFixed(1).replace(/\.0$/, "")}%`;
}
function providerOf(slug: string): string {
  if (slug === "Others") return "--";
  const i = slug.indexOf("/");
  return i === -1 ? "" : slug.slice(0, i);
}
function linkFor(slug: string): string | null {
  if (slug === "Others") return null;
  return `https://openrouter.ai/models/${slug}`;
}
function displayFromSlug(slug: string): string {
  // Pretty names for known entries (fallback makes readable titles)
  const MAP: Record<string, string> = {
    "x-ai/grok-code-fast-1": "Grok Code Fast 1",
    "anthropic/claude-4.5-sonnet-20250929": "Claude Sonnet 4.5",
    "minimax/minimax-m2": "MiniMax M2",
    "anthropic/claude-4-sonnet-20250522": "Claude Sonnet 4",
    "z-ai/glm-4.6": "GLM 4.6",
    "google/gemini-2.5-flash": "Gemini 2.5 Flash",
    "qwen/qwen3-vl-235b-a22b-instruct": "Qwen3 VL 235B A22B Instruct",
    "qwen/qwen3-coder-480b-a35b-07-25": "Qwen3 Coder 480B A35B",
    "qwen/qwen3-coder-480b-a35b": "Qwen3 Coder 480B A35B",
    "google/gemini-2.5-pro": "Gemini 2.5 Pro",
    Others: "Others",
  };
  if (MAP[slug]) return MAP[slug];
  if (slug === "Others") return "Others";
  // Fallback: title-case the tail, drop trailing date-stamps like -20250929
  const tail = slug.includes("/") ? slug.split("/")[1] : slug;
  const cleaned = tail.replace(/-\d{6,}$/, "");
  return cleaned
    .split("-")
    .map((w) =>
      /^(ai|vl|pro|flash|sonnet|coder)$/i.test(w)
        ? w.toUpperCase().replace("PRO", "Pro")
        : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");
}

function findAll(text: string, needle: string): number[] {
  const out: number[] = [];
  let from = 0;
  while (true) {
    const i = text.indexOf(needle, from);
    if (i === -1) break;
    out.push(i);
    from = i + needle.length;
  }
  return out;
}
function findStringBounds(html: string, at: number) {
  // Find the surrounding JS string (unescaped quotes) around a position
  let left = at;
  while (left > 0) {
    if (html[left] === '"' && html[left - 1] !== "\\") break;
    left--;
  }
  let right = at;
  while (right < html.length - 1) {
    if (html[right] === '"' && html[right - 1] !== "\\") break;
    right++;
  }
  return { left, right };
}
function jsonUnescape(s: string): string {
  return JSON.parse(`"${s}"`);
}
function extractArrayWithBrackets(s: string, start: number): { text: string; end: number } | null {
  const open = s.indexOf("[", start);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    const ch = s[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return { text: s.slice(open, i + 1), end: i + 1 };
    }
  }
  return null;
}

// Parse a decoded RSC string for all {"data":[...]} arrays of {x,ys}
function extractSeriesArrays(decoded: string): SeriesPoint[][] {
  const arrays: SeriesPoint[][] = [];
  let idx = 0;
  while (true) {
    const hit = decoded.indexOf('"data":[', idx);
    if (hit === -1) break;
    const arrTxt = extractArrayWithBrackets(decoded, hit);
    if (!arrTxt) break;
    try {
      const arr = JSON.parse(arrTxt.text);
      if (Array.isArray(arr) && arr.length && arr[0]?.x && arr[0]?.ys) {
        arrays.push(arr as SeriesPoint[]);
      }
    } catch {
      // ignore this block
    }
    idx = arrTxt.end;
  }
  return arrays;
}

// Choose array by latest x-date
function chooseLatestSeries(seriesSets: SeriesPoint[][]): SeriesPoint[] | null {
  if (!seriesSets.length) return null;
  const key = (s: SeriesPoint[]) => (s.length ? s[s.length - 1].x : "");
  return seriesSets.sort((a, b) => key(b).localeCompare(key(a)))[0];
}

async function main() {
  const res = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
  });
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}`);
    console.log("[]");
    process.exit(1);
  }
  const html = await res.text();
  if (SAVE_HTML) await Bun.write("openrouter-ranking-raw.html", html);

  // 1) Primary: find the RSC string nearest to the desired category anchor
  const catAnchors = [
    `"type":"${desiredCategory}"`,
    `\\"type\\":\\"${desiredCategory}\\"`,
    `category=${desiredCategory}`,
    `"categorySlug":"${desiredCategory}"`,
    `\\"categorySlug\\":\\"${desiredCategory}\\"`,
  ];
  const hits: { pos: number; decoded: string }[] = [];
  for (const pat of catAnchors) {
    const positions = findAll(html, pat);
    for (const pos of positions) {
      const { left, right } = findStringBounds(html, pos);
      if (!(left > 0 && right > left)) continue;
      try {
        const decoded = jsonUnescape(html.slice(left + 1, right));
        hits.push({ pos: left, decoded });
      } catch {
        // skip
      }
    }
  }

  // 2) Extract series arrays from those decoded strings
  let series: SeriesPoint[] | null = null;
  const candidateSets: SeriesPoint[][] = [];
  for (const h of hits) {
    const sets = extractSeriesArrays(h.decoded);
    for (const s of sets) candidateSets.push(s);
  }
  series = chooseLatestSeries(candidateSets);

  // 3) Fallback: if none found, scan ALL escaped \"ys\":{ blocks
  if (!series) {
    const ysEsc = findAll(html, '\\"ys\\":{');
    for (const p of ysEsc) {
      const { left, right } = findStringBounds(html, p);
      if (!(left > 0 && right > left)) continue;
      try {
        const decoded = jsonUnescape(html.slice(left + 1, right));
        const sets = extractSeriesArrays(decoded);
        for (const s of sets) candidateSets.push(s);
      } catch {}
    }
    series = chooseLatestSeries(candidateSets);
  }

  if (!series || !series.length) {
    if (DEBUG) console.error("No series arrays found.");
    console.log("[]");
    return;
  }

  // Latest date bucket
  const latest = series[series.length - 1];
  const ys = latest.ys as Record<string, number>;

  // Sort by tokens desc; top N
  const entries = Object.entries(ys).sort((a, b) => b[1] - a[1]).slice(0, N);

  const total = Object.values(ys).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0) || 1;

  const out = entries.map(([slug, tok], i) => ({
    rank: i + 1,
    model: displayFromSlug(slug),
    by: providerOf(slug),
    tokens: humanTokensProgramming(tok),
    percent: pct1((tok / total) * 100),
    link: linkFor(slug),
  }));

  // JSON only to stdout
  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  if (DEBUG) console.error(String(err?.stack || err));
  console.log("[]");
  process.exit(1);
});