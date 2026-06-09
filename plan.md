# Favicon 实施计划

## 范围

新增网站 favicon，使用当前顶部导航已有的蓝色圆角 `W` 标识风格生成 SVG，不修改业务功能。

## 实施步骤

1. 新增 `public/favicon.svg`，绘制蓝色圆角底和白色加粗 `W`。
2. 更新 `index.html`，在 `<head>` 中引用 SVG favicon。
3. 运行 `npm run build` 验证构建。

# 前端技术栈说明文档实施计划

## 范围

新增 `FRONTEND_TECH_STACK.md`，按当前项目真实情况说明前端技术栈。不修改业务代码。

## 实施步骤

1. 说明核心技术栈：Vite、Vue 3、JavaScript、Vue Router、Tailwind CSS。
2. 说明项目未使用 Ant Design、Element Plus、Naive UI、shadcn/ui 等 UI 组件库。
3. 说明 CodeMirror、js-yaml、vue-json-pretty、浏览器原生 API 的用途。
4. 说明目录结构、构建输出和静态部署形态。
5. 写入后运行构建验证项目不受影响。

# YAML 字段提取实施计划

## 范围

在现有 `YAML 格式化` 页面增加字段提取能力，支持 `tun`、`tun.dns-hijack` 等子字段路径。YAML 原文块优先保留注释和格式；JSON 输入解析后输出 YAML 片段。

## 实施步骤

1. 扩展 `src/utils/yaml.js`，新增 `extractYamlField(text, path)`。
2. 字段路径支持点分隔子字段；解析校验后优先按原文缩进切片，找不到原文块时用 `js-yaml` 输出字段片段。
3. 更新 `src/views/YamlView.vue`，增加字段路径输入框和 `提取字段` 按钮。
4. 更新 YAML 示例和 README 功能说明。
5. 用 YAML 原文、子字段、JSON 输入验证，再运行 `npm run build` 并做 diff review。

# Base64 编解码实施计划

## 范围

新增独立 `Base64 编解码` 文本工具，使用左右排版，不合并到 `Base64 转图片`。

## 实施步骤

1. 扩展 `src/utils/base64.js`，新增 UTF-8 文本 Base64 编码、解码函数。
2. 新增 `src/views/Base64TextView.vue`，复用现有工具页结构，提供编码 / 解码、复制、分栏切换、示例、清空。
3. 更新 `src/router/index.js`，新增 `/base64` 路由，保留 `/base64-image`。
4. 更新 `README.md` 功能表和工具数量。
5. 运行 `npm run build`，再基于 diff 做 code review。

# Shell 转单行实施计划

## 范围

将现有 `curl 转单行` 合并为通用 `Shell转单行`，保留 `/curl` 入口，不新增独立 bash 页面。

## 实施步骤

1. 在 `cmdJoin.js` 增加 `joinShell`，复用反斜杠续行合并逻辑，并保留 `joinCurl` 兼容现有引用。
2. 将 `CurlView.vue` 标题、说明、占位文案改为 Shell 语义，示例继续使用 curl 作为典型 Shell 命令。
3. 将 `/curl` 路由标题改为 `Shell转单行`。
4. 更新 README 功能表对应条目。
5. 运行 `npm run build`，再基于 diff 做 code review。

# GitHub 镜像转换实施计划

# JSON/YAML 分屏缩放与单栏查看实施计划

# 全工具分屏缩放、单栏查看与结果可编辑实施计划

# 全工具自适应排版调整实施计划

# GitHub 镜像页视觉增强实施计划

## 范围

增强 GitHub 镜像转换页默认卡片界面，保留现有上下拖拽、单栏切换和“卡片/文本”双视图。其他工具页不做结构性改动。

## 交互与视觉

1. 默认继续显示彩色卡片视图。
2. 每条镜像链接使用“彩色前缀标签 + 链接内容”的结构。
3. 每条链接提供“复制”“打开”操作。
4. 每组结果展示来源类型：仓库、文件、Raw、Release 或未知。
5. 普通代理、jsDelivr、警告提示使用不同颜色层级。
6. 文本视图继续可编辑，复制优先复制文本视图内容。

## 实施步骤

1. 在 `GithubMirrorView.vue` 增加链接类型识别、单条复制与打开函数。
2. 优化卡片模板结构和颜色样式。
3. 修正文本输出格式函数缩进。
4. 运行构建并浏览器抽查 GitHub 镜像页。

## 范围

在全工具分屏能力基础上，按工具形态选择默认布局：对照类工具使用左右布局，短结果/文本清洗类工具使用上下布局。上下布局同样支持拖拽调整输入与结果区域高度。

## 默认布局

