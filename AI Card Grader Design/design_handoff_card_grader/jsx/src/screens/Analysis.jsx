import React from 'react';
import { s } from '../style.js';

export default function Analysis(p) {
  return (
<div onClick={p.goGrade} style={s("height:100%; display:flex; flex-direction:column; animation:cg-fade .3s ease; cursor:pointer;")}>
          <div style={s("flex:none; text-align:center; padding:14px 0 0;")}><span style={s("font-family:'DM Mono',monospace; font-size:12px; letter-spacing:0.12em; color:var(--accent-deep);")}>ANALYZING</span></div>
          <div style={s("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px;")}>
            <div style={s("position:relative; width:220px; height:308px; border-radius:16px; overflow:hidden; background:var(--thumb); border:1px solid var(--line-2); box-shadow:0 14px 34px rgba(13,30,26,.16);")}>
              <div style={s("position:absolute; left:6%; right:6%; height:3px; background:linear-gradient(90deg,transparent,#00c2a8,transparent); border-radius:3px; box-shadow:0 0 16px 3px rgba(0,194,168,.7); animation:cg-scan 1.6s ease-in-out infinite alternate; top:6%;")}></div>
            </div>
            <div className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:30px; color:var(--ink); margin-top:28px;")}>Identifying…</div>
          </div>
          <div style={s("flex:none; padding:0 32px 40px;")}>
            <div style={s("background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:16px;")}>
              <div style={s("display:flex; align-items:center; gap:11px; padding:7px 0;")}><span style={s("width:20px; height:20px; border-radius:50%; background:#00c2a8; display:flex; align-items:center; justify-content:center; flex:none;")}><svg width="11" height="11" viewBox="0 0 11 11" style={s("fill:none; stroke:#04332c; stroke-width:2")} strokeLinecap="round" strokeLinejoin="round"><path d="M2 5.5 4.3 8 9 3"/></svg></span><span style={s("font-size:14px; color:var(--ink); font-weight:600;")}>Identified card</span></div>
              <div style={s("display:flex; align-items:center; gap:11px; padding:7px 0;")}><span style={s("width:20px; height:20px; border-radius:50%; background:#00c2a8; display:flex; align-items:center; justify-content:center; flex:none;")}><svg width="11" height="11" viewBox="0 0 11 11" style={s("fill:none; stroke:#04332c; stroke-width:2")} strokeLinecap="round" strokeLinejoin="round"><path d="M2 5.5 4.3 8 9 3"/></svg></span><span style={s("font-size:14px; color:var(--ink); font-weight:600;")}>Measured centering</span></div>
              <div style={s("display:flex; align-items:center; gap:11px; padding:7px 0;")}><span style={s("width:20px; height:20px; border-radius:50%; border:2px solid #00c2a8; flex:none; display:flex; align-items:center; justify-content:center;")}><span style={s("width:8px; height:8px; border-radius:50%; border:2px solid #00c2a8; border-top-color:transparent; animation:cg-spin .8s linear infinite;")}></span></span><span style={s("font-size:14px; color:var(--ink); font-weight:600;")}>Detecting defects…</span></div>
              <div style={s("display:flex; align-items:center; gap:11px; padding:7px 0; opacity:.45;")}><span style={s("width:20px; height:20px; border-radius:50%; border:2px solid var(--muted); flex:none;")}></span><span style={s("font-size:14px; color:var(--muted-2);")}>Pricing</span></div>
            </div>
          </div>
        </div>
  );
}
