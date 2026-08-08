export type Tool = {
  id: string;
  label: string;
  detect: string;
  update: string;
  version?: string;
};

export const TOOLS: Tool[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    detect: 'command -v claude',
    update: 'claude update',
    version: 'claude -v',
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    detect: 'command -v opencode',
    update: 'opencode upgrade',
    version: 'opencode -v',
  },
  {
    id: 'codex',
    label: 'OpenAI Codex',
    detect: 'command -v codex',
    update: 'npm install -g @openai/codex',
    version: 'codex -V',
  },
  {
    id: 'qwen-code',
    label: 'Qwen Code',
    detect: 'command -v qwen',
    update: 'npm install -g @qwen-code/qwen-code@latest',
    version: 'qwen -v',
  },
  {
    id: 'cursor-cli',
    label: 'Cursor CLI (agent)',
    detect: 'command -v agent || command -v cursor-agent',
    // Prefer `agent update` (the supported path). If the new `agent` binary
    // isn't installed yet (machines that only have the legacy `cursor-agent`),
    // fall back to the official install script.
    update: 'command -v agent >/dev/null && agent update || curl https://cursor.com/install -fsS | bash',
    version: 'agent --version 2>/dev/null || cursor-agent --version',
  },
  {
    id: 'droid',
    label: 'Droid CLI (Factory)',
    detect: 'command -v droid',
    update: 'curl -fsSL https://app.factory.ai/cli | sh',
    version: 'droid -v',
  },
  {
    id: 'amp',
    label: 'Amp Code',
    detect: 'command -v amp',
    update: 'amp update',
    version: 'amp -V',
  },
  {
    id: 'pi',
    label: 'Pi',
    detect: 'command -v pi',
    update: 'pi update',
    version: 'pi -v',
  },
  {
    id: 'herdr',
    label: 'Herdr',
    detect: 'command -v herdr',
    update: 'herdr update',
    version: 'herdr --version',
  },
];

export function findTool(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}
