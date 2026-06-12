import pc from 'picocolors';
import { requireConfig, saveConfig, type Frequency } from '../config.js';
import { reload, describeNextRun } from '../scheduler.js';
import { BIN_PATH } from '../paths.js';

const VALID: Frequency[] = ['hourly', 'daily', 'weekly'];

export async function frequencyCommand(value: string): Promise<void> {
  if (!VALID.includes(value as Frequency)) {
    console.error(pc.red(`Invalid frequency "${value}". Use one of: ${VALID.join(', ')}.`));
    process.exitCode = 1;
    return;
  }
  const config = await requireConfig();
  const next = { ...config, frequency: value as Frequency };
  await saveConfig(next);

  if (next.schedulerEnabled) {
    await reload({
      frequency: next.frequency,
      scheduledHour: next.scheduledHour,
      binPath: BIN_PATH,
      nodePath: process.execPath,
    });
  }
  console.log(
    pc.green('Frequency updated. ') +
      'Now: ' +
      pc.bold(describeNextRun(next.frequency, next.scheduledHour)),
  );
}
