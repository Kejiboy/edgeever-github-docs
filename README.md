# GitHub Docs · EdgeEver 主题

一款受 GitHub Primer 启发、为**运维与学习笔记**设计的 [EdgeEver](https://github.com/tianma-if/edgeever) 主题：克制的三层底色、清晰的侧栏/编辑器分层、绿色强调色、6px 圆角与 `JetBrains Mono` 优先的代码字体。

- 主题 ID：`com.kejiboy.themes.github-docs`
- 版本：`1.0.1`
- 模式：亮色 + 暗色（两套 token 完整，切换不残留默认值）
- 类型：纯无代码主题（只有 `manifest.json`，不执行任何 JavaScript）
- 许可证：MIT

> 主题不依赖你部署在哪里：EdgeEver 云端（Cloudflare）、自建 Docker、桌面端都通过“安装 Manifest 地址”加载主题，不需要往服务器放文件。

## 安装

### 部署在云端（Cloudflare / Docker / 官方实例）

云端实例的 `public/` 目录在构建镜像里，**不要**走本地路径，用公开 HTTPS 地址安装：

1. 把 `themes/github-docs/manifest.json` 放到公网可访问的位置。
2. 打开 EdgeEver「插件市场」，粘贴该 **manifest 的完整地址**。
3. 在主题列表里启用 **GitHub Docs**，分别检查亮色 / 暗色。

三种可用来源，按推荐顺序：

| 方式 | 市场里输入的格式 | 说明 |
| :--- | :--- | :--- |
| GitHub 仓库 | `https://github.com/Kejiboy/edgeever-github-docs` | 需要**仓库根目录**有 `manifest.json`（本仓库已提供，由 `npm run sync` 生成） |
| GitHub Release 文件 | `https://github.com/Kejiboy/edgeever-github-docs/releases/download/1.0.1/manifest.json` | 指向具体文件，最稳，不受上游限流影响 |
| GitHub Raw | `https://raw.githubusercontent.com/Kejiboy/edgeever-github-docs/main/manifest.json` | 直接指向文件，适合快速验证 |
| 静态托管 / CDN | `https://<domain>/manifest.json` | Cloudflare Pages、Netlify、对象存储均可 |

> **关于 403**：输入仓库地址时，EdgeEver 服务端会调用 GitHub API 读取**仓库根目录**的 `manifest.json`。如果根目录没有这个文件，或出口 IP 被 GitHub 限流（未认证 60 次/小时），就会报 `Repository manifest request failed with HTTP 403`。上表第 1 行依赖根目录文件；第 2、3 行是直连静态文件，可绕开该问题。

### 两份 manifest.json 的关系

```text
themes/github-docs/manifest.json   唯一可编辑的源文件
manifest.json                      仓库根副本，安装“仓库地址”时读取
```

只改源文件，然后 `npm run sync` 生成根副本。`npm run validate` 会检查两者逐字节一致，CI 也会拦截不同步的提交。

打 tag 时版本号必须与 `manifest.json` 的 `version` 一致：

```bash
git tag 1.0.1
git push origin 1.0.1
```

### 本地自建开发环境（可选）

只有你自己编译前端时才用这条：

1. 把 `manifest.json` 放到 `apps/web/public/extensions/github-docs/manifest.json`；
2. 在市场里输入 `/extensions/github-docs/manifest.json`。

## 预览与生成器

不需要装 EdgeEver 就能看效果：

```bash
npm run serve
```

- `http://127.0.0.1:4321/` —— 主题生成器：改品牌色、密度、圆角，实时看三栏效果并导出 `manifest.json`；
- `http://127.0.0.1:4321/demo/` —— 主题演示页：用真实排版（标题、表格、代码块、引用、任务列表）检查 token 是否成立，可切换亮/暗。

两者都是零依赖静态页面，也可以直接双击 `forge/index.html`、`demo/index.html` 打开。

## 目录

```text
themes/github-docs/manifest.json   主题清单（发布源文件）
forge/index.html                   主题生成器（零依赖静态页）
demo/index.html                    主题演示页（模拟三栏 + 排版示例）
scripts/check-manifest-sync.mjs      校验根副本与源文件一致
scripts/validate-theme.mjs         校验：token 格式、对比度、分层
scripts/package-theme.mjs          生成 dist/manifest.json 与校验和
scripts/serve.mjs                  本地静态服务
.github/workflows/validate.yml     CI：校验 + 产出构建物
.github/workflows/release.yml      Tag 发布：校验版本号并上传 Release 资产
```

## 命令

```bash
npm run sync       # 源文件 -> 仓库根 manifest.json
npm run validate   # 根副本一致性 + 格式 + WCAG 对比度 + 分层检查
npm run package    # 产出 dist/（manifest.json、index.json 含 sha256）
npm run serve      # 本地预览（生成器 + 演示页）
npm run check      # validate + package
```

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
| `font.mono` | `JetBrains Mono` 优先 | 同左 | 运维代码多 |
| `font.size` | `100%` | `100%` | 不改字号 |
| `lineHeight.body` | `1.65` | `1.65` | 与编辑器默认一致 |
| `radius.medium` | `6px` | `6px` | GitHub 圆角 |
| `density.scale` | `1.0` | `1.0` | 标准信息密度 |
| `editor.contentWidth` | `860px` | `860px` | 比默认 880 略窄 |

### 刻意的取舍

- **暗色侧栏刻意抬高一层。** 宿主把侧栏映射到 `surfaceMuted`、编辑器映射到 `surface`；如果两者太近，三栏会糊成一片。这里侧栏对编辑器保持约 1.29:1 的层次。
- **不用 GitHub 原版的 `#f6f8fa` 做亮色画布。** 它与侧栏色过近，会让侧栏失去边界；改用 `#f6faf7` 后，侧栏对编辑器 1.14:1、画布对编辑器 1.05:1。
- **中性色带极轻的绿色色相**（饱和度 +2%–4%），而不是纯灰，观感更接近 GitHub 的“灰里透色”。
- **强调色避开蓝色。** EdgeEver 的主按钮、选中态、复选框使用硬编码品牌绿，token 覆盖不了；强调色同样选绿色系，避免出现“两种绿”。

## 对比度实测（WCAG）

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

正文达到 AAA（≥7:1），弱文字达到 AA（≥4.5:1）。`npm run validate` 会把这些阈值变成可执行的检查，CI 也会跑。

## 主题能力的边界

主题只作用于 EdgeEver 公开的 18 个 token，以下内容不由主题控制：

- **代码高亮配色**：由编辑器主题（`editor-themes`）决定。想要 GitHub 风格的代码配色，请在编辑器主题里另选。
- 渐变、阴影、背景图、毛玻璃等装饰效果：主题 token 不支持。
- 单个组件的独立配色（例如只看板卡片）：不支持。
- Mermaid / 原生图表配色：由图表主题独立选择，不跟随此主题。
- 部分界面使用硬编码品牌色，token 覆盖不了（见上面的取舍说明）。

## 验收清单

安装后逐项检查：

1. 亮色下三栏有层次：画布 < 侧栏块 < 编辑器白底；
2. 暗色下侧栏明显比编辑器亮一层，选中行可辨识；
3. 主按钮、选中态、复选框是绿色，且文字清晰；
4. 切换亮/暗时没有残留色（侧栏、选中行不会突然变回默认灰）；
5. 含代码块的笔记里等宽字体为 JetBrains Mono（未安装时回退系统等宽）；
6. 正文宽度 860px，长文档两侧留白舒展；
7. 警告 / 危险色的提示块可读。

## 上架到官方市场（可选）

官方市场要求：公开仓库、OSI 许可证、未经混淆的源码与构建说明、Release 对应不可变的 tag。本仓库已满足前四项；提交时按 [官方上架政策](https://github.com/tianma-if/edgeever/blob/main/docs/plugin-marketplace-policy.zh-CN.md) 走即可。

## 致谢

色彩取自已开源的 [GitHub Primer](https://primer.style/)，仅借鉴其语义色与圆角，未复制其代码。

## 许可证

[MIT](LICENSE)