1. 左右布局：JSON、YAML、HTML、Base64。
2. 上下布局：CLI、curl、PowerShell、URL、GitHub 镜像。
3. 所有布局都支持“只看原文”“只看结果”。
4. 文本结果可编辑：JSON、YAML、CLI、curl、PowerShell、URL、GitHub 文本视图。
5. 预览结果保持预览语义：HTML、Base64 只支持查看/拖拽，不把预览区改成文本编辑器。

## 实施步骤

1. 完成 `ToolLayout` 横向/纵向拖拽能力。
2. 用 `PanelViewButtons` 统一各工具单栏切换。
3. 为上下布局工具设置 `stacked`。
4. 将文本输出从只读改为可编辑。
5. 为 GitHub 镜像增加可编辑文本视图，保留卡片视图。
6. 运行构建并浏览器抽查。

## 范围

扩展所有使用 `ToolLayout` 的工具页：支持分隔条拖拽调整输入/结果区域大小，支持“只看原文”“只看结果”，并让文本类结果可直接编辑。

## 交互规则

1. 普通双栏工具页桌面端支持左右拖拽。
2. `stacked` 工具页支持上下拖拽。
3. 单栏按钮在当前模式下再次点击恢复双栏。
4. 文本输出页结果区可编辑：JSON、YAML、CLI、curl、PowerShell、URL。
5. HTML 与 Base64 的右侧是预览，不改成文本编辑；仍支持拖拽与只看结果。
6. GitHub 镜像页保留卡片视图，并增加可编辑文本视图；复制优先使用当前文本结果。

## 实施步骤

1. 扩展 `src/components/ToolLayout.vue`，根据 `stacked` 自动使用横向或纵向拖拽。
2. 新增共享 `PanelViewButtons` 组件，统一单栏切换按钮。
3. 为所有工具页接入 `panelView`、`resizable` 和单栏按钮。
4. 移除文本输出页 `readonly`，改为 `v-model="output"`。
5. 为 GitHub 镜像页增加“卡片/文本”结果视图与可编辑文本结果。
6. 运行 `npm run build` 并浏览器抽查。

## 范围

仅增强 JSON 格式化与 YAML 格式化页面：支持输入/输出分栏拖拽调整宽度，并增加“只看原文”“只看结果”按钮。其他工具页默认行为不变。

## 交互规则

1. 桌面端双栏默认 50/50，中间显示可拖动分隔条。
2. 拖拽调整父布局内左右面板比例，而不是调整编辑器自身尺寸。
3. 每侧保留最小宽度，避免 CodeMirror 被压缩到不可用。
4. 移动端继续上下堆叠，不启用横向拖拽。
5. “只看原文”和“只看结果”作为双栏/单栏切换；再次点击当前按钮恢复双栏。
6. JSON 输出区现有“文本/树形”切换保留。

## 实施步骤

1. 改造 `src/components/ToolLayout.vue`，新增可选 `resizable` 与 `viewMode` 能力。
2. 使用 Pointer Events 实现 gutter 拖拽，限制比例范围。
3. 在 `src/views/JsonView.vue` 与 `src/views/YamlView.vue` 增加视图状态和两个切换按钮。
4. 运行 `npm run build` 验证。

## 范围

新增独立工具页 `GitHub 镜像转换`，复用现有 WebTools 双栏布局、按钮、状态条与导航风格，不改动现有工具行为。

## 转换规则

1. 支持用户输入 GitHub 仓库、仓库文件、raw 文件、release asset 链接。
2. 支持勾选代理源，默认勾选 `gh-proxy.com` 和 `jsDelivr`。
3. 普通代理按 `https://proxy/${URL_RAW}` 生成：`gh-proxy.com`、`ghproxy.net`、`ghfast.top`。
4. `jsDelivr` 单独转换为 `https://cdn.jsdelivr.net/gh/{owner}/{repo}@{version}/{path}`。
5. `jsDelivr-CF` 单独转换为 `https://testingcf.jsdelivr.net/gh/{owner}/{repo}@{version}/{path}`。
6. 输出顺序固定为：`gh-proxy.com` 最前，其他普通代理居中，`jsDelivr` 与 `jsDelivr-CF` 最后。
7. release asset 生成 jsDelivr 仓库文件候选链接，并提示该链接依赖文件实际存在于对应分支或 tag。

## 实施步骤

1. 新增 `src/utils/githubMirror.js`，放置代理定义、GitHub URL 解析与转换纯函数。
2. 新增 `src/views/GithubMirrorView.vue`，实现输入、代理勾选、复制、示例、清空与输出。
3. 更新 `src/router/index.js`，加入 `GitHub 镜像转换` 路由与导航。
4. 更新 `README.md` 功能表。
5. 运行 `npm run build`，并用实际网络请求验证仓库文件与 release asset 链接可下载。

---

# WebTools 在线开发者工具聚合 — 技术方案与实施计划

