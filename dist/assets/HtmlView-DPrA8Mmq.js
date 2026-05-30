import{_ as f,a as m,b as n}from"./ToolButton-CDnJ8Wzm.js";import{y as c,b as p,A as e,p as b,a as v,f as a,g as o,q as i}from"./index-BCCptMKo.js";const _=["srcdoc"],g=`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 24px; color: #1f2d3d; }
    h1 { color: #3b9eff; }
    .tag { color: #34c759; }
  </style>
</head>
<body>
  <h1>Hello WebTools</h1>
  <p>左侧编辑 <span class="tag">HTML</span>，右侧实时预览 ✨</p>
  <button onclick="alert('clicked!')">点我</button>
</body>
</html>`,V={__name:"HtmlView",setup(y){const t=i(""),s=i("");function r(){s.value=t.value}c(t,r);function u(){t.value="",s.value=""}return(T,l)=>(b(),p(f,{title:"HTML 渲染",desc:"左侧编写 HTML，右侧沙箱实时预览（iframe 已隔离，无法访问父页面）"},{toolbar:e(()=>[o(n,{variant:"primary",onClick:r},{default:e(()=>[...l[2]||(l[2]=[a("运行",-1)])]),_:1}),o(n,{onClick:l[0]||(l[0]=d=>t.value=g)},{default:e(()=>[...l[3]||(l[3]=[a("示例",-1)])]),_:1}),o(n,{onClick:u},{default:e(()=>[...l[4]||(l[4]=[a("清空",-1)])]),_:1})]),left:e(()=>[o(m,{modelValue:t.value,"onUpdate:modelValue":l[1]||(l[1]=d=>t.value=d),mode:"code",lang:"html",placeholder:"在此输入 HTML 代码…"},null,8,["modelValue"])]),"right-label":e(()=>[...l[5]||(l[5]=[a("渲染结果",-1)])]),right:e(()=>[v("iframe",{srcdoc:s.value,sandbox:"allow-scripts",class:"h-full w-full border-0 bg-white",title:"HTML 预览"},null,8,_)]),_:1}))}};export{V as default};
