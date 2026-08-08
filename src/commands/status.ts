import pc from 'picocolors';
import { loadConfig, CONFIG_PATH, LOG_DIR } from '../config.js';
import { findTool } from '../tools/registry.js';
import { getVersion } from '../runner.js';
import { isLoaded, describeNextRun, PLIST_PATH } from '../launchd.js';

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
  console.log('  Plist           ' + pc.dim(PLIST_PATH));
  console.log('');
  console.log(pc.bold('  Tools'));
  if (config.selectedTools.length === 0) {
    console.log(pc.dim('    (none selected)'));
  } else {
    const lastRun = new Map((config.lastRunTools ?? []).map((t) => [t.id, t.ok]));
    const rows = await Promise.all(
      config.selectedTools.map(async (id) => {
        const tool = findTool(id);
        const version = tool ? await getVersion(tool) : null;
        return { id, tool, label: tool?.label ?? id, version };
      }),
    );
    const width = Math.max(...rows.map((r) => r.label.length));
    for (const { id, tool, label, version } of rows) {
      const mark = !tool ? pc.dim('?') : version ? pc.green('✓') : pc.red('✗');
      const versionText = !tool ? pc.dim('not in registry') : version ? pc.dim(version) : pc.dim('not installed');
      const ok = lastRun.get(id);
      const last =
        ok === undefined ? pc.dim('  ·') : ok ? pc.green('  last run ok') : pc.red('  last run failed');
      console.log('    ' + mark + ' ' + label.padEnd(width) + '   ' + versionText + last);
    }
  }
  console.log('');
}
