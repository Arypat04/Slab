import React from 'react';
import { s } from '../style.js';

export default function Paywall(p) {
  return (
<div style={s("height:100%; display:flex; flex-direction:column; animation:cg-fade .3s ease;")}>
          <div style={s("flex:none; display:flex; justify-content:space-between; align-items:center; padding:2px 22px 8px;")}><span onClick={p.goHome} style={s("font-size:22px; color:var(--muted); cursor:pointer;")}>✕</span><span style={s("font-size:13px; color:var(--muted); font-weight:600;")}>Restore</span></div>
          <div style={s("flex:1; overflow:hidden; padding:6px 22px;")}>
            <div style={s("font-family:'DM Mono',monospace; font-size:12px; letter-spacing:0.12em; color:var(--accent-deep); margin-bottom:8px;")}>CARDGRADER PRO</div>
            <h2 style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:30px; line-height:1.05; letter-spacing:-0.02em; color:var(--ink); margin:0 0 18px;")}>Grade smarter.<br/>Buy with an edge.</h2>
            <div style={s("display:flex; background:var(--surface-2); border-radius:14px; padding:4px; margin-bottom:18px;")}><div style={s("flex:1; text-align:center; padding:10px; font-size:13px; font-weight:600; color:var(--muted-2);")}>Monthly</div><div style={s("flex:1; text-align:center; padding:10px; font-size:13px; font-weight:700; color:var(--ink); background:var(--surface); border-radius:10px; box-shadow:0 2px 6px rgba(13,30,26,.08);")}>Annual · save 40%</div></div>
            <div style={s("background:var(--slab); border-radius:22px; padding:20px; color:#fff; position:relative; overflow:hidden; margin-bottom:12px; border:1px solid var(--line-2);")}>
              <div style={s("position:absolute; right:-26px; top:-26px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,#00c2a8 0%,rgba(0,194,168,0) 70%); opacity:.5;")}></div>
              <div style={s("display:flex; justify-content:space-between; align-items:flex-start;")}><div><div style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:20px;")}>Pro</div><div style={s("font-size:12px; color:#9fb0aa;")}>Everything, unlimited</div></div><div style={s("text-align:right;")}><div className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:26px;")}>$7<span style={s("font-size:14px; color:#9fb0aa;")}>/mo</span></div><div style={s("font-size:11px; color:#7fe9d8;")}>billed $84/yr</div></div></div>
              <div style={s("height:1px; background:rgba(255,255,255,.12); margin:16px 0;")}></div>
              <div style={s("display:flex; flex-direction:column; gap:10px; font-size:13px;")}>
                <div style={s("display:flex; gap:9px; align-items:center;")}><span style={s("width:18px; height:18px; border-radius:50%; background:#00c2a8; display:flex; align-items:center; justify-content:center; flex:none;")}><svg width="10" height="10" viewBox="0 0 10 10" style={s("fill:none; stroke:#04332c; stroke-width:2")} strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5 4 7.5 8.5 2.5"/></svg></span>Unlimited scans + sub-grades</div>
                <div style={s("display:flex; gap:9px; align-items:center;")}><span style={s("width:18px; height:18px; border-radius:50%; background:#00c2a8; display:flex; align-items:center; justify-content:center; flex:none;")}><svg width="10" height="10" viewBox="0 0 10 10" style={s("fill:none; stroke:#04332c; stroke-width:2")} strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5 4 7.5 8.5 2.5"/></svg></span>Multi-grader + ROI breakdown</div>
                <div style={s("display:flex; gap:9px; align-items:center;")}><span style={s("width:18px; height:18px; border-radius:50%; background:#00c2a8; display:flex; align-items:center; justify-content:center; flex:none;")}><svg width="10" height="10" viewBox="0 0 10 10" style={s("fill:none; stroke:#04332c; stroke-width:2")} strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5 4 7.5 8.5 2.5"/></svg></span>Grading Plays + submission tracker</div>
              </div>
            </div>
            <div style={s("display:flex; gap:10px;")}>
              <div style={s("flex:1; border:1px solid var(--line-2); border-radius:16px; padding:13px 14px; background:var(--surface);")}><div style={s("font-weight:700; font-size:14px; color:var(--ink);")}>Plus</div><div className="cg-num" style={s("font-size:13px; color:var(--muted-2);")}>$4/mo</div></div>
              <div style={s("flex:1; border:1px solid var(--line-2); border-radius:16px; padding:13px 14px; background:var(--surface);")}><div style={s("font-weight:700; font-size:14px; color:var(--ink);")}>Free</div><div style={s("font-size:13px; color:var(--muted-2);")}>10 scans/mo</div></div>
            </div>
          </div>
          <div style={s("flex:none; padding:8px 22px 26px;")}>
            <div onClick={p.goHome} style={s("height:56px; border-radius:18px; background:#00c2a8; display:flex; align-items:center; justify-content:center; color:#04332c; font-weight:700; font-size:16px; margin-bottom:10px; cursor:pointer;")}>Start 7-day free trial</div>
            <div onClick={p.goHome} style={s("text-align:center; font-size:13px; color:var(--muted); font-weight:600; cursor:pointer;")}>Continue with Free</div>
          </div>
        </div>
  );
}
