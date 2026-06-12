import pc from 'picocolors';
import { checkbox, select, confirm } from '@inquirer/prompts';
import { TOOLS } from '../tools/registry.js';
import { isInstalled } from '../runner.js';
import {
  loadConfig,
  saveConfig,
  ensureDirs,
  DEFAULT_CONFIG,
  type Config,
  type Frequency,
} from '../config.js';
import { reload, bootout, removeFiles, describeNextRun, SCHEDULER_PATH } from '../scheduler.js';
import { BIN_PATH } from '../paths.js';

export async function initCommand(): Promise<void> {
  console.log(pc.bold(pc.cyan('\n  Dobby')) + pc.dim('  background updater for your agentic CLIs\n'));

  await ensureDirs();
  const existing = await loadConfig();
  if (existing) {
    console.log(pc.yellow('A config already exists. Re-running setup will overwrite it.\n'));
  }

  console.log(pc.dim('Detecting installed tools...'));
  const installedFlags = await Promise.all(TOOLS.map((t) => isInstalled(t)));
  const choices = TOOLS.map((t, i) => ({
    name: `${t.label}${installedFlags[i] ? pc.green('  (installed)') : pc.dim('  (not detected)')}`,
    value: t.id,
    checked: installedFlags[i],
  }));

  const selectedTools = await checkbox({
    message: 'Which agentic CLIs should Dobby keep updated?',
    choices,
    pageSize: 12,
    loop: false,
  });

  if (selectedTools.length === 0) {
    console.log(pc.yellow('\nNo tools selected. Exiting without writing config.'));
    return;
  }

  const frequency = (await select({
    message: 'How often should Dobby run?',
    choices: [
      { name: 'Once a day', value: 'daily' },
      { name: 'Once a week (Sunday)', value: 'weekly' },
      { name: 'Once an hour', value: 'hourly' },
    ],
    default: 'daily',
  })) as Frequency;

  const enableNow = await confirm({
    message: 'Enable the background job now?',
    default: true,
  });

  const config: Config = {
    ...DEFAULT_CONFIG,
    selectedTools,
    frequency,
    scheduledHour: 3,
    schedulerEnabled: enableNow,
  };
  await saveConfig(config);

  if (enableNow) {
    await reload({
      frequency,
      scheduledHour: config.scheduledHour,
      binPath: BIN_PATH,
      nodePath: process.execPath,
    });
    console.log(
      '\n' +
        pc.green('Dobby is on duty.') +
        ' Schedule: ' +
        pc.bold(describeNextRun(frequency, config.scheduledHour)),
    );
    console.log(pc.dim(`  Config: ${SCHEDULER_PATH}`));
  } else {
    await bootout();
    await removeFiles();
    console.log(
      '\n' +
        pc.yellow('Config saved but scheduler is disabled.') +
        ' Run ' +
        pc.bold('dobby enable') +
        ' when ready.',
    );
  }

  console.log(pc.dim('\nTry ' + pc.bold('dobby status') + pc.dim(' or ') + pc.bold('dobby run') + pc.dim('.')));
}
