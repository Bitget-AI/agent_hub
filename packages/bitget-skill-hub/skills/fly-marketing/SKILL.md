---
name: fly-marketing-agent
description: |
  Fly Marketing Agent - 9平台营销自动化 + 加密交易智能体。
  集成抖音、小红书等社交媒体内容生成，结合Bitget Agent Hub交易能力。
  Auto-run on triggers: '营销内容', '社交媒体', '内容生成', '抖音推广', '小红书运营',
  'bitget交易分析', '加密营销策略'.
metadata:
  author: fly-marketing-team
  version: "1.0"
  license: MIT
  tags: [marketing, social-media, content-generation, bitget, trading, douyin, xiaohongshu, automation]
---

# Fly Marketing Agent for Bitget Agent Hub

**AI Marketing + Trading Integration Agent**

Fly is the first AI agent that combines social media marketing automation with Bitget's comprehensive trading ecosystem. While other agents focus on either marketing OR trading, Fly bridges both worlds—enabling crypto projects and traders to generate engaging content while executing trades, all through natural language.

> **Target Users**: Crypto projects, trading educators, KOLs, copy-trading operators, and traders who want to automate both their marketing and trading workflows.

---

## Core Philosophy

### Why Fly Marketing + Trading

| Traditional Marketing Tools | Fly for Bitget |
|---------------------------|----------------|
| Separate marketing and trading tools | Unified AI agent for both |
| Manual content + trade execution | Natural language to both |
| No crypto-native insights | Bitget ecosystem data |
| No audience engagement tracking | Real-time sentiment analysis |
| Siloed workflows | Marketing → Trading → Analytics |

### Fly + Bitget Integration Advantages

1. **Content-Driven Trading**: Generate trading insights and share them on social media automatically
2. **Copy-Trading Marketing**: Promote your trading strategies while executing them
3. **9-Platform Coverage**: Douyin, Xiaohongshu, WeChat, Twitter, Telegram, and more
4. **Real-Time Market Data**: Bitget ecosystem data integrated into content generation
5. **ERC-8004 Compliance**: Built on Agent World standards with x402 payment support

---

## Marketing + Trading Use Cases

### 1. Trading Signal Content Generation

Generate engaging trading content with real market data:

```
Trigger Examples:
- "生成今日BTC交易信号并发布到微博"
- "Create trading signal post for ETH with technical analysis"
- "bitget信号发布：多空比分析"
- "生成合约交易教学小红书内容"
```

**Capabilities:**
- Technical analysis (K-line patterns, indicators)
- Funding rate analysis for signal credibility
- Copy-trading performance highlights
- Risk disclosure generation (required for compliance)

### 2. Copy-Trading Operator Dashboard

Manage your copy-trading business with marketing support:

```
Trigger Examples:
- "查看跟单交易表现并生成周报"
- "Create follower recruitment post"
- "bitget运营：本周收益公示"
- "生成交易员招募推广内容"
```

**Capabilities:**
- PnL report generation with charts
- Performance attribution analysis
- Social media post templates
- Follower engagement metrics

### 3. KOL Trading Education

Create educational content while demonstrating trading:

```
Trigger Examples:
- "生成合约入门教程内容"
- "Create thread about grid trading strategy"
- "bitget教学：如何设置止损"
- "发布仓位管理教学视频脚本"
```

**Capabilities:**
- Step-by-step trading tutorials
- Risk management education content
- Strategy explanation templates
- Interactive Q&A generation

### 4. Crypto Project Marketing

Promote crypto projects with integrated trading insights:

```
Trigger Examples:
- "生成项目推广内容，结合市场分析"
- "Create airdrop promotion post"
- "bitget项目：IEO参与攻略"
- "发布代币合约分析报告"
```

**Capabilities:**
- Market sentiment integration
- Technical analysis reports
- Community engagement content
- Multi-platform publishing

### 5. Social Trading Feed

Aggregate and share trading insights:

```
Trigger Examples:
- "生成今日交易员榜单内容"
- "Create top traders highlight reel"
- "bitget热点：今日热门交易"
- "发布跟单交易员精选内容"
```

**Capabilities:**
- Top trader rankings
- Performance leaderboards
- Market sentiment summaries
- Trending assets analysis

---

## Intent Recognition

| User Input Pattern | Detected Intent | Output |
|-------------------|-----------------|--------|
| "交易信号" / "trading signal" | Signal generation | Chart + entry/exit + risk |
| "推广" / "promotion" | Marketing content | Social post + copy |
| "教学" / "education" | Trading education | Tutorial + tips |
| "收益" / "pnl" | Performance report | Metrics + chart |
| "招募" / "recruit" | Follower acquisition | Campaign + copy |
| "分析" / "analysis" | Market analysis | Technical + sentiment |

