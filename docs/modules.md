# Modules

The Bitget Agent Hub organizes its 58 tools into 9 modules. You can load specific modules to limit the tool surface exposed to AI assistants (useful for staying within client tool limits).

## Available Modules

| Module | Tools | Default | Auth Required | Description |
|:-------|:-----:|:-------:|:-------------:|:------------|
| `spot` | 13 | ✅ | Partial | Spot market data, order management, fill history |
| `futures` | 14 | ✅ | Partial | Futures market data, positions, leverage, funding rates |
| `account` | 8 | ✅ | Yes | Balances, transfers, deposits, withdrawals, sub-accounts |
| `margin` | 7 | — | Yes | Cross and isolated margin trading |
| `copytrading` | 5 | — | Yes | Copy trading with elite trader selection |
| `convert` | 3 | — | Yes | Real-time coin-to-coin conversion |
| `earn` | 3 | — | Yes | Savings and staking products |
| `p2p` | 2 | — | Yes | P2P merchant list and order history |
| `broker` | 3 | — | Yes | Broker sub-account and API key management |

**Default load:** `spot` + `futures` + `account` = **34 tools**

This default fits within Cursor's 40-tool limit, leaving room for other MCP servers.

---

## Module Details

### `spot` — Spot Trading

Market data tools are public (no auth). Trading tools require credentials.

**Market data (public):**
- `spot_get_ticker` — Real-time price and 24h stats for one or all pairs
- `spot_get_depth` — Live order book
- `spot_get_candles` — K-line / candlestick data (with history)
- `spot_get_trades` — Recent public trades
- `spot_get_symbols` — All available trading pairs and their specs

**Trading (private):**
- `spot_place_order` — Place single or batch limit/market orders
- `spot_place_plan_order` — Stop-loss, take-profit, trigger orders
- `spot_cancel_order` — Cancel one or multiple orders
- `spot_get_orders` — Open orders, order history, fill history
- `spot_get_fills` — Trade fill records

---

### `futures` — Futures / Perpetuals

**Market data (public):**
- `futures_get_ticker` — Real-time ticker for one or all futures pairs
- `futures_get_depth` — Futures order book
- `futures_get_candles` — Futures candlestick data
- `futures_get_funding_rate` — Current and historical funding rates
- `futures_get_open_interest` — Open interest by symbol

**Trading (private):**
- `futures_place_order` — Place single or batch futures orders
- `futures_cancel_order` — Cancel open futures orders
- `futures_get_orders` — Open orders and order history
- `futures_get_positions` — Current open positions
- `futures_set_leverage` — Adjust leverage for a symbol
- `futures_get_fills` — Futures fill records

---

### `account` — Account & Wallet

All tools in this module require credentials.

- `account_get_balance` — Balances across spot, futures, and funding accounts
- `get_account_assets` — Full asset breakdown
- `transfer` — Move funds between account types
- `get_deposit_address` — Generate deposit addresses
- `get_deposit_history` — Deposit transaction history
- `withdraw` — On-chain withdrawal
- `get_withdrawal_history` — Withdrawal transaction history
- `get_sub_accounts` — Sub-account list and balances

---

### `margin` — Margin Trading

Cross and isolated margin operations.

- `margin_borrow` — Borrow assets for margin trading
- `margin_repay` — Repay margin loan
- `margin_get_loans` — Current loan status
- `margin_place_order` — Place margin orders
- `margin_cancel_order` — Cancel margin orders
- `margin_get_orders` — Margin order history
- `margin_get_interest_history` — Interest accrual history

---

### `copytrading` — Copy Trading

- `copy_get_traders` — Browse available elite traders with performance stats
- `copy_place_order` — Follow a trader (auto-selects best trader if `traderId` omitted)
- `copy_cancel_order` — Stop copying a trader
- `copy_get_positions` — View copy trading positions
- `copy_get_history` — Copy trading history

---

### `convert` — Coin Conversion

- `convert_get_quote` — Get a real-time conversion quote
- `convert_place_order` — Execute a conversion at the quoted price
- `convert_get_history` — Conversion order history

---

### `earn` — Savings & Staking

> Note: Earn module availability is auto-detected at startup. It is hidden if unavailable for your account region.

- `earn_get_products` — Available savings and staking products
- `earn_subscribe` — Subscribe to an earn product
- `earn_get_positions` — Current earn holdings

---

### `p2p` — P2P Trading

- `p2p_get_merchants` — Browse P2P merchants and offers
- `p2p_get_orders` — P2P order history

---

### `broker` — Broker Operations

- `broker_get_sub_accounts` — List broker sub-accounts
- `broker_create_sub_account` — Create a new sub-account
- `broker_create_api_key` — Create API keys for sub-accounts

---

## Selecting Modules

### MCP Server

```bash
# Default (spot + futures + account)
npx -y bitget-agent-mcp

# Specific modules
npx -y bitget-agent-mcp --modules spot,futures,margin,account

# All modules
npx -y bitget-agent-mcp --modules all
```

### CLI (`bgc`)

The module is the first positional argument. Only that module's tools are available:

```bash
bgc spot spot_get_ticker --symbol BTCUSDT
bgc futures futures_get_positions
bgc margin margin_get_loans
```

## Tool Limits by Client

| Client | Tool limit | Recommended modules |
|--------|-----------|---------------------|
| Cursor | 40 | `spot,futures,account` (default) |
| GitHub Copilot | 128 | `--modules all` |
| Claude Desktop | No limit | `--modules all` |
| Claude Code | No limit | `--modules all` |
