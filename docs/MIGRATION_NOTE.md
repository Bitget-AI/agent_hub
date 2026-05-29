# Migration Note — Repo & Package Renames

These docs were originally written against a single monorepo and reference the old package names. They are still accurate as a description of the system; only the **shipping locations and npm names** changed.

## Mapping

| Old (monorepo path)        | New repo                                   | New npm name           |
|----------------------------|--------------------------------------------|------------------------|
| `packages/bitget-core`     | [`bitget/agent-sdk`](https://github.com/bitget/agent-sdk)     | `bitget-agent-sdk` (renamed; the old `bitget-core` name is **not** continued) |
| `packages/bitget-test-utils` | merged into `bitget/agent-sdk` (`/testing` subpath) | `bitget-agent-sdk/testing` |
| `packages/bitget-client`   | [`bitget/agent-cli`](https://github.com/bitget/agent-cli)     | `bitget-agent-cli` (renamed from `bitget-client`) |
| `packages/bitget-mcp`      | [`bitget/agent-mcp`](https://github.com/bitget/agent-mcp)     | `bitget-agent-mcp` (renamed from `bitget-mcp-server`) |
| `packages/bitget-skill`    | [`bitget/agent-skill`](https://github.com/bitget/agent-skill) | `bitget-agent-skill` (renamed from `bitget-skill`) |
| `packages/bitget-skill-hub`| [`bitget/bitget-signal`](https://github.com/bitget/bitget-signal) | `bitget-signal` (renamed) |
| `packages/bitget-hub`      | [`bitget/agent-installer`](https://github.com/bitget/agent-hub) | `bitget-agent-installer` (renamed from `bitget-hub`) |

## Naming convention

The new naming follows two simple rules:

- **Trading Stack** packages all share the `bitget-agent-*` prefix. They need an API key and operate on user accounts.
- **Signal Stack** packages use `bitget-signal*`. They read public market data only — no API key needed.

The prefix carries the credential boundary, so the package name itself tells you what scope of access is involved.

## Code-level migration

```diff
- import { loadConfig } from "bitget-core";
+ import { loadConfig } from "bitget-agent-sdk";

- import { MockServer } from "bitget-test-utils";
+ import { MockServer } from "bitget-agent-sdk/testing";
```

Bin name changes:

```diff
# MCP server
- npx -y bitget-mcp-server
+ npx -y bitget-agent-mcp

# Meta installer
- npx bitget-hub upgrade-all
+ npx bitget-agent-installer upgrade-all
```

`bgc` (the CLI binary) is unchanged.

## What hasn't changed

- All public APIs of all packages.
- All CLI flags of `bgc` / `bitget-agent-mcp`.
- All skill content.
- Module/tool names.
