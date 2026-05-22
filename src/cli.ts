import { Command } from 'commander';
import pc from 'picocolors';
import { initCommand } from './commands/init.js';
import { updateCommand } from './commands/update.js';
import { statusCommand } from './commands/status.js';
import { addCommand } from './commands/add.js';
import { frequencyCommand } from './commands/frequency.js';
import { enableCommand, disableCommand } from './commands/enable.js';

const program = new Command();

program
  .name('dobby')
  .description('Background updater for your agentic coding CLIs.')
  .version('0.1.0');

program
  .command('init')
  .description('Interactive onboarding: pick tools and cadence, install the launchd job.')
  .action(async () => {
    await initCommand();
  });

const runFn = async () => {
  const code = await updateCommand();
  if (code !== 0) process.exitCode = code;
};

program.command('update').description('Run the update pass once (this is what launchd invokes).').action(runFn);
program.command('run').description('Alias for `update`.').action(runFn);

program.command('status').description('Show config, last run, next run, and log paths.').action(async () => {
  await statusCommand();
});

program.command('add').description('Edit the list of tools Dobby manages.').action(async () => {
  await addCommand();
});
program.command('remove').description('Alias for `add` (same multi-select).').action(async () => {
  await addCommand();
});

program
  .command('frequency <value>')
  .description('Set how often Dobby runs. value: hourly | daily | weekly.')
  .action(async (value: string) => {
    await frequencyCommand(value);
  });

program.command('enable').description('Load the LaunchAgent.').action(async () => {
  await enableCommand();
});
program.command('disable').description('Unload the LaunchAgent (config kept).').action(async () => {
  await disableCommand();
});

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('User force closed') || msg.includes('ExitPromptError')) {
    console.log(pc.dim('\nCancelled.'));
    process.exit(130);
  }
  console.error(pc.red('Error: ') + msg);
  process.exit(1);
});
