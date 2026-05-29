# Bitget Agent Hub 仓库拆分设计

> 本文说明 `agent_hub` 单仓项目拆分为 8 个独立仓的设计思路与最终结果，供后续接手 / 协作的同事参考。
> **范围**：只覆盖已落地的拆分。后续战略性扩展（Wallet Stack、Identity Stack 等）另文记述。

---

## 1 · 现状：单仓 monorepo

`agent_hub` 是一个 pnpm workspace monorepo：1 个 git 仓 · 1 份 CI · 1 条发布节奏 · 7 个内部包共用 `workspace:*` 互相引用。

| 包名 | 角色 | 功能 |
|---|---|---|
| `bitget-core` | 基础 | 56+ Bitget API 工具的共享库 |
| `bitget-test-utils` | 基础 | 本地模拟服务器（仅 workspace 私有） |
| `bitget-client` | 表层 | `bgc` 命令行 |
| `bitget-mcp` | 表层 | MCP 服务器 |
| `bitget-skill` | 表层 | Claude Code 交易技能 |
| `bitget-skill-hub` | 独立 | 5 个市场分析技能 |
| `bitget-hub` | 独立 | 总安装器 |

> **🖼 插图 1**：拆分前架构图  
> 文件：`diagrams/before-monorepo-cn.svg`  
> 位置：紧接本节末尾  
> 作用：让读者一眼看到「7 个包平铺在 monorepo 下、依赖箭头都汇向 `bitget-core`、底部黄色面板列出战略缺口」

---

## 2 · 现存问题

把问题分成两层看 —— 工程层是症状，战略层才是根因。

### 2.1 工程层（症状）

- **紧耦合**：`workspace:*` 把每个包绑在一起。CLI 改一个 bug，理论上要走全仓 CI、全仓发布。
- **命名混杂**：`bitget-core` / `bitget-test-utils` / `bitget-skill-hub` / `bitget-hub` 同时存在，没有可识别的命名体系。
- **混合受众**：交易代码、分析技能、安装器、测试工具全部平铺在 `packages/` 下作为兄弟。

### 2.2 战略层（根因）

- **没有受众切分**：开发者、交易用户、分析用户共用一条发布节奏，谁都不能按自己的速度演进。
- **没有品牌叙事**：仓名 / 包名不告诉用户「这玩意要不要 API Key、是工具还是产品」。
- **生长方式即兴**：下一个产品落到哪里？答案是「再加一个 `packages/` 子目录」—— 这不是设计，这是堆。

**核心判断**：我们不是在重新组织代码，而是在重新定义产品边界。

---

## 3 · 拆分思路

### 3.1 切分原则 —— Two-Stack 模型

按 **业务线** 而非 **受众层级** 切分：

| Stack | 业务核心 | 用户视角 |
|---|---|---|
| **Trading Stack** | 操作 Bitget 账户 | 「我用 AI 帮我交易」（自带 API Key） |
| **Signal Stack** | 调取 Bitget 数据 | 「我用 AI 帮我读市场」（无需 Key） |

每个 Stack 内部都呈现「1 Foundation + N Surfaces」的单向依赖结构。

### 3.2 命名约定 —— 前缀即凭证边界

把 **凭证模型** 直接写进仓名前缀：

| 前缀 | 含义 | 包含的仓 |
|---|---|---|
| `agent-*` | 操作账户类，需 API Key | `agent-sdk` · `agent-cli` · `agent-mcp` · `agent-skill` |
| `bitget-*` | 调取 Bitget 自家数据，无需 Key | `bitget-signal` · `bitget-signal-server` |

读者只看仓名前缀就能判断：要不要凭证、属于哪个产品栈。**前缀本身就是叙事。**

### 3.3 依赖治理

- Foundation → Surfaces 单向依赖，禁止循环
- 跨仓依赖通过已发布的 npm 版本号引用，不再有任何 `workspace:*`
- 每仓独立 git · 独立 CI · 独立 changesets · 独立发布节奏

### 3.4 兼容性

| 关注点 | 处理方式 |
|---|---|
| 老用户用 `bitget-core` import | `agent-sdk` 中保留 `core-stub/` 子包，继续发 `bitget-core@1.2.0`，纯 re-export |
| 老用户用 `bitget-test-utils` | 合并入 `agent-sdk/testing` subpath；mock-server bin 仍可用 |
| `bgc` 命令行 | 命令、flags、行为完全不变 |
| `bitget-skill-hub` 用户 | 在新仓 `bitget-signal` README 中给出迁移指引 |

---

## 4 · 拆分后架构

### 4.1 拓扑

8 个仓，分四类：

| 类别 | 仓 | npm 包 | 备注 |
|---|---|---|---|
| Meta | `.github` | — | GitHub 强制特殊仓名，含 org profile + 共享模板 |
| Portal | `agent-hub` | `bitget-hub` | 唯一入口 README + 总安装器 + 跨仓文档与 e2e |
| Trading · Foundation | `agent-sdk` | `bitget-agent-sdk` (+ `bitget-core` alias) | 56+ API 工具 |
| Trading · Surface | `agent-cli` | `bitget-client` (bin: `bgc`) | shell CLI |
| Trading · Surface | `agent-mcp` | `bitget-mcp-server` | MCP 服务器 |
| Trading · Surface | `agent-skill` | `bitget-skill` | 交易技能 |
| Signal · Surface | `bitget-signal` | `bitget-signal` | 市场信号技能 |
| Signal · Foundation | `bitget-signal-server` | — (private) | 行情数据后端 |

