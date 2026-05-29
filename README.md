<p align="center">
  <img src="assets/logo.png" alt="Bitget" width="120" />
</p>

<h1 align="center">Bitget Agent Hub</h1>

<p align="center">
  <strong>The official home of Bitget's AI integrations — connect any AI assistant to your Bitget account or to Bitget market data.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/bitget-agent-mcp"><img src="https://img.shields.io/npm/v/bitget-agent-mcp.svg?style=flat-square&color=cb3837" alt="MCP Server" /></a>
  <a href="https://www.npmjs.com/package/bitget-agent-cli"><img src="https://img.shields.io/npm/v/bitget-agent-cli.svg?style=flat-square&color=0070f3" alt="CLI" /></a>
  <a href="https://www.npmjs.com/package/bitget-agent-sdk"><img src="https://img.shields.io/npm/v/bitget-agent-sdk.svg?style=flat-square&color=6f42c1" alt="SDK" /></a>
  <a href="https://www.npmjs.com/package/bitget-agent-skill"><img src="https://img.shields.io/npm/v/bitget-agent-skill.svg?style=flat-square&color=28a745" alt="Skill" /></a>
  <a href="https://www.npmjs.com/package/bitget-signal"><img src="https://img.shields.io/npm/v/bitget-signal.svg?style=flat-square&color=e25c5c" alt="Bitget Signal" /></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-compatible-8A2BE2?style=flat-square" alt="MCP compatible" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/bitget-agent-mcp.svg?style=flat-square" alt="license" /></a>
</p>

---

The hub is organized into **two product stacks**:

### 🟦 Trading Stack — *use your Bitget account*

| Repo | npm | What it is |
|------|-----|------------|
| **Foundation** | | |
| [`bitget/agent-sdk`](https://github.com/bitget/agent-sdk) | [`bitget-agent-sdk`](https://www.npmjs.com/package/bitget-agent-sdk) | The 56+ Bitget API tools as a TypeScript SDK. For developers writing code. |
| **Surfaces** | | |
| [`bitget/agent-cli`](https://github.com/bitget/agent-cli) | [`bitget-agent-cli`](https://www.npmjs.com/package/bitget-agent-cli) | `bgc` — shell CLI. For Claude Code, Codex CLI, OpenClaw. |
| [`bitget/agent-mcp`](https://github.com/bitget/agent-mcp) | [`bitget-agent-mcp`](https://www.npmjs.com/package/bitget-agent-mcp) | MCP server. For Claude Desktop, Cursor, Continue. |
| [`bitget/agent-skill`](https://github.com/bitget/agent-skill) | [`bitget-agent-skill`](https://www.npmjs.com/package/bitget-agent-skill) | AI skill that teaches the assistant to use `bgc` semantically. |

### 🟩 Signal Stack — *read the market (no API key)*

| Repo | npm | What it is |
|------|-----|------------|
| [`bitget/bitget-signal`](https://github.com/bitget/bitget-signal) | [`bitget-signal`](https://www.npmjs.com/package/bitget-signal) | Market-signal skills. Generic skills today (macro, market-intel, sentiment, technical, news); **Bitget-only signals** (top-trader flow, derivatives structure, large-flow detect) progressively rolling in. |

---

## Quick start — pick your path

### "I want my AI to trade for me"

If you use **Claude Code, Codex CLI, or OpenClaw** (shell-based AI):

```bash
npm install -g bitget-agent-cli      # bgc CLI
npm install -g bitget-agent-skill    # the skill that teaches AI to use bgc
```

If you use **Claude Desktop, Cursor, or Continue** (MCP-based AI):

```bash
npx -y bitget-agent-mcp
```

(See [`agent-mcp`](https://github.com/bitget/agent-mcp) for per-host configuration.)

In either case, set credentials before running:

```bash
export BITGET_API_KEY=...
export BITGET_SECRET_KEY=...
export BITGET_PASSPHRASE=...
```

### "I want my AI to analyze the market for me"

```bash
npm install -g bitget-signal
```

No API key required. Five skills (macro / market-intel / sentiment / technical / news) get installed into your AI tool, and the public `bitget-signal` MCP server is wired up automatically.

### "I'm building my own thing on top of Bitget"

```bash
npm install bitget-agent-sdk
```

```ts
import { loadConfig, buildTools, BitgetRestClient } from "bitget-agent-sdk";
```

---

## `bitget-agent-installer` — the meta installer

For teams that want to install/upgrade/rollback multiple packages at once:

```bash
# Install everything and deploy skills to Claude Code
npx bitget-agent-installer upgrade-all --target claude

# Pick targets
npx bitget-agent-installer install --target claude,codex
npx bitget-agent-installer install --target all

# Rollback
npx bitget-agent-installer rollback bitget-agent-skill --to 1.0.0

# Interactive
npx bitget-agent-installer
```

The installer source lives in [`installer/cli.mjs`](installer/cli.mjs) of this repo.

---

## Module breakdown (Trading Stack)

| Module | Tools | Loaded by default |
|--------|:-----:|:-----------------:|
| `spot` | 13 | ✅ |
| `futures` | 14 | ✅ |
| `account` | 8 | ✅ |
| `margin` | 7 | — |
| `copytrading` | 5 | — |
| `convert` | 3 | — |
| `earn` | 3 | — |
| `p2p` | 2 | — |
| `broker` | 3 | — |

Default: 35 tools (fits Cursor's 40-tool limit). Load everything: `--modules all`.

---

## Documentation

Full docs live under [`docs/`](docs/) and on the docs site (TBD).

- [Getting started](docs/getting-started.md)
- [Architecture](docs/architecture.md)
- [Authentication](docs/authentication.md)
- [Modules](docs/modules.md)
- [Tools reference](docs/tools-reference.md)
- [Error codes](docs/error-codes.md)
- [API mapping](docs/api-mapping.md)
- [Signal Skills](docs/skill-hub.md)

---

## Cross-repo end-to-end test

```bash
node e2e/mcp-smoke-test.mjs
```

Spins up `bitget-agent-mcp` against the mock server in `bitget-agent-sdk/testing` and exercises every tool.

---

## Security

- Credentials via **environment variables only** — never hardcoded or logged.
- `--read-only` disables all write operations at the surface layer.
- All authenticated requests signed with **HMAC-SHA256**.
- Client-side rate limiting prevents accidental abuse.
- Write operations require explicit confirmation.

Report vulnerabilities privately — see `SECURITY.md` (TBD) on each repo.

---

## License

[MIT](LICENSE)
