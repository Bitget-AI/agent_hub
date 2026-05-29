#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const TOOL_ARGS = {
  system_get_capabilities: {},
  spot_get_ticker: { symbol: "BTCUSDT" },
  spot_get_depth: { symbol: "BTCUSDT", type: "step0", limit: 5 },
  spot_get_candles: { symbol: "BTCUSDT", granularity: "1min", limit: 5 },
  spot_get_trades: { symbol: "BTCUSDT", limit: 5 },
  spot_get_symbols: { type: "symbols", symbol: "BTCUSDT" },
  spot_place_order: {
    orders: [
      {
        symbol: "BTCUSDT",
        side: "buy",
        orderType: "limit",
        price: "1",
        size: "0.001",
      },
    ],
  },
  spot_cancel_orders: { symbol: "BTCUSDT", orderId: "12345" },
  spot_modify_order: {
    symbol: "BTCUSDT",
    orderId: "12345",
    newPrice: "1",
    newSize: "0.001",
  },
  spot_get_orders: { symbol: "BTCUSDT", status: "open", limit: 5 },
  spot_get_fills: { symbol: "BTCUSDT", limit: 5 },
  spot_place_plan_order: {
    symbol: "BTCUSDT",
    side: "buy",
    triggerPrice: "1",
    orderType: "limit",
    price: "1",
    size: "0.001",
  },
  spot_get_plan_orders: { symbol: "BTCUSDT", status: "current", limit: 5 },
  spot_cancel_plan_orders: { orderId: "12345" },
  futures_get_ticker: { productType: "USDT-FUTURES", symbol: "BTCUSDT" },
  futures_get_depth: { productType: "USDT-FUTURES", symbol: "BTCUSDT", limit: 5 },
  futures_get_candles: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    granularity: "1min",
    priceType: "trade",
    limit: 5,
  },
  futures_get_trades: { productType: "USDT-FUTURES", symbol: "BTCUSDT", limit: 5 },
  futures_get_contracts: { productType: "USDT-FUTURES", symbol: "BTCUSDT" },
  futures_get_funding_rate: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    history: false,
  },
  futures_get_open_interest: { productType: "USDT-FUTURES", symbol: "BTCUSDT" },
  futures_place_order: {
    orders: [
      {
        productType: "USDT-FUTURES",
        symbol: "BTCUSDT",
        side: "buy",
        orderType: "limit",
        price: "1",
        size: "0.001",
        marginCoin: "USDT",
      },
    ],
  },
  futures_cancel_orders: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    orderId: "12345",
  },
  futures_get_orders: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    status: "open",
    limit: 5,
  },
  futures_get_fills: { productType: "USDT-FUTURES", symbol: "BTCUSDT", limit: 5 },
  futures_get_positions: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    history: false,
  },
  futures_set_leverage: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    marginCoin: "USDT",
    leverage: "10",
  },
  futures_update_config: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    marginCoin: "USDT",
    setting: "marginMode",
    value: "crossed",
  },
  get_account_assets: { accountType: "all" },
  get_account_bills: { accountType: "spot", limit: 5 },
  transfer: {
    fromAccountType: "spot",
    toAccountType: "funding",
    coin: "USDT",
    amount: "1",
  },
  withdraw: {
    coin: "USDT",
    transferType: "on_chain",
    address: "TTESTADDRESS",
    chain: "TRC20",
    amount: "1",
  },
  cancel_withdrawal: { orderId: "12345" },
  get_deposit_address: { coin: "USDT", chain: "TRC20" },
  get_transaction_records: { recordType: "deposit", limit: 5 },
  manage_subaccounts: { action: "list" },
  margin_get_assets: { marginType: "crossed" },
  margin_borrow: { marginType: "crossed", coin: "USDT", amount: "1" },
  margin_repay: { marginType: "crossed", coin: "USDT", amount: "1" },
  margin_place_order: {
    marginType: "crossed",
    symbol: "BTCUSDT",
    side: "buy",
    orderType: "limit",
    price: "1",
    size: "0.001",
  },
  margin_cancel_orders: { marginType: "crossed", symbol: "BTCUSDT", orderId: "12345" },
  margin_get_orders: { marginType: "crossed", symbol: "BTCUSDT", status: "open", limit: 5 },
  margin_get_records: { marginType: "crossed", recordType: "borrow", limit: 5 },
  copy_get_traders: { productType: "USDT-FUTURES" },
  copy_place_order: {
    productType: "USDT-FUTURES",
    symbol: "BTCUSDT",
    side: "buy",
    orderType: "limit",
    price: "1",
    size: "0.001",
  },
  copy_close_position: { productType: "USDT-FUTURES", symbol: "BTCUSDT" },
  copy_get_orders: { productType: "USDT-FUTURES", symbol: "BTCUSDT", limit: 5 },
  copy_get_positions: { productType: "USDT-FUTURES", symbol: "BTCUSDT", history: false },
  convert_get_quote: { fromCoin: "USDT", toCoin: "BTC", fromCoinAmount: "10" },
  convert_execute: { type: "normal", fromCoin: "USDT", toCoin: "BTC", fromCoinAmount: "10" },
  convert_get_history: { type: "normal", limit: 5 },
  earn_get_products: { coin: "USDT" },
  earn_subscribe_redeem: {
    action: "subscribe",
    productId: "demo-product",
    amount: "1",
    coin: "USDT",
  },
  earn_get_holdings: { coin: "USDT" },
  p2p_get_merchants: {},
  p2p_get_orders: { type: "orders" },
  broker_get_info: {},
  broker_manage_subaccounts: { action: "list", limit: 5 },
  broker_manage_apikeys: { action: "list", subAccountUid: "12345" },
};

