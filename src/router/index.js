import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/json' },
  { path: '/json', name: 'json', meta: { title: 'JSON 格式化' }, component: () => import('../views/JsonView.vue') },
  { path: '/yaml', name: 'yaml', meta: { title: 'YAML 格式化' }, component: () => import('../views/YamlView.vue') },
  { path: '/cli', name: 'cli', meta: { title: 'CLI 排版' }, component: () => import('../views/CliView.vue') },
  { path: '/html', name: 'html', meta: { title: 'HTML 渲染' }, component: () => import('../views/HtmlView.vue') },
  { path: '/curl', name: 'curl', meta: { title: 'Shell转单行' }, component: () => import('../views/CurlView.vue') },
  { path: '/powershell', name: 'powershell', meta: { title: 'PowerShell 转单行' }, component: () => import('../views/PowershellView.vue') },
  { path: '/base64-image', name: 'base64-image', meta: { title: 'Base64 转图片' }, component: () => import('../views/Base64ImageView.vue') },
  { path: '/github-mirror', name: 'github-mirror', meta: { title: 'GitHub 镜像转换' }, component: () => import('../views/GithubMirrorView.vue') },
  { path: '/url', name: 'url', meta: { title: 'URL 编解码' }, component: () => import('../views/UrlView.vue') }
]

const router = createRouter({ history: createWebHashHistory(), routes })
router.afterEach(to => {
  document.title = to.meta?.title ? `${to.meta.title} · WebTools` : 'WebTools'
})

export const tools = routes.filter(r => r.name)
export default router
