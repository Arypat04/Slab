import React from 'react';
import { s } from '../style.js';

export default function Insights(p) {
  return (
<div style={s("height:100%; display:flex; flex-direction:column; animation:cg-fade .3s ease;")}>
          <div style={s("flex:none; padding:4px 20px 8px;")}><div style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:24px; color:var(--ink);")}>Insights</div></div>
          <div style={s("flex:1; overflow:hidden; padding:6px 20px 0;")}>
            <div style={s("display:flex; gap:10px; margin-bottom:14px;")}>
              <div style={s("flex:1; background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:14px;")}><div style={s("font-size:11px; color:var(--muted-2);")}>Gem rate</div><div className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:22px; color:var(--accent-deep);")}>47%</div><div className="cg-num" style={s("font-size:11px; color:var(--pos);")}>+6 vs predicted</div></div>
              <div style={s("flex:1; background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:14px;")}><div style={s("font-size:11px; color:var(--muted-2);")}>Best month</div><div className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:22px; color:var(--ink);")}>+$968</div><div className="cg-num" style={s("font-size:11px; color:var(--muted-2);")}>June</div></div>
            </div>
            <div style={s("background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:16px; margin-bottom:14px;")}>
              <div style={s("font-weight:700; font-size:14px; color:var(--ink); margin-bottom:14px;")}>Allocation</div>
              <div style={s("display:flex; height:14px; border-radius:7px; overflow:hidden; margin-bottom:12px;")}><div style={s("width:52%; background:#00c2a8;")}></div><div style={s("width:30%; background:#5b6cff;")}></div><div style={s("width:18%; background:#f0a83a;")}></div></div>
              <div style={s("display:flex; flex-direction:column; gap:8px; font-size:13px;")}>
                <div style={s("display:flex; justify-content:space-between;")}><span style={s("display:flex; align-items:center; gap:8px; color:var(--muted-2);")}><span style={s("width:9px; height:9px; border-radius:3px; background:#00c2a8;")}></span>Pokémon</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>$6,490</span></div>
                <div style={s("display:flex; justify-content:space-between;")}><span style={s("display:flex; align-items:center; gap:8px; color:var(--muted-2);")}><span style={s("width:9px; height:9px; border-radius:3px; background:#5b6cff;")}></span>NHL</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>$3,740</span></div>
                <div style={s("display:flex; justify-content:space-between;")}><span style={s("display:flex; align-items:center; gap:8px; color:var(--muted-2);")}><span style={s("width:9px; height:9px; border-radius:3px; background:#f0a83a;")}></span>Other</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>$2,250</span></div>
              </div>
            </div>
            <div style={s("font-weight:700; font-size:14px; color:var(--ink); margin-bottom:10px;")}>Top performers</div>
            <div style={s("display:flex; flex-direction:column; gap:8px;")}>
              <div style={s("display:flex; align-items:center; gap:12px; background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:10px;")}><div style={s("width:34px; height:46px; flex:none; border-radius:6px; background:var(--thumb);")}></div><div style={s("flex:1;")}><div style={s("font-weight:700; font-size:13px; color:var(--ink);")}>C. McDavid PSA 10</div><div style={s("font-size:11px; color:var(--muted-2);")}>23-24 UD</div></div><div className="cg-num" style={s("font-weight:700; font-size:13px; color:var(--pos);")}>+128%</div></div>
              <div style={s("display:flex; align-items:center; gap:12px; background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:10px;")}><div style={s("width:34px; height:46px; flex:none; border-radius:6px; background:var(--thumb);")}></div><div style={s("flex:1;")}><div style={s("font-weight:700; font-size:13px; color:var(--ink);")}>Charizard ex PSA 9</div><div style={s("font-size:11px; color:var(--muted-2);")}>Pokémon 151</div></div><div className="cg-num" style={s("font-weight:700; font-size:13px; color:var(--pos);")}>+79%</div></div>
            </div>
          </div>
          <div style={s("flex:none; height:86px; background:var(--footer); border-top:1px solid var(--line); display:flex; align-items:flex-start; padding:12px 24px 0;")}>
            <div onClick={p.goHome} style={s("flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer;")}><svg width="22" height="22" viewBox="0 0 22 22" style={s("fill:none; stroke:#9aa6a0; stroke-width:1.8")} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1Z"/></svg><span style={s("font-size:10px; color:#9aa6a0;")}>Home</span></div>
            <div onClick={p.goCollection} style={s("flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer;")}><svg width="22" height="22" viewBox="0 0 22 22" style={s("fill:none; stroke:#9aa6a0; stroke-width:1.8")} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="16" height="12" rx="2"/><path d="M7 5V3h8v2"/></svg><span style={s("font-size:10px; color:#9aa6a0;")}>Collection</span></div>
            <div style={s("flex:1; display:flex; justify-content:center;")}><div onClick={p.goScan} style={s("width:58px; height:58px; border-radius:20px; background:#00c2a8; margin-top:-22px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,194,168,.4); cursor:pointer;")}><svg width="26" height="26" viewBox="0 0 26 26" style={s("fill:none; stroke:#04332c; stroke-width:2.2")} strokeLinecap="round" strokeLinejoin="round"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2L9.5 3.5h7L18.3 6h1.2A2.5 2.5 0 0 1 22 8.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="13" cy="13" r="4"/></svg></div></div>
            <div onClick={p.goInsights} style={s("flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer;")}><svg width="22" height="22" viewBox="0 0 22 22" style={s("fill:none; stroke:var(--accent); stroke-width:1.8")} strokeLinecap="round" strokeLinejoin="round"><path d="M3 18V9M9 18V4M15 18v-7"/></svg><span style={s("font-size:10px; color:var(--accent-deep); font-weight:600;")}>Insights</span></div>
            <div onClick={p.goProfile} style={s("flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer;")}><svg width="22" height="22" viewBox="0 0 22 22" style={s("fill:none; stroke:#9aa6a0; stroke-width:1.8")} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="4"/><path d="M3 19a8 8 0 0 1 16 0"/></svg><span style={s("font-size:10px; color:#9aa6a0;")}>Profile</span></div>
          </div>
        </div>
  );
}
