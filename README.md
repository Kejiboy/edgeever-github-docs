# GitHub Docs

一款受 GitHub Primer 启发、为**运维与学习笔记**设计的 [EdgeEver](https://github.com/tianma-if/edgeever) 主题。

- 亮色 + 暗色两套完整 token
- 纯无代码主题：只有一个 `manifest.json`，不执行 JavaScript
- 主题 ID：`com.kejiboy.themes.github-docs`
- 当前版本：`1.0.1`

## 安装

在 EdgeEver 的「插件市场」里输入本仓库地址：

```text
https://github.com/Kejiboy/edgeever-github-docs
```

安装后到主题列表启用 **GitHub Docs**，再分别切换亮色和暗色确认。

本仓库为“直接输仓库地址安装”准备了三个必需的文件，都在**仓库根目录**：

| 文件 | 用途 |
| :--- | :--- |
| `manifest.json` | 安装时读取的清单，必须存在且版本号与 Release 一致 |
| `LICENSE.md` | 客户端拉取清单失败时会回退到 raw 地址读取它 |
| Release `manifest.json` | 打 tag 后由 CI 生成的发布资产 |

`manifest.json` 由 `npm run sync` 从 `themes/github-docs/manifest.json` 生成，两份内容必须逐字节一致，`npm run validate` 和 CI 都会检查。

## 目录

```text
manifest.json                      仓库根清单（安装入口，由 sync 生成）
LICENSE.md                         仓库根许可证（raw 回退读取）
themes/github-docs/manifest.json   主题源文件，唯一可编辑的清单
forge/index.html                   主题生成器（静态页）
demo/index.html                    主题演示页（三栏 + 排版示例）
scripts/                           校验、打包、本地预览
.github/workflows/                 校验与发布
```

## 本地预览

```bash
npm run serve
```

- `http://127.0.0.1:4321/`：主题生成器，改品牌色、密度、圆角并导出 `manifest.json`
- `http://127.0.0.1:4321/demo/`：主题演示页，检查标题、表格、代码块、引用与任务列表

两个页面都是零依赖静态 HTML，也可以直接双击打开。

## 命令

```bash
npm run sync       # 源文件 -> 仓库根 manifest.json
npm run validate   # 两份清单一致性 + token 格式 + WCAG 对比度
npm run package    # 生成 dist/manifest.json 与 sha256
npm run serve      # 本地预览
npm run check      # validate + package
```

## 发布新版本

版本号改动顺序：先改 `themes/github-docs/manifest.json` 的 `version`，再同步、再打 tag。

```bash
npm run sync
npm run validate
git commit -am "chore: release 1.0.2"
git push
git tag 1.0.2
git push origin 1.0.2
```

`release.yml` 会核对 tag 与 `version` 是否一致，不一致直接失败；一致则把 `dist/manifest.json` 上传为 Release 资产。

## Token

| token | 亮色 | 暗色 | 说明 |
| :--- | :--- | :--- | :--- |
| `color.background` | `#f6faf7` | `#010903` | 工作区最外层画布 |
| `color.surface` | `#ffffff` | `#0c1810` | 编辑器、笔记列表 |
| `color.surfaceMuted` | `#e6f3ea` | `#1f2f24` | 侧栏、选中行 |
| `color.text` | `#1e2921` | `#e6f3ea` | 正文 |
| `color.textMuted` | `#57705e` | `#8fa395` | 次要文字、占位 |
| `color.border` | `#d0e1d5` | `#3b4f41` | 分隔线、输入框 |
| `color.accent` | `#1a7f37` | `#5ede83` | 主按钮、选中态 |
| `color.accentForeground` | `#ffffff` | `#010409` | 主按钮文字 |
| `color.success` | `#1a7f37` | `#5ede83` | 成功 |
| `color.warning` | `#9a6700` | `#d29922` | 警告 |
| `color.danger` | `#cf222e` | `#f85149` | 危险 / 删除 |
| `font.body` | 系统字体栈 | 同左 | 与 GitHub 一致 |
| `font.mono` | `JetBrains Mono` 优先 | 同左 | 代码字体 |
| `font.size` | `100%` | `100%` | 不改字号 |
| `lineHeight.body` | `1.65` | `1.65` | 与编辑器默认一致 |
| `radius.medium` | `6px` | `6px` | GitHub 圆角 |
| `density.scale` | `1.0` | `1.0` | 标准信息密度 |
| `editor.contentWidth` | `860px` | `860px` | 比默认 880 略窄 |

### 刻意的取舍

- **暗色侧栏抬高一层。** 宿主把侧栏映射到 `surfaceMuted`、编辑器映射到 `surface`，两者太近三栏会糊成一片；这里保持约 1.29:1 的层次。
- **亮色画布不用 `#f6f8fa`。** 它与侧栏色过近，会让侧栏失去边界；改用 `#f6faf7` 后，侧栏对编辑器 1.14:1、画布对编辑器 1.05:1。
- **中性色带极轻的绿色色相**（饱和度 +2%–4%），而不是纯灰。
- **强调色避开蓝色。** EdgeEver 的主按钮、选中态、复选框使用硬编码品牌绿，token 覆盖不了；强调色同色相可避免“两种绿”。

## 对比度（WCAG）

| 检查项 | 亮色 | 暗色 |
| :--- | ---: | ---: |
| 正文 / 编辑器底色 | 15.06:1 | 15.92:1 |
| 正文 / 画布 | 14.30:1 | 17.64:1 |
| 弱文字 / 编辑器底色 | 5.41:1 | 6.80:1 |
| 弱文字 / 侧栏 | 4.73:1 | 5.26:1 |
| 按钮文字 / 强调色 | 5.08:1 | 11.98:1 |
| 强调色 / 画布 | 4.82:1 | 11.76:1 |
| 警告文字 / 画布 | 4.62:1 | 7.99:1 |
| 危险文字 / 画布 | 5.08:1 | 6.01:1 |

## 主题能力边界

主题只作用于 EdgeEver 公开的 18 个 token，以下不由主题控制：

- 代码高亮配色：由编辑器主题决定
- 渐变、阴影、背景图、毛玻璃：token 不支持
- 单个组件的独立配色：不支持
- Mermaid / 原生图表配色：由图表主题独立选择

## 致谢

色彩借鉴自开源的 [GitHub Primer](https://primer.style/)，仅取语义色与圆角，未复制其代码。

## 许可证

[MIT](LICENSE.md)
