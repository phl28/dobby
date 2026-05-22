import pc from 'picocolors';
import { checkbox } from '@inquirer/prompts';
import { TOOLS } from '../tools/registry.js';
import { isInstalled } from '../runner.js';
import { requireConfig, saveConfig } from '../config.js';

export async function addCommand(): Promise<void> {
  const config = await requireConfig();
  const installedFlags = await Promise.all(TOOLS.map((t) => isInstalled(t)));
  const choices = TOOLS.map((t, i) => ({
    name: `${t.label}${installedFlags[i] ? pc.green('  (installed)') : pc.dim('  (not detected)')}`,
    value: t.id,
    checked: config.selectedTools.includes(t.id),
  }));

  const selectedTools = await checkbox({
    message: 'Pick the tools Dobby should manage',
    choices,
    pageSize: 12,
    loop: false,
  });

  await saveConfig({ ...config, selectedTools });
  console.log(pc.green(`Saved. ${selectedTools.length} tool(s) selected.`));
}
