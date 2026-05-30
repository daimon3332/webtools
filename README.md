# WebTools

浏览器端开发者工具集合，纯前端运行、数据不出本地。浅蓝/绿配色，顶部导航栏，json.cn 风格。

## 功能

| 工具 | 说明 |
|------|------|
| **JSON 格式化** | 左输入 / 右输出，文本 + 树形双视图，错误定位到行列 |
| **YAML 格式化** | 格式化、YAML ↔ JSON 互转，自动消除 CLI 复制带入的多余缩进 |
| **CLI 排版** | 去公共缩进 + 合并终端换行；句末终止符（。！？.!?）同级不合并，未结句自动续接，CJK/ASCII 智能空格 |
| **HTML 渲染** | 左代码 / 右实时预览，沙箱 `iframe` 隔离 |
| **curl 多行转单行** | 去除 `\` 续行符，保留引号内空格 |
| **PowerShell 多行转单行** | 去除反引号续行符，逻辑同上 |
| **Base64 转图片** | 魔数嗅探 + MIME 白名单（PNG/JPEG/GIF/WebP），Blob URL 预览与下载 |
| **URL 编码 / 解码** | 基于 `encodeURIComponent`，自动处理中文与特殊字符 |

## 技术栈

Vue 3 (`<script setup>`) · Vite 6 · Vue Router 4（hash 模式）· Tailwind CSS 3 · CodeMirror 6（按需懒加载）· vue-json-pretty · js-yaml

## 快速开始

```bash
npm install      # 需 Node 18+
npm run dev      # 开发服务器 http://localhost:5173
npm run build    # 构建到 dist/（纯静态）
npm run preview  # 预览构建产物
```

## 项目结构

```
src/
├─ components/      # EditorPane(懒加载 CodeEditor) / ToolLayout / 导航等通用组件
├─ composables/     # useClipboard / useDownload
├─ utils/           # 纯逻辑：cliReflow / cmdJoin / base64 / yaml / json / url / dedent
├─ views/           # 8 个工具页面
└─ router/          # 路由 + 导航元信息
```

工具逻辑全部抽离到 `utils/`（无副作用、可单测），页面仅负责交互与状态。

## 设计要点

- **按需加载**：CodeMirror（约 400KB）独立分包，仅 JSON/YAML/HTML 用到时加载，textarea 类工具首屏不引入。
- **HTML 渲染安全**：`<iframe srcdoc sandbox="allow-scripts">`，不开放 `allow-same-origin`，预览代码无法访问父页面与 Cookie。
- **Base64 安全**：按文件头魔数识别类型并做 MIME 白名单（禁用 SVG 以防 XSS）；输出用 Blob URL 并在切换/卸载时 `revokeObjectURL` 释放。

## 部署

`dist/` 为纯静态资源（`base: './'`，相对路径），可直接托管于任意静态服务器、对象存储或 CDN，无需后端。
