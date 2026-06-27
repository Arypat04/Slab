// CSS string -> React style object (keeps CSS custom properties intact).
export function s(css){
  const o = {};
  String(css).split(';').forEach(decl => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    let k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k) return;
    if (k.startsWith('--')) { o[k] = v; return; }
    k = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[k] = v;
  });
  return o;
}

// Design tokens (reference). Runtime theme switch is driven by global.css
// (.cg-app / .cg-app[data-theme="dark"] CSS variables).
export const THEME_LIGHT = {
  bg:'#f6f8f7', surface:'#ffffff', surface2:'#f1f4f3', ink:'#0d1b17', muted:'#7c8a84', muted2:'#61716b',
  line:'#eaeeec', line2:'#e7ecea', accent:'#00c2a8', accentDeep:'#00a892', accentInk:'#04332c',
  slab:'#0d1b17', gradeNum:'#ffffff', track:'#eef2f0', pos:'#18b368', homebar:'#0d1b17',
};
export const THEME_DARK = {
  bg:'#0c1714', surface:'#13211c', surface2:'#15241f', ink:'#ffffff', muted:'#6f827b', muted2:'#9fb0aa',
  line:'#20342d', line2:'#243630', accent:'#00c2a8', accentDeep:'#00c2a8', accentInk:'#04332c',
  slab:'linear-gradient(135deg,#11201b,#15302a)', gradeNum:'#00c2a8', track:'#1f2f29', pos:'#5ee49f', homebar:'#ffffff',
};
