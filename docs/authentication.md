# Authentication

## How It Works

All private Bitget API endpoints require HMAC-SHA256 request signing. The `bitget-agent-sdk` library handles signing automatically — you only need to provide your credentials via environment variables.

## Environment Variables

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `BITGET_API_KEY` | ✳ | Your Bitget API key |
| `BITGET_SECRET_KEY` | ✳ | Your Bitget secret key |
| `BITGET_PASSPHRASE` | ✳ | Your API passphrase (set when creating the key) |
| `BITGET_API_BASE_URL` | No | Override the API base URL (default: `https://api.bitget.com`) |
| `BITGET_TIMEOUT_MS` | No | Request timeout in milliseconds (default: `15000`) |

> ✳ All three must be provided together. Providing only some will cause a `CONFIG_ERROR`.

## Setting Credentials

### Shell export (recommended for CLI)

```bash
export BITGET_API_KEY="bg_xxxxxxxxxxxx"
export BITGET_SECRET_KEY="your-secret-key"
export BITGET_PASSPHRASE="your-passphrase"
```

### MCP server config

Pass as `env` in your MCP client config:

```json
{
  "mcpServers": {
    "bitget": {
      "command": "npx",
      "args": ["-y", "bitget-agent-mcp"],
      "env": {
        "BITGET_API_KEY": "your-api-key",
        "BITGET_SECRET_KEY": "your-secret-key",
        "BITGET_PASSPHRASE": "your-passphrase"
      }
    }
  }
}
```

## Public vs Private Endpoints

| Tool type | Auth required |
|---|---|
| Market data (tickers, order book, candles) | No |
| Account balance, orders, positions | Yes |
| Place/cancel orders, transfers, withdrawals | Yes |

If credentials are not set, private tools return a clear `AUTH_MISSING` error with setup instructions.

## Read-Only Mode

Use `--read-only` to ensure no write operations are possible, even if credentials are configured:

```bash
bitget-agent-mcp --modules all --read-only
bgc --read-only account account_get_balance
```

In read-only mode, all tools marked `isWrite: true` are hidden from the tool list entirely.

## Security Best Practices

- Never hardcode credentials in config files checked into version control
- Use environment variables or a secrets manager (e.g., 1Password, Vault)
- Create API keys with **minimum required permissions** (read-only for monitoring)
- Regularly rotate API keys
- Use `--read-only` mode unless trading is explicitly required
