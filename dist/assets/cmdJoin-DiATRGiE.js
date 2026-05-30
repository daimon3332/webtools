function r(n,o){const i=[];for(const s of n.replace(/\r\n?/g,`
`).split(`
`)){let t=s.trim();t.endsWith(o)&&(t=t.slice(0,-o.length).trim()),t&&i.push(t)}return i.join(" ")}const e=n=>r(n,"\\"),l=n=>r(n,"`");export{l as a,e as j};
