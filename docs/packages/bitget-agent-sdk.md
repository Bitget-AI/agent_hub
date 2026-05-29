# bitget-agent-sdk

The shared foundation library used by all other Bitget Agent Hub packages. Provides the REST client, tool definitions, authentication, rate limiting, and configuration management.

## Overview

| | |
|---|---|
| **npm** | `bitget-agent-sdk` |
| **Type** | Library (no binary) |
| **Node.js** | ≥ 18 |
| **Source** | `packages/bitget-agent-sdk/` |

Use `bitget-agent-sdk` if you want to build your own Bitget integration in TypeScript — for example, a custom MCP server, a different CLI, or a Node.js application.

## Installation

```bash
npm install bitget-agent-sdk
```

## Quick Start

```typescript
import { BitgetRestClient, loadConfig, buildTools } from "bitget-agent-sdk";

// Load config from environment variables
const config = loadConfig({ modules: "spot,futures", readOnly: false });

// Create the REST client
const client = new BitgetRestClient(config);

// Build the tool list for the configured modules
const tools = buildTools(config);

// Call a specific tool directly
const spotTicker = tools.find(t => t.name === "spot_get_ticker");
const result = await spotTicker!.handler(
  { symbol: "BTCUSDT" },
  { config, client }
);
console.log(result);
```

## Public API

### Config

#### `loadConfig(cli: CliOptions): BitgetConfig`

Loads and validates configuration from environment variables merged with CLI options.

```typescript
import { loadConfig } from "bitget-agent-sdk";

const config = loadConfig({
  modules: "spot,futures,account",  // or "all"
  readOnly: false,
});
```

**Environment variables read:**
- `BITGET_API_KEY`
- `BITGET_SECRET_KEY`
- `BITGET_PASSPHRASE`
- `BITGET_API_BASE_URL` (default: `https://api.bitget.com`)
- `BITGET_TIMEOUT_MS` (default: `15000`)

**Types:**

```typescript
interface CliOptions {
  modules?: string;   // comma-separated module IDs, or "all"
  readOnly: boolean;
}

interface BitgetConfig {
  apiKey?: string;
  secretKey?: string;
  passphrase?: string;
  hasAuth: boolean;
  baseUrl: string;
  timeoutMs: number;
  modules: ModuleId[];
  readOnly: boolean;
}
```

---

### Tools

#### `buildTools(config: BitgetConfig): ToolSpec[]`

Returns the filtered list of tool specs for the configured modules. If `readOnly` is `true`, write tools are excluded.

```typescript
import { buildTools, loadConfig } from "bitget-agent-sdk";

const config = loadConfig({ modules: "spot", readOnly: false });
const tools = buildTools(config);

console.log(tools.map(t => t.name));
// ["spot_get_ticker", "spot_get_depth", "spot_place_order", ...]
```

**`ToolSpec` type:**

```typescript
interface ToolSpec {
  name: string;                    // e.g. "spot_get_ticker"
  module: ModuleId;                // e.g. "spot"
  description: string;             // Human + AI readable description
  isWrite: boolean;                // true for order/transfer/withdrawal tools
  inputSchema: JSONSchema;         // JSON Schema for parameters
  handler: ToolHandler;            // async function that calls the API
}

type ToolHandler = (
  args: Record<string, unknown>,
  context: { config: BitgetConfig; client: BitgetRestClient }
) => Promise<unknown>;
```

---

### REST Client

#### `class BitgetRestClient`

Low-level HTTP client with automatic signing and rate limiting.

```typescript
import { BitgetRestClient, loadConfig } from "bitget-agent-sdk";

const config = loadConfig({ modules: "spot", readOnly: false });
const client = new BitgetRestClient(config);

// GET request (public)
const tickers = await client.get("/api/v2/spot/market/tickers", { symbol: "BTCUSDT" });

// POST request (private — requires auth)
const order = await client.post("/api/v2/spot/trade/place-order", {
  symbol: "BTCUSDT",
  side: "buy",
  orderType: "limit",
  price: "60000",
  size: "0.001",
});
```

The client automatically:
- Signs private requests with HMAC-SHA256
- Applies per-endpoint rate limiting (token bucket)
- Throws typed errors (`BitgetApiError`, `RateLimitError`, etc.)

---

### Constants

