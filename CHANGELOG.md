# Changelog

All notable changes to `bitget-agent-installer` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-29

### Added
- **Provenance attestations** on published artefacts (`publishConfig.provenance: true`) for supply-chain verification on npm.

### Changed
- **Renamed package: `bitget-hub` → `bitget-agent-installer`.** The new name describes what the tool actually does: install, upgrade, and rollback the Bitget agent package family across multiple AI hosts. The previous `bitget-hub` name is no longer maintained on npm.
- **Renamed binary: `bitget-hub` → `bitget-agent-installer`.** Update any wrapper scripts:
  ```diff
  - npx bitget-hub upgrade-all
  + npx bitget-agent-installer upgrade-all
  ```
- **Repo unchanged** (`bitget/agent-hub`). Only the npm package name changed. The portal repo continues to host docs, assets, the cross-repo e2e test, and the installer source under `installer/cli.mjs`.
- **`TARGET_PACKAGES` updated** to the new package family:
  ```diff
  - ["bitget-skill", "bitget-signal", "bitget-client"]
  + ["bitget-agent-skill", "bitget-signal", "bitget-agent-cli"]
  ```
- **Bug fix: `--version` was crashing.** The installer's `cli.mjs` referenced `./package.json` with a path that broke after the script moved into the `installer/` subdirectory during the monorepo split. Now correctly resolves `../package.json`. Without this fix, every invocation of `bitget-agent-installer --version`, `--help`, or any subcommand would have thrown `Cannot find module './package.json'`.
- **Bug fix: e2e smoke-test report path.** `e2e/mcp-smoke-test.mjs` previously wrote to `scripts/mcp-smoke-report.*.json`, a path that no longer exists after the split. Now writes to the current working directory.
- **Minimum Node.js version: 20.0.0** (was 18). Node 18 reached end-of-life in April 2025.

### Unchanged
- All commands and flags: `upgrade-all`, `upgrade <pkg>`, `rollback <pkg> --to <version>`, `install [pkg] [--target <tools>]`, `--dry-run`, `--target`, `--interactive`.
- Cross-repo MCP smoke test (`npm run e2e`) — same coverage, same WARN/PASS criteria.
- Documentation portal lives in this repo's `docs/` directory.

[1.1.0]: https://github.com/bitget/agent-hub/releases/tag/v1.1.0
