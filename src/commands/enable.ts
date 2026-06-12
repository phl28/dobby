import pc from 'picocolors';
import { requireConfig, saveConfig } from '../config.js';
import { reload, bootout, removeFiles, describeNextRun } from '../scheduler.js';
import { BIN_PATH } from '../paths.js';

export async function enableCommand(): Promise<void> {
  const config = await requireConfig();
  await reload({
    frequency: config.frequency,
    scheduledHour: config.scheduledHour,
    binPath: BIN_PATH,
    nodePath: process.execPath,
  });
  await saveConfig({ ...config, schedulerEnabled: true });
  console.log(
    pc.green('Scheduler enabled. ') + describeNextRun(config.frequency, config.scheduledHour),
  );
}

export async function disableCommand(): Promise<void> {
  const config = await requireConfig();
  await bootout();
  await removeFiles();
  await saveConfig({ ...config, schedulerEnabled: false });
  console.log(pc.yellow('Scheduler disabled. Config preserved.'));
}
