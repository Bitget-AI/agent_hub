# bitget-agent-cli (`bgc`)

A command-line interface for the Bitget exchange. Covers the same 58 tools as the MCP server, outputs JSON, and is designed for scripting, automation, and direct use from the terminal.

## Overview

| | |
|---|---|
| **npm** | `bitget-agent-cli` |
| **Binary** | `bgc` |
| **Output** | JSON (default) or pretty-printed JSON (`--pretty`) |
| **Node.js** | ≥ 18 |
| **Source** | `packages/bitget-agent-cli/` |

## Installation

### Global install (recommended)

```bash
npm install -g bitget-agent-cli
bgc --version
```

### npx (no install)

```bash
npx bitget-agent-cli spot spot_get_ticker --symbol BTCUSDT
```

### From source (monorepo)

```bash
pnpm install
cd packages/bitget-agent-cli && pnpm build
node dist/index.js --help
```

## Authentication

Set credentials via environment variables before calling private endpoints:

```bash
export BITGET_API_KEY="your-api-key"
export BITGET_SECRET_KEY="your-secret-key"
export BITGET_PASSPHRASE="your-passphrase"
```

Public market data tools (tickers, order book, candles) work without any credentials.

## Usage

```
bgc <module> <tool> [--param value ...]

Options:
  --read-only     Only allow read/query tools
  --pretty        Pretty-print JSON output
  --help          Show this help
  --version       Show version

Auth:
  BITGET_API_KEY, BITGET_SECRET_KEY, BITGET_PASSPHRASE (env vars)
```

## Command Syntax

```bash
bgc <module> <tool_name> [--param1 value1] [--param2 value2] ...
```

- `<module>` — one of: `spot`, `futures`, `account`, `margin`, `copytrading`, `convert`, `earn`, `p2p`, `broker`
- `<tool_name>` — exact tool name (e.g. `spot_get_ticker`)
- `--param value` — tool parameters as `--key value` pairs

## Examples

### Market Data (no auth needed)

```bash
# Get BTC spot ticker
bgc spot spot_get_ticker --symbol BTCUSDT

# Get all tickers (omit symbol)
bgc spot spot_get_ticker

# Get order book
bgc spot spot_get_depth --symbol BTCUSDT --limit 20

# Get candlestick data
bgc spot spot_get_candles --symbol BTCUSDT --granularity 1h --limit 100

# Get BTC futures ticker
bgc futures futures_get_ticker --symbol BTCUSDT

# Get funding rate
bgc futures futures_get_funding_rate --symbol BTCUSDT

# Pretty-print any result
bgc spot spot_get_ticker --symbol BTCUSDT --pretty
```

### Account (auth required)

```bash
# Check balance
bgc account account_get_balance

# Get full asset breakdown
bgc account get_account_assets

# Transfer funds between accounts
bgc account transfer --fromType spot --toType futures --amount 100 --coin USDT

# Get deposit address
bgc account get_deposit_address --coin USDT --chain TRC20
```

### Spot Trading (auth required)

```bash
# Place a limit buy order
bgc spot spot_place_order \
  --symbol BTCUSDT \
  --side buy \
  --orderType limit \
  --price 60000 \
  --size 0.001

# Place a market sell order
bgc spot spot_place_order \
  --symbol BTCUSDT \
  --side sell \
  --orderType market \
  --size 0.001

# Cancel an order
bgc spot spot_cancel_order --symbol BTCUSDT --orderId 123456789

# View open orders
bgc spot spot_get_orders --symbol BTCUSDT --status open
```

### Futures Trading (auth required)

```bash
# View open positions
bgc futures futures_get_positions

# Set leverage
bgc futures futures_set_leverage --symbol BTCUSDT --marginCoin USDT --leverage 10

# Place a futures order
bgc futures futures_place_order \
  --symbol BTCUSDT \
  --marginCoin USDT \
  --side buy \
  --orderType limit \
  --price 60000 \
  --size 1
```

## Output Format

By default, `bgc` outputs compact JSON to stdout:

```json
{"endpoint":"/api/v2/spot/market/tickers","requestTime":"1709481234567","data":[{"symbol":"BTCUSDT","lastPr":"67530.5",...}]}
```

With `--pretty`:

```json
{
  "endpoint": "/api/v2/spot/market/tickers",
  "requestTime": "1709481234567",
  "data": [
    {
      "symbol": "BTCUSDT",
      "lastPr": "67530.5",
      ...
    }
  ]
}
```

Errors are written to stderr with exit code 1:

```json
{
  "ok": false,
  "error": {
    "type": "BitgetApiError",
    "code": "AUTH_MISSING",
    "message": "No API credentials configured.",
    "suggestion": "Set BITGET_API_KEY, BITGET_SECRET_KEY and BITGET_PASSPHRASE."
  }
}
```

## Scripting & Piping

Because output is JSON, `bgc` works well with `jq`:

```bash
# Get just the last price
bgc spot spot_get_ticker --symbol BTCUSDT | jq '.data[0].lastPr'

# Get all positions with leverage
bgc futures futures_get_positions | jq '.data[] | {symbol: .symbol, size: .total, leverage: .leverage}'

# Export all open orders to a file
bgc spot spot_get_orders --status open --pretty > open-orders.json
```

## Read-Only Mode

Use `--read-only` to prevent any write/trade operations even if credentials are set:

```bash
bgc --read-only account account_get_balance
bgc --read-only spot spot_get_ticker --symbol BTCUSDT
```

## Package Structure

```
packages/bitget-agent-cli/
├── src/
│   └── index.ts    # CLI entry: arg parsing, tool dispatch, JSON output
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### `src/index.ts`

Single-file CLI entry point that:
1. Parses positional args (`<module>` `<tool>`) and `--key value` flag pairs
2. Loads config from environment variables via `bitget-agent-sdk`
3. Builds the tool list for the specified module
4. Finds the requested tool and calls its handler
5. Writes JSON result to stdout or error payload to stderr

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `bitget-agent-sdk` | `workspace:*` | API client, tools, config |

## Troubleshooting

**`bgc: command not found`**
Install globally: `npm install -g bitget-agent-cli`

**`Error: tool "xyz" not found in module "spot"`**
Check the exact tool name. Run `bgc --help` and refer to [Tools Reference](../tools-reference.md).

**JSON parse errors in scripts**
Errors go to stderr (exit code 1), not stdout. Capture stderr separately:
```bash
result=$(bgc spot spot_get_ticker --symbol BTCUSDT 2>/dev/null) || echo "Error occurred"
```
