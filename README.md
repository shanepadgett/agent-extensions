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
git clone git@github.com:shanepadgett/agent-extensions.git && cd agent-extensions
./install.sh
```

You must run the script from the `agent-extensions` directory because the installer is not on your PATH. If you need to install into a different repo from its directory, reference the install script with a relative path (for example `../agent-extensions/install.sh`).

### Windows

```powershell
git clone git@github.com:shanepadgett/agent-extensions.git; cd agent-extensions
.\install.ps1
```

The installer lives in the cloned repo, so run it from `agent-extensions` or reference it via a relative path such as `..\agent-extensions\install.ps1` when invoking from another directory.

### Install Locations

| Tool | Global | Local |
|------|--------|-------|
| OpenCode | `~/.config/opencode/` | `.opencode/` |
| Augment | `~/.augment/` | `.augment/` |
| Codex | `~/.codex/` | `.codex/` |

### Uninstall

```sh
cd agent-extensions
./uninstall.sh
```

```powershell
cd agent-extensions
.\uninstall.ps1
```

If you are running the uninstall from another repo, point to the script with a relative path (for example `../agent-extensions/uninstall.sh` or `..\agent-extensions\uninstall.ps1`).

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

## Learn More

- [THE_CASE_FOR_SPECS.md](THE_CASE_FOR_SPECS.md)