> **🖼 插图 2**：拆分后架构图  
> 文件：`diagrams/after-eight-repos-cn.svg`  
> 位置：紧接本表末尾  
> 作用：展示 Two-Stack 全景 —— 顶部 Meta + Portal 双仓、左右两栈各自的 Foundation/Surface 单向依赖、底部蓝色面板「为什么这么切 / 下一步去哪」战略定位

### 4.2 各模块定位（一句话级）

| 模块 | 定位 |
|---|---|
| `agent-hub` | 产品门户，所有用户的第一个落脚点 |
| `.github` | 组织级模板，承载 profile + issue/PR 模板 + CoC |
| `agent-sdk` | Trading Stack 的唯一基础库，给写代码的人 |
| `agent-cli` | shell-AI 入口（Claude Code、Codex CLI、OpenClaw） |
| `agent-mcp` | MCP-AI 入口（Claude Desktop、Cursor、Continue） |
| `agent-skill` | 让 shell-AI 学会**语义化**地用 `bgc` |
| `bitget-signal` | Signal Stack 的唯一公开表层；Bitget 独家信号陆续上线 |
| `bitget-signal-server` | Signal Stack 私有后端；信号在这里加工 |

---

## 5 · 关键决策记录

下面 4 条是拆分过程中需要"做出选择而不是默认接受"的关键决策，单独记录便于后续 review。

### 5.1 为什么 `agent-*` 与 `bitget-*` 双前缀共存而不统一

统一成 `agent-*` 会丢失「这是 Bitget 自家数据产品」的品牌叙事。`bitget-signal` 这个名字本身就是营销资产 —— 告诉用户「里面有 Bitget 独家数据」。**前缀的差别 = 凭证模型的差别 = 产品形态的差别**，三者互相佐证。

### 5.2 为什么每仓 `git init` 重起，不用 `filter-repo` 保留历史

monorepo 阶段 commit 数极少（4 个），保留历史价值有限；`git init` 干净简单，避免 `filter-repo` 引入的潜在 bug。原 `agent_hub` 仓继续保留作为对照。

### 5.3 为什么 `bitget-test-utils` 并入 `agent-sdk`，不独立发包

test-utils 没有独立的产品形态，只服务 SDK 自身测试 + 少数下游 contract test。通过 `agent-sdk/testing` subpath export 是行业惯例（如 `react-dom/test-utils`），减少一个发布通道。

### 5.4 为什么从 `bitget-skill-hub` 改名两次（→ `bitget-ai-analyst` → `bitget-signal`）

- 第一次 (`skill-hub` → `ai-analyst`)：早期对齐 `agent-*` / `ai-*` 双前缀的习惯思路
- 第二次 (`ai-analyst` → `bitget-signal`)：定位升级 —— 这个产品的真正价值是 **Bitget 独家信号**（top-trader-flow、derivatives-structure、large-flow-detect 三类，已埋好路线图占位），名字应该把品牌直接写进去

第二次改名同时把前缀体系从 `agent-* / ai-*` 演进为 `agent-* / bitget-*`。从此 `ai-*` 前缀腾出来，留给未来真正"通用、非品牌专属"的 AI 产品。

---

## 6 · 后续工作

| 项 | 状态 |
|---|---|
| 8 个本地仓 + git 初始化 | ✅ 已完成 |
| 包名重命名 + 跨仓依赖调整 + README 互链 | ✅ 已完成 |
| 4 张架构 SVG（中英各 2） | ✅ 已完成 |
| 每仓 CI workflow + changesets 配置骨架 | ✅ 已完成 |
| GitHub remote 仓创建 + 首次 push | ⏳ 待手动 |
| 在能联公网 npm 的环境验证 build/test | ⏳ 待执行 |
| `bitget-signal-server` 独家信号 endpoint 上线（路线图见其 README） | ⏳ 后续逐条 |

---

## 附录 · 完整路径映射

| 拆分前（monorepo 路径） | 拆分后（新仓） | npm 包变化 |
|---|---|---|
| `packages/bitget-core` | `bitget/agent-sdk` | `bitget-core` → `bitget-agent-sdk` (老名作为 alias 继续发) |
| `packages/bitget-test-utils` | merged into `bitget/agent-sdk` (`/testing` subpath) | 不再独立发布 |
| `packages/bitget-client` | `bitget/agent-cli` | `bitget-client` 名称不变 |
| `packages/bitget-mcp` | `bitget/agent-mcp` | `bitget-mcp-server` 名称不变 |
| `packages/bitget-skill` | `bitget/agent-skill` | `bitget-skill` 名称不变 |
| `packages/bitget-skill-hub` | `bitget/bitget-signal` | `bitget-skill-hub` → `bitget-signal` |
| `packages/bitget-hub` | merged into `bitget/agent-hub` (`installer/`) | `bitget-hub` 名称不变 |
| —（新建） | `bitget/.github` | — |
| —（新建） | `bitget/bitget-signal-server` | — (private) |