> json.cn 风格的前端开发者工具聚合 SPA：顶部导航栏 + 左输入/右输出双栏，浅蓝/绿色简洁风格。纯前端、零后端、静态托管。

---

## 1. 工具清单（按导航顺序）

| # | 工具 | 输入（左） | 输出（右） | 编辑器 |
|---|------|-----------|-----------|--------|
| 1 | JSON 格式化 | 原始 JSON | 格式化文本 + 可折叠树形 | CodeMirror |
| 2 | YAML 格式化 | YAML | 美化 YAML + YAML⇄JSON 互转 | CodeMirror |
| 3 | CLI 排版 | CLI 复制的文本 | 去缩进 + 合并换行后的文本 | textarea |
| 4 | HTML 渲染 | HTML 代码 | 沙箱 iframe 实时渲染 | CodeMirror |
| 5 | curl 多行转单行 | 多行 curl | 单行命令 | textarea |
| 6 | PowerShell 多行转单行 | 多行 PS | 单行命令 | textarea |
| 7 | Base64 转图片 | Base64 / dataURL | 图片预览 + 下载 | textarea |
| 8 | URL 编码/解码 | 文本 / 编码串 | 编/解码结果 | textarea |

---

## 2. 技术选型

> 依据：参考站调研 + Codex 两轮评审。核心取舍：去 Element Plus（Tailwind-only）、CodeMirror 仅用于结构化语言、curl/PS/CLI 定位为"文本规范化"而非解析器。

| 类别 | 选型 | 理由 |
|------|------|------|
| 构建 | **Vite 6**（最新稳定） | 现代、快、HMR |
| 框架 | **Vue 3** `<script setup>` | 轻量、响应式 |
| 语言 | **JavaScript** | 工具逻辑简单，精简优先 |
| 路由 | **Vue Router 4** + 懒加载 + hash 模式 | 每工具独立 URL、可静态部署免 rewrite |
| 样式 | **Tailwind CSS 3**（不用 Element Plus） | 轻量、自定义配色更像 json.cn、零主题冲突 |
| 编辑器 | **CodeMirror 6**（vue-codemirror 封装） | 行号+高亮+大文本性能；仅 JSON/HTML/YAML |
| JSON 树 | **vue-json-pretty** | 可折叠树形，贴近 json.cn |
| YAML | **js-yaml** | 解析/序列化标准库 |
| 状态 | 不用 Pinia | 工具独立，组件内 state 足够 |

---

## 3. 项目结构

```
webtools/
├── index.html
├── package.json · vite.config.js · tailwind.config.js · postcss.config.js
├── plan.md
└── src/
    ├── main.js · App.vue
    ├── assets/main.css            # Tailwind 指令 + 主题变量
    ├── router/index.js            # 懒加载路由 + meta.title（导航单一数据源）
    ├── components/
    │   ├── TheNavbar.vue          # 顶部导航（读 router routes，高亮当前项）
    │   ├── ToolLayout.vue         # 标题 + 工具条插槽 + 左右分栏 + 移动端堆叠
    │   ├── EditorPane.vue         # 输入：mode='code'(CodeMirror) | 'text'(textarea)
    │   ├── ActionToolbar.vue      # 复制/清空/下载/示例 + 自定义动作插槽
    │   └── ResultStatus.vue       # 统一 success/error 状态条
    ├── composables/
    │   ├── useClipboard.js        # 复制（clipboard API + execCommand 回退）
    │   └── useDownload.js         # Blob 下载
    └── utils/
        ├── dedent.js              # 去公共最小前导缩进（忽略空行）
        ├── json.js                # 格式化/压缩/校验
        ├── yaml.js                # dedent → load → dump；YAML⇄JSON
        ├── cliReflow.js           # CLI 文本去缩进 + wrap 合并
        ├── cmdJoin.js             # curl/PS 行续符折叠
        ├── url.js                 # 编/解码容错
        └── base64.js              # magic-number 嗅探 + 白名单 + Blob URL
    └── views/  (8 个工具页面)
```

---

## 4. 视觉设计

**配色**（CSS 变量 + Tailwind colors 同值）：主色浅蓝 `#3b9eff`、点缀绿 `#34c759`、背景 `#f5f8fb`、面板白、分割线 `#e3eaf2`、主文本 `#1f2d3d`。

**布局**：吸顶导航栏（logo + 工具链接，当前项高亮，窄屏横向滚动）→ 工具条（标题 + 动作按钮）→ 左右各 50% 分栏；`< md` 断点纵向堆叠。

---

## 5. 关键算法

### 5.1 dedent（公共能力）
求所有**非空行**的最小前导空白长度，整体移除，保留相对缩进。