function plainEnv(useEnvAuth) {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === "string") {
      env[key] = value;
    }
  }
  if (!useEnvAuth) {
    env.BITGET_API_KEY = "";
    env.BITGET_SECRET_KEY = "";
    env.BITGET_PASSPHRASE = "";
  }
  return env;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms),
    ),
  ]);
}

function classifyResult(result) {
  const structured = isRecord(result.structuredContent) ? result.structuredContent : {};
  if (!result.isError) {
    return { status: "PASS", note: "ok" };
  }

  const type = typeof structured.type === "string" ? structured.type : "UnknownError";
  const message =
    typeof structured.message === "string" ? structured.message : "No error message";

  if (
    type === "ValidationError" ||
    type === "ConfigError" ||
    type === "AuthenticationError" ||
    type === "NetworkError"
  ) {
    return { status: "FAIL", note: `${type}: ${message}` };
  }

  return { status: "WARN", note: `${type}: ${message}` };
}

async function main() {
  const readOnly = process.argv.includes("--read-only");
  const useEnvAuth = process.argv.includes("--use-env-auth");
  const serverArgs = ["dist/index.js", "--modules", "all"];
  if (readOnly) {
    serverArgs.push("--read-only");
  }

  const transport = new StdioClientTransport({
    command: "node",
    args: serverArgs,
    cwd: process.cwd(),
    env: plainEnv(useEnvAuth),
    stderr: "pipe",
  });

  if (transport.stderr) {
    transport.stderr.on("data", (chunk) => {
      const text = String(chunk).trim();
      if (text.length > 0) {
        console.error(`[server-stderr] ${text}`);
      }
    });
  }

  const client = new Client({
    name: "bitget-mcp-smoke-tester",
    version: "1.0.0",
  });

  await client.connect(transport);

  try {
    const listed = await client.listTools();
    const names = listed.tools.map((tool) => tool.name).sort();
    const results = [];

    console.log(`Mode: ${readOnly ? "read-only" : "full"}`);
    console.log(`Auth: ${useEnvAuth ? "env-auth" : "no-auth"}`);
    console.log(`Tools listed: ${names.length}`);
    console.log("Running one-by-one smoke test...");

    for (const name of names) {
      const args = TOOL_ARGS[name] ?? {};
      const startedAt = Date.now();

      try {
        const callResult = await withTimeout(
          client.callTool({ name, arguments: args }),
          20_000,
          name,
        );
        const { status, note } = classifyResult(callResult);
        const elapsedMs = Date.now() - startedAt;
        results.push({ name, status, note, elapsedMs });
        console.log(`${status.padEnd(5)} ${name} (${elapsedMs}ms) - ${note}`);
      } catch (error) {
        const elapsedMs = Date.now() - startedAt;
        const message = error instanceof Error ? error.message : String(error);
        results.push({ name, status: "FAIL", note: message, elapsedMs });
        console.log(`FAIL  ${name} (${elapsedMs}ms) - ${message}`);
      }
    }

    const pass = results.filter((item) => item.status === "PASS").length;
    const warn = results.filter((item) => item.status === "WARN").length;
    const fail = results.filter((item) => item.status === "FAIL").length;

    console.log("\nSummary");
    console.log(`PASS: ${pass}`);
    console.log(`WARN: ${warn}`);
    console.log(`FAIL: ${fail}`);

    const report = {
      mode: readOnly ? "read-only" : "full",
      toolCount: names.length,
      pass,
      warn,
      fail,
      generatedAt: new Date().toISOString(),
      results,
    };
    const reportPath = readOnly
      ? "mcp-smoke-report.readonly.json"
      : "mcp-smoke-report.full.json";
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`Report: ${reportPath}`);

    if (fail > 0) {
      process.exitCode = 1;
    }
  } finally {
    await transport.close();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