---

## Marketing Platform Integration

### Supported Platforms

| Platform | Content Type | Auto-Publish |
|----------|-------------|--------------|
| Douyin | Short video scripts, captions | ✅ |
| Xiaohongshu | Posts, carousels | ✅ |
| Weibo | Threads, images | ✅ |
| Twitter/X | Threads, polls | ✅ |
| Telegram | Messages, bots | ✅ |
| Discord | Rich embeds | ✅ |
| Bilibili | Video scripts | ✅ |
| Zhihu | Articles, Q&A | ✅ |
| WeChat | Official account posts | ✅ |

### Content Templates

```
Trading Signal Template:
---
📊 {Symbol} {Direction} Signal
💰 Entry: {Price}
🎯 Target: {TP}
🛡️ Stop: {SL}
📈 Leverage: {Leverage}x
⏰ Timeframe: {Timeframe}
💡 Analysis: {BriefAnalysis}
⚠️ Risk: {RiskWarning}
---

Education Template:
---
📚 {Topic} Trading Guide

Step 1: {Step1}
Step 2: {Step2}
Step 3: {Step3}

💡 Tips: {Tips}
⚠️ Disclaimer: {Disclaimer}
---
```

---

## Bitget Agent Hub Integration

### Installation

```bash
# Add Fly Marketing skill to Bitget Agent Hub
npx bitget-hub install fly-marketing --target claude

# Or use with OpenClaw
npx skills add fly-marketing
```

### Marketing-First Workflow

```
User: "生成BTC交易信号并发布到小红书"
    │
    ▼
┌─────────────────────────────────────┐
│ Market Analysis (Bitget API)        │
│ - K-line patterns                  │
│ - Funding rate comparison           │
│ - Volume profile                   │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ Signal Generation                   │
│ - Entry/exit points                │
│ - Risk parameters                  │
│ - Technical indicators             │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ Content Creation (Fly Marketing)   │
│ - Trading signal post              │
│ - Technical analysis image         │
│ - Risk disclosure                 │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ Platform Publishing                │
│ - Douyin, Xiaohongshu, Weibo       │
│ - Engagement tracking              │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ Trade Execution (Optional)         │
│ - Execute via Bitget if confirmed  │
│ - Real-time monitoring             │
└─────────────────────────────────────┘
```

---

## Risk Control for Marketing

### Content Risk Guidelines

| Content Type | Risk Level | Required Disclosures |
|--------------|------------|---------------------|
| Trading signals | High | "Not financial advice", past performance disclaimer |
| Educational | Low | General risk warning |
| Promotional | Medium | No guaranteed returns |
| Performance reports | Medium | "Past performance ≠ future results" |

### 🚫 Prohibited Content

- Guaranteed profit claims
- Misleading performance statistics
- Unofficial trading signals
- Content violating exchange policies

### ✅ Required Elements

- Risk disclaimer on all trading content
- "Not financial advice" statement
- Clear performance attribution
- Appropriate audience targeting

---

## Fly Marketing Agent Information

### ERC-8004 Agent ID
- **Agent ID**: 91852
- **Explorer**: https://8004scan.io/agent/91852

### Key Features
- 9-platform social media automation
- Bitget trading integration
- x402 payment protocol support
- MCP (Model Context Protocol) enabled
- Three-tier compliance system

### Compliance Standards
- ERC-8004 Agent World compliance
- x402 payment integration
- Multi-platform content policies
- Crypto trading regulations

---

## Error Handling

### Content Generation Errors

| Error | Action |
|-------|--------|
| Platform API timeout | Retry with exponential backoff |
| Content policy violation | Regenerate with safe mode |
| Rate limit exceeded | Queue and schedule |
| Image generation failed | Use text-only fallback |

### Trading Integration Errors

| Error | Action |
|-------|--------|
| Bitget API unavailable | Skip trading, marketing only |
| Auth expired | Prompt re-authentication |
| Order failed | Notify user with error code |

---

## CLI Reference

### Fly Marketing Commands

```bash
# Generate trading signal content
fly-marketing signal --symbol BTC --direction long --platform xiaohongshu

# Create educational content
fly-marketing educate --topic "Grid Trading" --platforms douyin,weibo

# Publish to multiple platforms
fly-marketing publish --content "..." --platforms all

# Analytics dashboard
fly-marketing stats --platforms all --period 7d

# Content calendar
fly-marketing calendar --add "Trading tips" --schedule daily
```

---

*Document Version: 1.0*
*Compatible: Bitget Agent Hub v2.0+, Fly Marketing v1.0+*
*License: MIT*
*Agent ID: 91852*
