import { execa } from 'execa';
import type { Tool } from './tools/registry.js';
import type { ToolRunResult } from './logger.js';

const UPDATE_TIMEOUT_MS = 5 * 60 * 1000;

export async function isInstalled(tool: Tool): Promise<boolean> {
  try {
    const res = await execa(tool.detect, { shell: true, reject: false, timeout: 10_000 });
    return res.exitCode === 0;
  } catch {
    return false;
  }
}

export async function runUpdate(tool: Tool): Promise<ToolRunResult> {
  const started = Date.now();
  try {
    const res = await execa(tool.update, {
      shell: true,
      reject: false,
      timeout: UPDATE_TIMEOUT_MS,
      all: false,
    });
    const ok = res.exitCode === 0;
    let versionAfter: string | undefined;
    if (ok && tool.version) {
      try {
        const v = await execa(tool.version, { shell: true, reject: false, timeout: 15_000 });
        versionAfter = (v.stdout || v.stderr || '').toString();
      } catch {
        // best-effort only
      }
    }
    return {
      id: tool.id,
      label: tool.label,
      ok,
      durationMs: Date.now() - started,
      exitCode: res.exitCode ?? null,
      stdout: (res.stdout ?? '').toString(),
      stderr: (res.stderr ?? '').toString(),
      versionAfter,
    };
  } catch (err: unknown) {
    return {
      id: tool.id,
      label: tool.label,
      ok: false,
      durationMs: Date.now() - started,
      exitCode: null,
      stdout: '',
      stderr: '',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
