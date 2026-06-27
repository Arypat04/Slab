import React from 'react';
import { s } from './style.js';

export function StatusBar() {
  return (
<div style={s("height:54px; flex:none; display:flex; align-items:center; justify-content:space-between; padding:0 28px; position:relative; font-weight:700; font-size:15px; color:var(--ink); z-index:5;")}>
        <span className="cg-num">9:41</span>
        <div style={s("position:absolute; left:50%; top:12px; transform:translateX(-50%); width:104px; height:30px; background:var(--island); border-radius:16px;")}></div>
        <svg width="64" height="13" viewBox="0 0 64 13" style={s("fill:var(--ink)")}><rect x="0" y="6" width="3" height="7" rx="1"/><rect x="5" y="4" width="3" height="9" rx="1"/><rect x="10" y="2" width="3" height="11" rx="1"/><rect x="15" y="0" width="3" height="13" rx="1"/><path d="M28 4.5a7 7 0 0 1 9 0l-1.4 1.7a4.8 4.8 0 0 0-6.2 0Z"/><path d="M30.4 7.2a3.4 3.4 0 0 1 4.2 0L32.5 9.8Z"/><rect x="46" y="1.5" width="15" height="9" rx="2.5" style={s("fill:none; stroke:var(--ink); stroke-width:1.2")}/><rect x="47.5" y="3" width="11" height="6" rx="1"/><rect x="62" y="4" width="1.6" height="4" rx="0.8"/></svg>
      </div>
  );
}

export function HomeIndicator() {
  return (
<div style={s("position:absolute; bottom:8px; left:50%; transform:translateX(-50%); width:134px; height:5px; border-radius:3px; background:var(--homebar); opacity:.85; z-index:6; pointer-events:none;")}></div>
  );
}
