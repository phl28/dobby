# Dobby

Background updater for your agentic coding CLIs. Like the house-elf, Dobby quietly keeps things ready while you sleep.

Picks a list of tools (Claude Code, OpenCode, Codex, Qwen Code, Cursor Agent, Droid, Amp, Pi, Herdr), schedules a `launchd` agent on macOS, and runs the right update command for each on the cadence you choose.

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
dobby run       # update everything now (also what launchd invokes)
```

## Commands

| Command                                     | What it does                                                      |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `dobby init`                                | Interactive setup: detect installed tools, pick set, pick cadence |
| `dobby update` / `dobby run`                | Run the update pass once (what launchd invokes)                   |
| `dobby status`                              | Print selected tools, frequency, last/next run, log path          |
| `dobby add` / `dobby remove`                | Re-open the multi-select to edit `selectedTools`                  |
| `dobby frequency <hourly\|daily\|weekly>`   | Change cadence and refresh the LaunchAgent                        |
| `dobby enable` / `dobby disable`            | Load / unload the LaunchAgent without touching the config         |

## Where things live

- Config: `~/.config/dobby/config.json`
- Logs:   `~/.config/dobby/logs/YYYY-MM-DD.log` plus `launchd.out` / `launchd.err`
- Plist:  `~/Library/LaunchAgents/ai.dobby.update.plist`

## Supported tools

`claude-code`, `opencode`, `codex`, `qwen-code`, `cursor-cli`, `droid`, `amp`, `pi`, `herdr`.

Add more by editing `src/tools/registry.ts` and rebuilding.

## macOS only

Scheduling uses `launchd`. Linux/Windows aren't supported in this iteration.
