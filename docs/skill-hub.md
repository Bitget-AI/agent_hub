# Signal Skills (formerly "Skill Hub")

The **Signal Skills** are a curated collection of plug-and-play AI skills shipped in the [`bitget-signal`](https://github.com/bitget/bitget-signal) repo. Each skill is a structured prompt that instructs Claude Code (or any compatible AI) how to use the market-data MCP server to answer a specific category of questions — turning raw API calls into coherent, analyst-grade outputs.

Skills live in the `skills/` directory of the [`bitget-signal`](https://github.com/bitget/bitget-signal) repo, one subdirectory per skill, with a standard `SKILL.md` entry point.

> **Naming history:** This bundle was previously called *Skill Hub* and shipped under `bitget-skill-hub`. It has been renamed to **`bitget-signal`** and rehomed to its own repo. Install command and MCP server name have changed accordingly — see below.

---

## What Is a Skill?

A skill is a `SKILL.md` file with a YAML front matter `description` (used for trigger matching) and a body that defines:

- **What data to fetch** — which MCP tools to call and in what order
- **How to interpret it** — signal thresholds, frameworks, decision trees
- **How to present it** — output templates with consistent formatting
- **Error handling** — neutral language when data is unavailable

Skills are self-contained. Install with `npm install -g bitget-signal` and they activate automatically in Claude Code.

---

## Bundled Skills

### `macro-analyst`
**Path:** `skills/macro-analyst/SKILL.md` (in [`bitget-signal`](https://github.com/bitget/bitget-signal))

Macro-economic and cross-asset analysis for crypto market context.

**What it does:**
- Reads the full rate environment: Fed funds, Treasury yield curve, 10Y–2Y spread
- Pulls key economic indicators: CPI, Core PCE, NFP, unemployment, GDP
- Computes BTC's rolling correlation to Gold, DXY, Nasdaq, S&P 500, VIX, 10Y yield
- Monitors global market prices: DXY, S&P 500, Nasdaq, Gold, Oil, VIX
- Tracks Chinese and Asian market context (Shanghai Composite, CNY/JPY/HKD)
- Delivers a **RISK-ON / MIXED / RISK-OFF** verdict for crypto

**Trigger phrases:** macro outlook, Fed policy, FOMC, rate cut, yield curve, recession risk, inflation, CPI, DXY, cross-asset correlation, China market, global markets…

---

### `market-intel`
**Path:** `skills/market-intel/SKILL.md` (in [`bitget-signal`](https://github.com/bitget/bitget-signal))

On-chain and institutional market intelligence — the structural layer beneath price.

**What it does:**
- Tracks Bitcoin and Ethereum **ETF flows** and institutional accumulation/distribution trends
- Surfaces **whale activity**: large transfers, exchange inflows/outflows, spot net flows
- Reads **market cycle indicators**: AHR999, Pi Cycle, Rainbow Chart, Coinbase Premium, Bubble Index, Stablecoin supply
- Monitors **DeFi structure**: TVL rankings by protocol and chain, yield pools, stablecoin market caps, protocol fees
- Identifies **trending DEX tokens** and new launches (with paid-promotion disclosure)
- Reports **network health**: ETH gas, BTC fees, mempool congestion

**Trigger phrases:** whale activity, exchange flows, ETF inflows, DeFi TVL, AHR999, rainbow chart, market cycle, DCA timing, meme coins, new token launches, gas fees…

---

### `news-briefing`
**Path:** `skills/news-briefing/SKILL.md` (in [`bitget-signal`](https://github.com/bitget/bitget-signal))

Crypto and financial news aggregation, briefing, and narrative synthesis.

**What it does:**
- Aggregates headlines from 20+ crypto, macro, tech, and geopolitical RSS feeds
- Delivers **morning briefings** combining top stories, macro/policy news, analyst views, and community pulse
- Supports **keyword-filtered topic searches** across all feeds
- Monitors **Chinese social media pulse**: Weibo, Douyin, Bilibili trending topics (filtered for market-relevant content)
- Tracks **KOL and research views** from key crypto thinkers
- Synthesizes the dominant market narrative of the day

**Trigger phrases:** latest news, morning briefing, crypto news, what's happening, market update, Weibo trending, Chinese social media, KOL views, breaking news…

---

### `sentiment-analyst`
**Path:** `skills/sentiment-analyst/SKILL.md` (in [`bitget-signal`](https://github.com/bitget/bitget-signal))

Crypto market sentiment and trader positioning analysis.

**What it does:**
- Reads the **Fear & Greed Index** with 14-day trend context
- Analyzes **long/short ratios** — both retail and top-trader accounts — to detect crowded positioning
- Monitors **funding rates** to identify over-leveraged market conditions
- Tracks **taker buy/sell ratio** for real-time buying/selling pressure
- Surfaces **open interest** trends to gauge leverage build-up or unwinding
- Scans **Reddit community buzz** for trending assets
- Synthesizes divergences between retail and smart-money positioning

**Trigger phrases:** fear and greed, long/short ratio, funding rate, open interest, overleveraged, short squeeze, market mood, community sentiment, Reddit trending…

---

### `technical-analysis`
**Path:** `skills/technical-analysis/SKILL.md` (in [`bitget-signal`](https://github.com/bitget/bitget-signal))

23 crypto technical indicators across 6 categories — local Python-based computation with Bitget API data.

**What it does:**
- Computes **23 technical indicators** across 6 categories: Trend (MA, EMA, SAR, AVL, MACD, DMI, SuperTrend), Volatility (BOLL, ATR), Oscillator (KDJ, RSI, ROC, CCI, WR, StochRSI), Volume (VOL, OBV, MFI, VWAP), Momentum (DMA, MTM, EMV), Support/Resistance (FIB)
- Outputs **time-series data** (not just single points) — AI can observe trend evolution, convergence/divergence, and write richer analysis
- Fetches kline data directly from **Bitget API** (spot and futures) or reads local CSV/Parquet/JSON files
- Supports all timeframes from scalp (`1min`) to position (`1w`)
- Provides **scenario-based defaults** for common queries (comprehensive analysis, trend direction, overbought/oversold, volume analysis, momentum, support/resistance, volatility)
- Exports full indicator data to CSV for plotting or downstream backtesting

**Trigger phrases:** technical analysis, indicator, trend, overbought, oversold, support, resistance, momentum, volatility, volume, MACD, RSI, KDJ, BOLL, SuperTrend, EMA, MA, ATR, VWAP, FIB, StochRSI, MFI, DMI, OBV, 4h analysis, should I buy/sell…

**Requirements:** Python with `pandas` and `numpy` (`pip install pandas numpy`)

---

## Using Skills Together

The five skills are designed to complement each other for a complete market picture:

| Question type | Skills to combine |
|---------------|-------------------|
| Full market assessment | `macro-analyst` + `sentiment-analyst` + `technical-analysis` |
| Is now a good time to buy BTC? | `market-intel` (cycle position) + `sentiment-analyst` (positioning) + `technical-analysis` (entry levels) |
| What's moving markets today? | `news-briefing` + `macro-analyst` |
| Is this altcoin worth looking at? | `market-intel` (DEX/on-chain) + `technical-analysis` (TA) + `sentiment-analyst` (crowd positioning) |

---

## Directory Structure

```
bitget-signal/skills/
├── macro-analyst/
│   └── SKILL.md              # Macro & cross-asset analysis
├── market-intel/
│   └── SKILL.md              # On-chain & institutional intelligence
├── news-briefing/
│   └── SKILL.md              # News aggregation & narrative synthesis
├── sentiment-analyst/
│   └── SKILL.md              # Sentiment & positioning analysis
└── technical-analysis/
    ├── SKILL.md              # Technical analysis — 23 indicators, 6 categories
    ├── references/
    │   ├── indicators.md     # Indicator quick reference
    │   └── scenarios.md      # Scenario-based indicator selection
    └── src/
        ├── kline_indicators.py       # 23 indicator implementations
        └── kline_indicator_utils.py  # Utility layer & IndicatorManager
```

---

## Required MCP Server

Most skills depend on the **`bitget-signal` MCP server** (`https://datahub.noxiaohao.com/mcp`) for live data. The `npm install -g bitget-signal` postinstall registers this server in your AI host config automatically.

The server provides: `crypto_market`, `defi_analytics`, `dex_market`, `sentiment_index`, `derivatives_sentiment`, `news_feed`, `social_trending`, `tradfi_news`, `network_status`, `rates_yields`, `macro_indicators`, `cross_asset`, `global_assets`, `global_data`, `cn_market`.

> **Note:** The `technical-analysis` skill does **not** use the MCP server. It fetches kline data directly from the Bitget API and runs indicator calculations locally in Python. Requires `pip install pandas numpy`.
