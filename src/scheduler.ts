import * as launchd from './launchd.js';
import * as systemd from './systemd.js';
import type { Frequency } from './config.js';

const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

function impl() {
  if (isMac) return launchd;
  if (isLinux) return systemd;
  throw new Error(
    `Unsupported platform: ${process.platform}. Dobby supports macOS and Linux.`,
  );
}

export type SchedulerInputs = launchd.SchedulerInputs;

export const SCHEDULER_PATH = isMac
  ? launchd.SCHEDULER_PATH
  : isLinux
    ? systemd.SCHEDULER_PATH
    : '';
export const AGENT_SCRIPT_PATH = isMac
  ? launchd.AGENT_SCRIPT_PATH
  : isLinux
    ? systemd.AGENT_SCRIPT_PATH
    : '';

export function reload(input: SchedulerInputs): Promise<void> {
  return impl().reload(input);
}

export function bootout(): Promise<void> {
  return impl().bootout();
}

export function isLoaded(): Promise<boolean> {
  return impl().isLoaded();
}

export function removeFiles(): Promise<void> {
  return impl().removeFiles();
}

export function describeNextRun(freq: Frequency, hour: number): string {
  return impl().describeNextRun(freq, hour);
}
