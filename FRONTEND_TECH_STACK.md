# 前端技术栈

前端技术栈主要是：

```txt
Vite + Vue 3 + JavaScript + Vue Router + Tailwind CSS
```

项目没有使用 Ant Design、Element Plus、Naive UI、shadcn/ui 这类 UI 组件库。整体 UI 是基于 Vue 组件和 Tailwind CSS 手写组合实现的。

---

## 1. 构建工具：Vite

项目使用 Vite 作为前端构建工具。

作用：

- 本地开发启动快
- 支持 Vue 单文件组件
- 支持开发时热更新
- 打包生成静态资源到 `dist`
- 适合部署到任意静态托管环境

相关文件：

```txt
vite.config.js
index.html
src/main.js
```

构建命令：

```bash
npm run build
```

输出目录：

```txt
dist
```

Vite 配置中使用了：

```js
base: './'
```

因此构建产物使用相对路径，适合静态目录、对象存储、CDN、Pages 类平台部署。

---

## 2. 前端框架：Vue 3

页面使用 Vue 3 编写。

核心入口：

```txt
src/main.js
src/App.vue
```

项目使用 Vue 单文件组件，并采用 `<script setup>` 写法。

主要页面逻辑拆分在：

```txt
src/views/
```

每个工具基本对应一个独立页面组件，例如：

```txt
JsonView.vue
YamlView.vue
CliView.vue
CurlView.vue
Base64TextView.vue
Base64ImageView.vue
UrlView.vue
```

常用 Vue 能力包括：

- `ref`
- `computed`
- `watch`
- `shallowRef`
- `defineAsyncComponent`
- 组件 props / emit

项目没有使用 Pinia 或 Vuex。各工具页面状态相互独立，直接在页面组件内部通过组合式 API 管理。

---

## 3. 语言：JavaScript

项目使用 JavaScript。

包配置中：

```json
"type": "module"
```

因此源码采用 ESM 模块写法：

```js
import xxx from './xxx'
export function xxx() {}
```

当前项目没有使用 TypeScript，没有 `.ts` / `.tsx` 前端主源码。

---

## 4. 路由：Vue Router 4

项目使用 Vue Router 4。

相关文件：

```txt
src/router/index.js
```

路由模式：

```js
createWebHashHistory()
```

也就是 hash 路由，访问路径类似：

```txt
/#/json
/#/yaml
/#/base64
```

这种方式适合纯静态部署，不需要服务端配置 history fallback。

页面组件采用懒加载：

```js
component: () => import('../views/YamlView.vue')
```

这样每个工具页按需加载，减少首屏资源压力。

---

## 5. 样式方案：Tailwind CSS + 少量全局 CSS

项目使用 Tailwind CSS。

相关文件：

```txt
tailwind.config.js
postcss.config.js
src/assets/main.css
```

没有使用：

```txt
Ant Design
Element Plus
Naive UI
shadcn/ui
Bootstrap
```

UI 组件是项目内自定义实现的，例如：

```txt
src/components/ToolLayout.vue
src/components/ToolButton.vue
src/components/PanelViewButtons.vue
src/components/EditorPane.vue
src/components/ResultStatus.vue
src/components/TheNavbar.vue
```

主题颜色在 `tailwind.config.js` 中定义：

```js
primary: '#3b9eff'
accent: '#34c759'
surface: '#ffffff'
canvas: '#f5f8fb'
line: '#e3eaf2'
ink: '#1f2d3d'
```

主要实现了：

- 浅色蓝绿工具站风格
- 顶部工具导航
- 全宽工作台布局
- 左右双栏 / 上下双栏
- 可拖拽输入输出分隔区
- 只看原文 / 只看结果
- 统一按钮
- 统一状态提示
- 代码编辑器式输入区

全局 CSS 主要在 `src/assets/main.css` 中，用于：

- Tailwind 指令
- 页面高度初始化
- CodeMirror 基础样式
- JSON 树形视图字体
- 简单过渡动画

---

## 6. 编辑器：CodeMirror 6

项目使用 CodeMirror 6 作为结构化文本编辑器。

相关依赖：

```txt
codemirror
vue-codemirror
@codemirror/lang-json
@codemirror/lang-html
@codemirror/lang-yaml
```

相关文件：

```txt
src/components/EditorPane.vue
src/components/CodeEditor.vue
```

使用方式：

- JSON 工具使用 JSON 高亮
- YAML 工具使用 YAML 高亮
- HTML 工具使用 HTML 高亮
- 普通文本工具使用 textarea

