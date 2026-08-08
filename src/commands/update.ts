import pc from 'picocolors';
import { requireConfig, saveConfig } from '../config.js';
import { findTool } from '../tools/registry.js';
import { runUpdate } from '../runner.js';
import { appendRunLog, type ToolRunResult } from '../logger.js';

export async function updateCommand(): Promise<number> {
  const config = await requireConfig();
  if (config.selectedTools.length === 0) {
    console.log(pc.yellow('No tools selected. Run `dobby add` to choose some.'));
    return 0;
  }

  const results: ToolRunResult[] = [];
  for (const id of config.selectedTools) {
    const tool = findTool(id);
    if (!tool) {
      console.log(pc.yellow(`  skip  ${id} (not in registry)`));
      continue;
    }
    process.stdout.write(pc.dim(`  ... ${tool.label}`));
    const result = await runUpdate(tool);
    results.push(result);
    process.stdout.write(
      '\r' +
        (result.ok ? pc.green('  ok  ') : pc.red('  err ')) +
        tool.label.padEnd(24) +
        pc.dim(`${result.durationMs}ms`) +
        (result.versionAfter
          ? pc.dim('  ' + result.versionAfter.trim().split('\n')[0])
          : '') +
        '\n',
    );
  }

  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.length - okCount;
  const status = failCount === 0 ? 'success' : okCount === 0 ? 'failure' : 'partial';

  const logFile = await appendRunLog(results);
  await saveConfig({
    ...config,
    lastRun: new Date().toISOString(),
    lastRunStatus: status,
    lastRunTools: results.map((r) => ({ id: r.id, label: r.label, ok: r.ok })),
  });

  console.log(
    '\n' +
      (failCount === 0
        ? pc.green(`All ${okCount} tool(s) updated.`)
        : pc.yellow(`${okCount} ok, ${failCount} failed.`)) +
      pc.dim(`  Log: ${logFile}`),
  );

  return failCount === 0 ? 0 : 1;
}