```typescript
import { SERVER_NAME, SERVER_VERSION, MODULES, DEFAULT_MODULES } from "bitget-agent-sdk";

console.log(MODULES);
// ["spot", "futures", "account", "margin", "copytrading", "convert", "earn", "p2p", "broker"]

console.log(DEFAULT_MODULES);
// ["spot", "futures", "account"]

type ModuleId = "spot" | "futures" | "account" | "margin" | "copytrading" | "convert" | "earn" | "p2p" | "broker";
```

---

### Errors

```typescript
import { BitgetApiError, ConfigError, toToolErrorPayload } from "bitget-agent-sdk";

try {
  const result = await tool.handler(args, context);
} catch (err) {
  if (err instanceof BitgetApiError) {
    console.error(err.code, err.message, err.suggestion);
  }
  // Convert any error to a structured payload
  const payload = toToolErrorPayload(err);
  // { ok: false, error: { type, code, message, suggestion } }
}
```

**Error classes:**

| Class | When thrown |
|---|---|
| `ConfigError` | Invalid or missing configuration |
| `BitgetApiError` | Bitget API returned a non-zero business code |
| `ValidationError` | Tool parameter validation failed |
| `RateLimitError` | Client-side rate limit exceeded |
| `AuthenticationError` | HMAC signature rejected |
| `NetworkError` | Network timeout or connection failure |

---

### MCP Integration

If building an MCP server, use `toMcpTool` to convert a `ToolSpec` to MCP's `Tool` format:

```typescript
import { toMcpTool, buildTools, loadConfig } from "bitget-agent-sdk";

const tools = buildTools(config);
const mcpTools = tools.map(toMcpTool);
// Each mcpTool has: { name, description, inputSchema, annotations }
```

---

## Package Structure

```
packages/bitget-agent-sdk/
├── src/
│   ├── index.ts           # Public exports
│   ├── config.ts          # Config loading + validation
│   ├── constants.ts       # Server name, version, module IDs
│   ├── client/
│   │   ├── rest-client.ts # HTTP client: signing, rate limiting, error handling
│   │   └── types.ts       # Client-related types
│   ├── tools/
│   │   ├── index.ts       # buildTools() — assembles filtered tool list
│   │   ├── types.ts       # ToolSpec, ToolHandler, toMcpTool()
│   │   ├── helpers.ts     # Shared parameter parsing utilities
│   │   ├── common.ts      # Shared constants (granularities, rate limits)
│   │   ├── spot-market.ts
│   │   ├── spot-trade.ts
│   │   ├── futures-market.ts
│   │   ├── futures-trade.ts
│   │   ├── account.ts
│   │   ├── margin.ts
│   │   ├── copy-trading.ts
│   │   ├── convert.ts
│   │   ├── earn.ts
│   │   ├── p2p.ts
│   │   └── broker.ts
│   └── utils/
│       ├── errors.ts       # Error classes + toToolErrorPayload()
│       ├── rate-limiter.ts # Token bucket rate limiter
│       └── signature.ts    # HMAC-SHA256 signing
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### Key Modules

#### `config.ts` — Configuration

`loadConfig()` reads environment variables and merges them with CLI options. Validates that all three auth credentials are present (or none). Parses the module list and handles the `"all"` shorthand.

#### `client/rest-client.ts` — HTTP Client

`BitgetRestClient` wraps Node.js native `fetch` with:
- Automatic URL construction
- HMAC-SHA256 request signing for private endpoints
- Per-endpoint token bucket rate limiting
- Response parsing and error detection

Zero external HTTP dependencies — uses Node.js 18+ built-in `fetch`.

#### `utils/signature.ts` — Request Signing

Implements Bitget's HMAC-SHA256 signature scheme:
```
signature = HMAC-SHA256(timestamp + method + requestPath + body, secretKey)
```
Uses Node.js built-in `crypto` module — no external dependencies.

#### `utils/rate-limiter.ts` — Rate Limiting

Token bucket implementation providing per-endpoint rate limiting. Prevents AI assistants from accidentally exceeding Bitget's API rate limits during rapid tool calls.

#### `tools/types.ts` — Tool Types

Defines `ToolSpec` (the core tool abstraction) and `toMcpTool()` (converts to MCP's `Tool` format). All tool files return arrays of `ToolSpec` from their register functions.

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `zod` | `^3.25.76` | Runtime schema validation in tool handlers |

Dev: `typescript`, `tsup`, `@types/node`

## Building

```bash
cd packages/bitget-agent-sdk
pnpm install
pnpm build      # outputs to dist/
pnpm typecheck  # tsc --noEmit
```

Output:
- `dist/index.js` — ESM bundle
- `dist/index.d.ts` — TypeScript declarations
