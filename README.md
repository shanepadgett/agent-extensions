<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/_media/ae-logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/_media/ae-logo-light.png">
    <img alt="lattice" src="docs/_media/ae-logo-dark.png" style="max-width: 100%; border-radius: 6px;">
  </picture>
</p>

Drop-in agents, commands, and skills for:

- [OpenCode](https://opencode.ai/)
- [Augment CLI](https://www.augmentcode.com/)
- [Codex CLI](https://developers.openai.com/codex/)

This repo delivers a versioned, installable payload under `opencode/`, `augment/`, and `codex/`, plus cross-platform install/uninstall scripts.

## Installation

### Prerequisites

Install at least one of:

- [OpenCode](https://opencode.ai/docs/#install)
- [Augment CLI](https://www.augmentcode.com/)
- [Codex CLI](https://developers.openai.com/codex/)

### macOS / Linux

```sh
git clone git@github.com:BrassworksAI/agent-extensions.git && cd agent-extensions
./install.sh
```

Global installs use symlinks to the repo; local installs copy files into the repo. macOS/Linux only.

### Windows

```powershell
git clone git@github.com:BrassworksAI/agent-extensions.git; cd agent-extensions
.\install.ps1
```

Global installs use symlinks to the repo; local installs copy files into the repo.

### Install Locations

| Tool | Global | Local |
|------|--------|-------|
| OpenCode | `~/.config/opencode/` | `.opencode/` |
| Augment | `~/.augment/` | `.augment/` |
| Codex | `~/.codex/` | `.codex/` |

### Uninstall

```sh
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/BrassworksAI/agent-extensions/main/uninstall.sh | sh
```

```powershell
# Windows
irm https://raw.githubusercontent.com/BrassworksAI/agent-extensions/main/uninstall.ps1 | iex
```

## Available Commands

### Workflow

| Command | Description |
|---------|-------------|
| `/sdd/plan <goal>` | Generate plan for a new feature |
| `/sdd/specs <goal>` | Draft spec for a new feature |
| `/sdd/proposal <goal>` | Create proposal for a feature |
| `/sdd/implement <goal>` | Implement spec |
| `/sdd/reconcile <goal>` | Validate implementation vs spec |
| `/sdd/finish <goal>` | Finalize implementation |
| `/sdd/continue` | Continue last workflow stage |

### Discovery

| Command | Description |
|---------|-------------|
| `/sdd/brainstorm <goal>` | Generate high-level options |
| `/sdd/explain <subject>` | Explain system/flow |
| `/sdd/discovery <goal>` | Explore requirements and constraints |
| `/sdd/tools/critique [target]` | Critique proposal, specs, or plan |
| `/sdd/tools/scenario-test [name]` | Roleplay as user to stress-test design |
| `/sdd/tools/taxonomy-map <name>` | Map intents to spec paths |
| `/sdd/tools/prime-specs <name>` | Load specs into context |

### Meta

| Command | Description |
|---------|-------------|
| `/create/command <spec>` | Create a new command (OpenCode/Augment) |
| `/prompts:create-command <spec>` | Create a new Codex custom prompt |

## Development Install

Run the install script from your clone:

```sh
git clone git@github.com:BrassworksAI/agent-extensions.git && cd agent-extensions
./install.sh
```

## Repository Structure

```text
agent-extensions/
├── opencode/           # OpenCode extensions
│   ├── agent/          # Agent definitions
│   ├── command/        # Command definitions
│   └── skill/          # Skill definitions
├── augment/            # Augment extensions
│   ├── agents/         # Agent definitions
│   ├── commands/       # Command definitions
│   └── skills/         # Skill files
├── codex/              # Codex extensions
│   ├── prompts/         # Custom prompts (top-level only)
│   └── skills/          # Skill definitions
├── install.sh          # macOS/Linux installer (global symlinks, local copies)
├── install.ps1         # Windows installer (global symlinks, local copies)
├── uninstall.sh        # macOS/Linux uninstaller
└── uninstall.ps1       # Windows uninstaller
```

## Learn More

- [THE_CASE_FOR_SPECS.md](THE_CASE_FOR_SPECS.md)
