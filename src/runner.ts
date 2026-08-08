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

export async function getVersion(tool: Tool): Promise<string | null> {
  if (!tool.version) return null;
  try {
    const res = await execa(tool.version, { shell: true, reject: false, timeout: 15_000 });
    if (res.exitCode !== 0) return null;
    const out = (res.stdout || res.stderr || '').toString().trim().split('\n')[0];
    return out || null;
  } catch {
    return null;
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
    const versionAfter = ok ? (await getVersion(tool)) ?? undefined : undefined;
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
