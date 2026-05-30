function r(o){const t=o.replace(/\r\n?/g,`
`).split(`
`);let i=1/0;for(const n of t){if(!n.trim())continue;const e=n.match(/^[ \t]*/)[0].length;e<i&&(i=e)}return!isFinite(i)||i===0?t.join(`
`):t.map(n=>n.trim()?n.slice(i):n).join(`
`)}export{r as d};
