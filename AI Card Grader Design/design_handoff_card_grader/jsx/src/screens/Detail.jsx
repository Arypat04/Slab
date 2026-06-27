import React from 'react';
import { s } from '../style.js';

export default function Detail(p) {
  return (
<div style={s("height:100%; display:flex; flex-direction:column; animation:cg-fade .3s ease;")}>
          <div style={s("flex:none; height:248px; background:var(--slab); position:relative; display:flex; align-items:center; justify-content:center;")}>
            <div onClick={p.goCollection} style={s("position:absolute; top:10px; left:20px; width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.14); display:flex; align-items:center; justify-content:center; cursor:pointer;")}><svg width="9" height="16" viewBox="0 0 9 16" style={s("fill:none; stroke:#fff; stroke-width:2")} strokeLinecap="round" strokeLinejoin="round"><path d="M8 1 1 8l7 7"/></svg></div>
            <div style={s("width:140px; height:196px; border-radius:12px; background:repeating-linear-gradient(135deg,#e9efec,#e9efec 7px,#dfe7e3 7px,#dfe7e3 14px); border:1px solid #cdd6d2; box-shadow:0 16px 40px rgba(0,0,0,.4);")}></div>
            <span style={s("position:absolute; bottom:12px; left:50%; transform:translateX(-50%); font-family:'DM Mono',monospace; font-size:10px; color:#6f827b;")}>FRONT · BACK · OVERLAY</span>
          </div>
          <div style={s("flex:1; overflow:hidden; padding:16px 20px;")}>
            <div style={s("display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;")}><div><div style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:22px; color:var(--ink); line-height:1.05;")}>Charizard ex</div><div style={s("font-size:13px; color:var(--muted-2); margin-top:2px;")}>Pokémon 151 · #199 · Holo</div></div><span style={s("background:var(--ink); color:var(--bg); font-family:'DM Mono',monospace; font-size:12px; padding:7px 11px; border-radius:10px; white-space:nowrap;")}>PSA 9</span></div>
            <div style={s("background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:16px; margin-bottom:12px;")}>
              <div style={s("display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:12px;")}><div><div style={s("font-size:11px; color:var(--muted-2);")}>Market value</div><div className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:26px; color:var(--ink);")}>$430</div></div><span className="cg-num" style={s("background:rgba(24,179,104,.12); color:var(--pos); font-weight:700; font-size:12px; padding:4px 9px; border-radius:8px;")}>+14% 30d</span></div>
              <svg width="100%" height="56" viewBox="0 0 320 56" preserveAspectRatio="none"><polyline points="0,44 40,40 80,46 120,34 160,30 200,33 240,22 280,18 320,8" style={s("fill:none; stroke:#00c2a8; stroke-width:2.5")} strokeLinecap="round" strokeLinejoin="round"/><polyline points="0,44 40,40 80,46 120,34 160,30 200,33 240,22 280,18 320,8 320,56 0,56" style={s("fill:rgba(0,194,168,.1); stroke:none")}/></svg>
            </div>
            <div style={s("background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:6px 16px;")}>
              <div style={s("display:flex; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--line); font-size:13px;")}><span style={s("color:var(--muted-2);")}>Paid</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>$240</span></div>
              <div style={s("display:flex; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--line); font-size:13px;")}><span style={s("color:var(--muted-2);")}>Profit / loss</span><span className="cg-num" style={s("color:var(--pos); font-weight:700;")}>+$190 (+79%)</span></div>
              <div style={s("display:flex; justify-content:space-between; padding:11px 0; font-size:13px;")}><span style={s("color:var(--muted-2);")}>Cert #</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>7841 2290</span></div>
            </div>
          </div>
          <div style={s("flex:none; padding:10px 20px 24px; display:flex; gap:10px;")}>
            <div style={s("flex:none; width:50px; height:50px; border-radius:14px; background:var(--surface-2); display:flex; align-items:center; justify-content:center;")}><svg width="18" height="18" viewBox="0 0 18 18" style={s("fill:none; stroke:var(--ink); stroke-width:1.6")} strokeLinecap="round" strokeLinejoin="round"><path d="M9 16s-6-4-6-8.5A3.5 3.5 0 0 1 9 5a3.5 3.5 0 0 1 6 2.5C15 12 9 16 9 16Z"/></svg></div>
            <div onClick={p.goRoi} style={s("flex:1; height:50px; border-radius:14px; background:#00c2a8; display:flex; align-items:center; justify-content:center; color:#04332c; font-weight:700; font-size:15px; cursor:pointer;")}>See ROI</div>
          </div>
        </div>
  );
}
