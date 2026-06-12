# Dobby

Background updater for your agentic coding CLIs. Like the house-elf, Dobby quietly keeps things ready while you sleep.

Picks a list of tools (Claude Code, OpenCode, Codex, Gemini CLI, Cursor Agent, Droid, Amp, Pi, Qwen, Antigravity), schedules a background job on macOS (launchd) or Linux (systemd), and runs the right update command for each on the cadence you choose.

## Install

```bash
git clone https://github.com/phl28/dobby.git ~/Code/dobby
cd ~/Code/dobby
npm install
npm run build
npm link        # gives you a global `dobby` command
```

## Quickstart

```bash
dobby init      # interactive onboarding: pick tools + frequency
dobby status    # show config, last run, next scheduled run
dobby run       # update everything now
```

## Commands

| Command                                     | What it does                                                      |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `dobby init`                                | Interactive setup: detect installed tools, pick set, pick cadence |
| `dobby update` / `dobby run`                | Run the update pass once (what the background job invokes)        |
| `dobby status`                              | Print selected tools, frequency, last/next run, log path          |
| `dobby add` / `dobby remove`                | Re-open the multi-select to edit `selectedTools`                  |
| `dobby frequency <hourly\|daily\|weekly>`   | Change cadence and refresh the scheduler                          |
| `dobby enable` / `dobby disable`            | Enable / disable the background job without touching the config   |

## Where things live

- Config: `~/.config/dobby/config.json`
- Logs:   `~/.config/dobby/logs/YYYY-MM-DD.log` plus stdout/stderr from the background job
- macOS:  `~/Library/LaunchAgents/ai.dobby.update.plist`
- Linux:  `~/.config/systemd/user/dobby-update.{service,timer}`

## Supported tools

`claude-code`, `opencode`, `codex`, `gemini-cli`, `qwen-code`, `cursor-agent`, `droid`, `amp`, `pi`, `antigravity`.

Add more by editing `src/tools/registry.ts` and rebuilding.

## Supported platforms

- **macOS** — uses `launchd` (LaunchAgents)
- **Linux** — uses `systemd` user services (requires `systemctl --user`)

Windows is not supported.
