import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

export type Frequency = 'hourly' | 'daily' | 'weekly';

export type Config = {
  version: 1;
  selectedTools: string[];
  frequency: Frequency;
  scheduledHour: number;
  schedulerEnabled: boolean;
  lastRun?: string;
  lastRunStatus?: 'success' | 'partial' | 'failure';
  lastRunTools?: { id: string; label: string; ok: boolean }[];
};

export const CONFIG_DIR = path.join(os.homedir(), '.config', 'dobby');
export const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
export const LOG_DIR = path.join(CONFIG_DIR, 'logs');

export const DEFAULT_CONFIG: Config = {
  version: 1,
  selectedTools: [],
  frequency: 'daily',
  scheduledHour: 3,
  schedulerEnabled: false,
};

export async function ensureDirs(): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.mkdir(LOG_DIR, { recursive: true });
}

export async function loadConfig(): Promise<Config | null> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<Config>;
    return { ...DEFAULT_CONFIG, ...parsed } as Config;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await ensureDirs();
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

export async function requireConfig(): Promise<Config> {
  const cfg = await loadConfig();
  if (!cfg) {
    throw new Error(
      `No config found at ${CONFIG_PATH}. Run \`dobby init\` first.`,
    );
  }
  return cfg;
}