### 5.2 CLI 排版（reflow，本项目最易错点 — 经 Codex 加固）
```
reflow(input, { join }):
  lines = dedent(splitLines(input))
  if !join: return lines.join('\n')         # 仅去缩进模式
  TERM = /[。！？；.!?;：:]['")\]）」』]*$/   # 句末终止符（含闭合引号/括号）
  inFence = false
  for line in lines:
    if /^\s*(```|~~~)/.test(line): inFence = !inFence
    prev = out.last
    canJoin = prev非空 && line非空 && !inFence
            && !TERM.test(prev)              # 主信号：上行未以句末标点结尾
            && !isStructural(line)           # 否决：N+1 为结构化行
            && indent(line) >= indent(prev)  # 否决：缩进回退即新层级
    if canJoin: out.last = joinTwo(prev, line)
    else: out.push(line)

isStructural(line):  # 列表/编号/标题/表格/键值/缩进代码
  t = lstrip(line)
  return /^([-*+]\s|\d+[.)]\s|[A-Za-z][.)]\s)/.test(t) || /^#{1,6}\s/.test(t)
      || /^\|/.test(t) || /^[\w.-]+\s*:(\s|$)/.test(t) || /^( {4,}|\t)/.test(line)

joinTwo(a, b):  # 合并补空格规则
  L=rstrip(a); R=lstrip(b); lc=L末; rc=R首
  noSpace = (isCJK(lc)&&isCJK(rc)) || lc∈{'/','\\'} || rc∈{'/','\\'}  # 中文-中文 / URL路径
  space = (!noSpace && (isAlnum(lc)||isAlnum(rc))) ? ' ' : ''         # ASCII 边界补空格
  return L + space + R
```
**已知局限（UI 标注 + 开关可控）**：句子边界推断、缩写（e.g./Dr.）、未知终端 wrap 宽度无法 100% 准确；不修复跨行的代码/URL/表格语义。提供「仅去缩进 / 去缩进+合并」切换。

### 5.3 JSON / YAML（自带 dedent，吃下 CLI 复制内容）
- **JSON**：`JSON.parse`（本身缩进无关，CLI 整体缩进天然兼容）→ `stringify(obj,null,2)` 格式化 / `stringify(obj)` 压缩；错误反推行列。
- **YAML**：先 `dedent` → `jsyaml.load` → `jsyaml.dump({indent:2})`；`YAML⇄JSON` 互转；捕获 `YAMLException` 显示 `mark.line/column`。注意 Tab 缩进非法、dump 不保留注释（UI 注明）。

### 5.4 curl / PowerShell 行续符折叠
```
join(input, cont):  # curl: '\\'  powershell: '`'
  for line in splitLines(input):
    t = rstrip(line)
    if t.endsWith(cont): out.push(t.slice(0,-1))  # 续行：删续符不接换行
    else: out.push(t + ' ')                       # 普通行：补空格
  return out.join('').replace(/[ \t]{2,}/g,' ').trim()
```
**局限（UI 标注）**：不处理跨行引号、行内注释、heredoc/here-string。

### 5.5 HTML 渲染（安全）
`<iframe :srcdoc="html" sandbox="allow-scripts">` — 不加 `allow-same-origin`，禁 forms/popups/top-nav；防抖自动渲染 + 手动刷新。

### 5.6 Base64 转图片（安全）
解析 dataURL 或纯 Base64 → `atob`→bytes → **magic-number 嗅探真实类型** → 白名单 `png/jpeg/gif/webp`（**禁 SVG**）→ `Blob` + `blob:` URL（替换/卸载时 `revokeObjectURL`）；显示宽高/大小/下载。

### 5.7 URL 编/解码
`encodeURIComponent` / `decodeURIComponent`，malformed 转义 `try/catch` 容错提示。

---

## 6. 共享能力
复制（clipboard + execCommand 回退）· Blob 下载 · 防抖 · 统一状态条 · 每工具示例输入 · 输入上限提示 · localStorage 记忆上次工具。

---

## 7. 实施阶段
1. **基线**：Vite+Vue3 脚手架、Tailwind、路由、主题变量
2. **骨架**：TheNavbar / ToolLayout / ActionToolbar / ResultStatus / EditorPane
3. **utils**：dedent / json / yaml / cliReflow / cmdJoin / url / base64
4. **8 工具页面**：按导航顺序实现
5. **打磨**：示例、记忆、移动端、错误提示
6. **验证交付**：`npm run build` 通过、首屏不加载全部编辑器包、Codex Code Review

---

## 8. 安全汇总
| 风险 | 措施 |
|------|------|
| HTML XSS/越权 | `srcdoc`+`sandbox="allow-scripts"`，无 `allow-same-origin` |
| Base64 恶意内容 | magic-number 白名单、禁 SVG、Blob URL |
| 大输入卡死 | 输入上限 + 防抖 + 树形惰性展开 |
| 剪贴板失败 | `execCommand` 回退 |
| 内存泄漏 | Blob URL 及时 revoke |
