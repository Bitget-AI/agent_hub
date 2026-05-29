# Getting Started

This guide walks you through installing and configuring any Bitget Agent Hub package.

## Choose Your Integration

| I want to… | Use |
|---|---|
| Connect Claude Desktop / Cursor / Copilot to Bitget | [`bitget-agent-mcp`](packages/bitget-mcp.md) |
| Query Bitget from the terminal or scripts | [`bitget-agent-cli` (`bgc`)](packages/bitget-agent-cli.md) |
| Let Claude Code call Bitget APIs autonomously | [`bitget-agent-skill`](packages/bitget-agent-skill.md) |
| Build my own Bitget integration in TypeScript | [`bitget-agent-sdk`](packages/bitget-agent-sdk.md) |

---

## Prerequisites

- **Node.js** ≥ 18
- A [**Bitget API key**](https://www.bitget.com/account/newapi) (optional for public market data)

## Get API Credentials

1. Log in to [bitget.com](https://www.bitget.com)
2. Go to **Settings → API Management**
3. Create a new API key
4. Select permissions:
   - **Read Only** — for market data and account queries
   - **Trade** — for placing and cancelling orders
   - **Withdraw** — only if you need withdrawal tools
5. Note your **API Key**, **Secret Key**, and **Passphrase**

## Set Environment Variables

All packages read credentials from environment variables:

```bash
export BITGET_API_KEY="your-api-key"
export BITGET_SECRET_KEY="your-secret-key"
export BITGET_PASSPHRASE="your-passphrase"
```

Or pass them inline:

```bash
BITGET_API_KEY=xxx BITGET_SECRET_KEY=yyy BITGET_PASSPHRASE=zzz bgc account account_get_balance
```

## Verify Without Credentials

Public market data tools work without any credentials:

```bash
# MCP Server — starts without env vars, exposes public tools
npx -y bitget-agent-mcp

# CLI — no auth needed for market data
npx bitget-agent-cli spot spot_get_ticker --symbol BTCUSDT
```

## Next Steps

- [Configure the MCP Server](packages/bitget-mcp.md)
- [Use the `bgc` CLI](packages/bitget-agent-cli.md)
- [Set up the Claude Code skill](packages/bitget-agent-skill.md)
- [Understand available modules](modules.md)
