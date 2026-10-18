# helm-d-plugin（可直接安装的插件仓库）

本仓库是 **helm-d** 插件的「**仓库根目录即插件包**」分发形态，专为 DeepSeek Harness 桌面客户端
「设置 → 插件 → 添加插件」输入框直接填 Git 地址安装而准备。

## 来源与改动声明

- 上游项目：`ADWMC/helm-d`（v0.4.3）
- 上游仓库是 pnpm monorepo，真正的插件包在子目录 `packages/helmd` 里，仓库根是 `"private": true` 的 workspace 根。
- 桌面客户端的安装输入框**只接受 host/owner/repo 三段式 Git 地址**，无法表达子目录，
  因此直接填 `github:xiaofeng11122/helm-d` 装到的是 monorepo 根（没有 `dsh.bundle`，不会被识别为插件）。
- 本仓库把 `packages/helmd` 的内容提到**仓库根**，并提交了已编译的 `dist/`，
  使 `github:xiaofeng11122/helm-d-plugin` 可以被直接安装。
- 维护者：xiaofeng11122（AI 协助完成适配与打包）。

## 相对上游的适配改动

1. `peerDependencies` / `devDependencies` 中的 `@deepseek-ai/dsh-settings`、`@deepseek-ai/dsh-tools`
   版本范围追加 `|| ^0.2.1-rc.1`（原范围 `^0.2.0-rc.1` 在 semver 预发布规则下不匹配 `0.2.1-rc.2`）。
2. 包名改为 `@xiaofeng11122/helm-d`，并同步 `cordis.patch.yml`、`preset.generated.patch.yml`、
   `client.js`、`src/health.ts`（健康检查正则）中的引用。
3. 移除 `prepare` 脚本（原脚本会在安装时触发 `tsc` 重新构建；本仓库已提交编译之后的 `dist/`）。
4. 未改动任何业务逻辑与工具实现，功能与上游一致。

## 安装

在 DeepSeek Harness 桌面客户端「设置 → 插件 → 添加插件」中填入：

```
github:xiaofeng11122/helm-d-plugin
```

或使用本地安装包（离线）：

```
D:\helm-d-plugin\helmd.tgz
```

安装完成后重启 DSH，在会话中发送 `helmd` 激活。

## 目录说明

| 路径 | 说明 |
|---|---|
| `dist/` | 编译产物（入口 `dist/health.js`），已提交，安装后直接可用 |
| `src/` | TypeScript 源码，便于二次开发 |
| `cordis.patch.yml` | 组合包补丁（注册 `helmd-health`、`helmd-hcot-settings` 两个 Entry） |
| `preset.generated.patch.yml` | 预设补丁（注册 agent 行） |
| `client.js` | Web 端客户端模块 |
| `references/` `presets/` `scripts/` | 上游随包资料与脚本 |
