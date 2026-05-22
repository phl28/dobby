import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { LOG_DIR, ensureDirs } from './config.js';

export type ToolRunResult = {
  id: string;
  label: string;
  ok: boolean;
  durationMs: number;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  versionAfter?: string;
  error?: string;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function appendRunLog(results: ToolRunResult[]): Promise<string> {
  await ensureDirs();
  const filename = path.join(LOG_DIR, `${today()}.log`);
  const stamp = new Date().toISOString();
  const lines: string[] = [];
  lines.push('=' .repeat(60));
  lines.push(`[${stamp}] dobby update run`);
  for (const r of results) {
    lines.push(
      `  ${r.ok ? 'OK ' : 'ERR'}  ${r.label.padEnd(22)} ${r.durationMs}ms` +
        (r.versionAfter ? `  ${r.versionAfter.trim().split('\n')[0]}` : '') +
        (r.error ? `  error: ${r.error}` : ''),
    );
  }
  lines.push('');
  for (const r of results) {
    if (r.ok && !r.stderr) continue;
    lines.push(`--- ${r.id} ---`);
    if (r.stdout) lines.push(r.stdout.trimEnd());
    if (r.stderr) lines.push('[stderr] ' + r.stderr.trimEnd());
    lines.push('');
  }
  await fs.appendFile(filename, lines.join('\n') + '\n', 'utf8');
  return filename;
}
