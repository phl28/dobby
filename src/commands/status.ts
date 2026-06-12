import pc from 'picocolors';
import { loadConfig, CONFIG_PATH, LOG_DIR } from '../config.js';
import { findTool } from '../tools/registry.js';
import { isLoaded, describeNextRun, SCHEDULER_PATH } from '../scheduler.js';

export async function statusCommand(): Promise<void> {
  const config = await loadConfig();
  if (!config) {
    console.log(pc.yellow('No config yet. Run ') + pc.bold('dobby init') + pc.yellow(' to get started.'));
    return;
  }

  const loaded = await isLoaded();

  console.log(pc.bold('\n  Dobby status'));
  console.log(pc.dim('  ────────────'));
  console.log('  Frequency       ' + pc.bold(describeNextRun(config.frequency, config.scheduledHour)));
  console.log(
    '  Scheduler       ' +
      (loaded ? pc.green('loaded') : pc.dim('not loaded')) +
      pc.dim(`  (config: ${config.schedulerEnabled ? 'enabled' : 'disabled'})`),
  );
  console.log('  Last run        ' + (config.lastRun ?? pc.dim('never')) + (config.lastRunStatus ? pc.dim(`  (${config.lastRunStatus})`) : ''));
  console.log('  Config file     ' + pc.dim(CONFIG_PATH));
  console.log('  Log dir         ' + pc.dim(LOG_DIR));
  console.log('  Scheduler cfg   ' + pc.dim(SCHEDULER_PATH));
  console.log('');
  console.log(pc.bold('  Tools'));
  if (config.selectedTools.length === 0) {
    console.log(pc.dim('    (none selected)'));
  } else {
    for (const id of config.selectedTools) {
      const tool = findTool(id);
      console.log('    • ' + (tool?.label ?? id) + pc.dim('   ' + (tool?.update ?? '?')));
    }
  }
  console.log('');
}
