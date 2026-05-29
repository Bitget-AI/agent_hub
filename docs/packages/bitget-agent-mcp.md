# bitget-agent-mcp

The official Bitget MCP (Model Context Protocol) server. Gives AI assistants direct, real-time access to the Bitget exchange through natural language.

## Overview

| | |
|---|---|
| **npm** | `bitget-agent-mcp` |
| **Binary** | `bitget-agent-mcp` |
| **Protocol** | stdio (MCP) |
| **Node.js** | ≥ 18 |
| **Source** | `packages/bitget-mcp/` |

## Installation

### Using npx (recommended — no install needed)

```bash
npx -y bitget-agent-mcp --modules all
```

### Global install

```bash
npm install -g bitget-agent-mcp
bitget-agent-mcp --modules all
```

## Client Configuration

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "bitget": {
      "command": "npx",
      "args": ["-y", "bitget-agent-mcp", "--modules", "all"],
      "env": {
        "BITGET_API_KEY": "your-api-key",
        "BITGET_SECRET_KEY": "your-secret-key",
        "BITGET_PASSPHRASE": "your-passphrase"
      }
    }
  }
}
```

### Cursor

Create or edit `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "bitget": {
      "command": "npx",
      "args": ["-y", "bitget-agent-mcp", "--modules", "spot,futures,account"],
      "env": {
        "BITGET_API_KEY": "your-api-key",
        "BITGET_SECRET_KEY": "your-secret-key",
        "BITGET_PASSPHRASE": "your-passphrase"
      }
    }
  }
}
```

> Cursor has a 40-tool limit. The default `spot,futures,account` preset loads 34 tools — use `--modules all` only if you have headroom.

### Claude Code (CLI)

```bash
claude mcp add -s user \
  --env BITGET_API_KEY=your-api-key \
  --env BITGET_SECRET_KEY=your-secret-key \
  --env BITGET_PASSPHRASE=your-passphrase \
  bitget \
  -- npx -y bitget-agent-mcp --modules all

# Verify
claude mcp list
```

### Codex

Add to `~/.codex/config.toml` (global) or `codex.toml` in your project root:

```toml
[[mcp_servers]]
name = "bitget"
command = "npx"
args = ["-y", "bitget-agent-mcp", "--modules", "all"]

[mcp_servers.env]
BITGET_API_KEY = "your-api-key"
BITGET_SECRET_KEY = "your-secret-key"
BITGET_PASSPHRASE = "your-passphrase"
```

### OpenClaw

Add to your OpenClaw agent config (JSON format):

```json
{
  "mcp_servers": {
    "bitget": {
      "command": "npx",
      "args": ["-y", "bitget-agent-mcp", "--modules", "all"],
      "env": {
        "BITGET_API_KEY": "your-api-key",
        "BITGET_SECRET_KEY": "your-secret-key",
        "BITGET_PASSPHRASE": "your-passphrase"
      }
    }
  }
}
```

### VS Code (GitHub Copilot)

Create `.vscode/mcp.json` in your project root (requires VS Code 1.102+):

```json
{
  "servers": {
    "bitget": {
      "command": "npx",
      "args": ["-y", "bitget-agent-mcp", "--modules", "all"],
      "env": {
        "BITGET_API_KEY": "your-api-key",
        "BITGET_SECRET_KEY": "your-secret-key",
        "BITGET_PASSPHRASE": "your-passphrase"
      }
    }
  }
}
```

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "bitget": {
      "command": "npx",
      "args": ["-y", "bitget-agent-mcp", "--modules", "all"],
      "env": {
        "BITGET_API_KEY": "your-api-key",
        "BITGET_SECRET_KEY": "your-secret-key",
        "BITGET_PASSPHRASE": "your-passphrase"
      }
    }
  }
}
```

### Other MCP Clients

Any MCP-compatible client can launch the server via stdio:

```bash
BITGET_API_KEY=xxx BITGET_SECRET_KEY=yyy BITGET_PASSPHRASE=zzz \
  npx -y bitget-agent-mcp --modules all
```

## CLI Options

```
bitget-agent-mcp [options]

Options:
  --modules <list>   Comma-separated modules to load (default: spot,futures,account)
                     Use "all" to load all modules
                     Available: spot, futures, account, margin, copytrading,
                                convert, earn, p2p, broker
  --read-only        Disable all write/trade operations
  --help             Show help
  --version          Show version
```

## Read-Only Mode

Append `--read-only` to expose only query tools — no order placement, no transfers, no withdrawals:

```json
"args": ["-y", "bitget-agent-mcp", "--modules", "all", "--read-only"]
```

Useful for:
- Monitoring and analytics dashboards
- Shared environments where trading should not be possible
- Demos and testing

## Tools Overview

### Market Data (no auth required)

| Tool | Description |
|:-----|:------------|
| `spot_get_ticker` | Real-time spot price and 24h stats |
| `spot_get_depth` | Spot order book |
| `spot_get_candles` | Spot candlestick data |
| `futures_get_ticker` | Real-time futures price |
| `futures_get_funding_rate` | Funding rate (current + history) |
| `futures_get_open_interest` | Open interest by symbol |

### Trading (auth required)

| Tool | Description |
|:-----|:------------|
| `spot_place_order` | Place spot orders (single or batch) |
| `spot_cancel_order` | Cancel spot orders |
| `futures_place_order` | Place futures orders |
| `futures_get_positions` | View open futures positions |
| `futures_set_leverage` | Set leverage for a symbol |

### Account (auth required)

| Tool | Description |
|:-----|:------------|
| `account_get_balance` | Asset balances |
| `transfer` | Internal fund transfers |
| `get_deposit_address` | Generate deposit addresses |
| `withdraw` | On-chain withdrawal |

### Agent Utility

| Tool | Description |
|:-----|:------------|
| `system_get_capabilities` | Machine-readable module availability snapshot |

See [Tools Reference](../tools-reference.md) for the complete list.

## Package Structure

```
packages/bitget-mcp/
├── src/
│   ├── index.ts      # CLI entry: arg parsing, config loading, stdio transport
│   └── server.ts     # MCP Server: tool registration, request dispatch
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### `src/index.ts`

Parses CLI flags (`--modules`, `--read-only`, `--help`, `--version`), loads config from environment variables, and starts the MCP server over stdio transport.

### `src/server.ts`

Creates the MCP `Server` instance, registers all tools from `bitget-agent-sdk`, and handles `list_tools` / `call_tool` requests. Also implements the `system_get_capabilities` meta-tool for agent planning.

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `bitget-agent-sdk` | `workspace:*` | API client, tools, config |
| `@modelcontextprotocol/sdk` | `^1.26.0` | MCP server protocol |

## Troubleshooting

**"Tool not found" error**
The requested module is not loaded. Add it to `--modules`:
```bash
npx -y bitget-agent-mcp --modules spot,futures,account,margin
```

**"AUTH_MISSING" error**
Private tool called without credentials. Set `BITGET_API_KEY`, `BITGET_SECRET_KEY`, `BITGET_PASSPHRASE`.

**"CONFIG_ERROR: Partial API credentials"**
You set some but not all three env vars. All three must be provided together.

**Server not appearing in client**
Restart your AI client after editing the config file.
