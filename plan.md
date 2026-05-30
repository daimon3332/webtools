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