CodeMirror 组件是异步加载的：

```js
defineAsyncComponent(() => import('./CodeEditor.vue'))
```

语言扩展也是动态加载：

```js
json: () => import('@codemirror/lang-json')
html: () => import('@codemirror/lang-html')
yaml: () => import('@codemirror/lang-yaml')
```

这样可以避免所有工具首屏都加载完整编辑器资源。

---

## 7. YAML / JSON 处理

### js-yaml

项目使用 `js-yaml` 处理 YAML。

相关文件：

```txt
src/utils/yaml.js
```

主要负责：

- YAML 格式化
- YAML 转 JSON
- JSON 转 YAML
- YAML 字段路径提取
- 兼容 JSON 输入解析

字段提取支持类似：

```txt
tun
tun.dns-hijack
geox-url.geoip
```

YAML 原文块优先保留注释和缩进；JSON 输入则解析后重新输出 YAML 片段。

### JSON 原生 API

JSON 工具主要使用浏览器原生 JSON API：

```js
JSON.parse()
JSON.stringify()
```

相关文件：

```txt
src/utils/json.js
src/views/JsonView.vue
```

### vue-json-pretty

项目使用 `vue-json-pretty` 展示 JSON 树形视图。

作用：

- 折叠查看 JSON
- 显示数组 / 对象结构
- 提高复杂 JSON 的可读性

---

## 8. 浏览器原生 API

项目还使用了一些浏览器原生 API。

### Clipboard API

用于复制结果。

相关文件：

```txt
src/composables/useClipboard.js
```

使用：

```js
navigator.clipboard.writeText(text)
```

并提供 `execCommand` 回退逻辑。

---

### Blob + URL.createObjectURL

用于下载文本结果和 Base64 图片预览。

相关文件：

```txt
src/composables/useDownload.js
src/utils/base64.js
```

使用场景：

- 下载 YAML / JSON / 文本结果
- 将 Base64 图片字节转换成 Blob URL 进行预览

---

### TextEncoder / TextDecoder

用于 Base64 文本编解码。

相关文件：

```txt
src/utils/base64.js
```

作用：

- 正确处理中文
- 正确处理 emoji
- 避免 `btoa` / `atob` 直接处理 Unicode 导致乱码

---

### iframe sandbox

HTML 渲染工具使用 iframe 预览 HTML。

主要特征：

```txt
srcdoc
sandbox="allow-scripts"
```

不开放 `allow-same-origin`，用于隔离预览代码和父页面。

---

## 9. 前端目录结构

当前前端核心结构大概是：

```txt
src/
  App.vue
  main.js
  assets/
    main.css
  router/
    index.js
  components/
    TheNavbar.vue
    ToolLayout.vue
    EditorPane.vue
    CodeEditor.vue
    ToolButton.vue
    PanelViewButtons.vue
    ResultStatus.vue
  composables/
    useClipboard.js
    useDownload.js
  utils/
    base64.js
    cliReflow.js
    cmdJoin.js
    dedent.js
    githubMirror.js
    json.js
    url.js
    yaml.js
  views/
    JsonView.vue
    YamlView.vue
    CliView.vue
    HtmlView.vue
    CurlView.vue
    PowershellView.vue
    Base64TextView.vue
    Base64ImageView.vue
    GithubMirrorView.vue
    UrlView.vue
```

结构特点：

- `views` 放工具页面
- `components` 放通用 UI 组件
- `utils` 放纯转换逻辑
- `composables` 放可复用浏览器能力
- `router` 统一管理导航和页面标题

---

## 10. 部署形态

前端是纯静态构建：

```txt
Vue 源码 -> Vite build -> dist 静态文件
```

构建命令：

```bash
npm run build
```

输出目录：

```txt
dist
```

项目没有后端服务依赖，工具逻辑都在浏览器端执行。

可部署到：

- 静态服务器
- Nginx 静态目录
- 对象存储
- CDN
- GitHub Pages
- Cloudflare Pages
- Vercel / Netlify 的静态站点模式

---

## 总结

前端技术栈可以总结为：

```txt
Vue 3
JavaScript
Vite
Vue Router
Tailwind CSS
CodeMirror 6
js-yaml
vue-json-pretty
浏览器原生 API
静态部署
```

特点是：

- 技术栈轻量
- 没有大型 UI 组件库
- 样式控制权高
- 工具页组件拆分清晰
- 转换逻辑集中在 `utils`
- 适合纯前端静态部署
- 后续扩展新工具页成本较低
