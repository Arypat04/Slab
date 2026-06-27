import React from 'react';
import { s } from '../style.js';

export default function Roi(p) {
  return (
<div style={s("height:100%; display:flex; flex-direction:column; animation:cg-fade .3s ease;")}>
          <div style={s("flex:none; display:flex; align-items:center; justify-content:space-between; padding:4px 20px 12px;")}>
            <div onClick={p.goGrade} style={s("width:38px; height:38px; border-radius:50%; background:var(--surface); border:1px solid var(--line-2); display:flex; align-items:center; justify-content:center; cursor:pointer;")}><svg width="9" height="16" viewBox="0 0 9 16" style={s("fill:none; stroke:var(--ink); stroke-width:2")} strokeLinecap="round" strokeLinejoin="round"><path d="M8 1 1 8l7 7"/></svg></div>
            <div style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:17px; color:var(--ink);")}>Worth grading?</div>
            <div style={s("width:38px;")}></div>
          </div>
          <div style={s("flex:1; overflow:hidden; padding:2px 20px;")}>
            <div style={s("background:var(--slab); border-radius:22px; padding:20px; color:#fff; margin-bottom:14px; position:relative; overflow:hidden; border:1px solid var(--line-2);")}>
              <div style={s("position:absolute; right:-30px; top:-30px; width:130px; height:130px; border-radius:50%; background:radial-gradient(circle,#18b368 0%,rgba(24,179,104,0) 70%); opacity:.5;")}></div>
              <div style={s("font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.1em; color:#5ee49f;")}>VERDICT</div>
              <div style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:30px; margin:6px 0 2px;")}>Yes — grade it</div>
              <div style={s("display:flex; align-items:baseline; gap:8px;")}><span style={s("font-size:14px; color:#9fb0aa;")}>Net expected profit</span><span className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:22px; color:#5ee49f;")}>+$214</span></div>
            </div>
            <div style={s("display:flex; gap:10px; margin-bottom:14px;")}>
              <div style={s("flex:1; background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:14px;")}><div style={s("font-size:11px; color:var(--muted-2);")}>Raw value</div><div className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:22px; color:var(--ink);")}>$95</div></div>
              <div style={s("flex:1; background:var(--slab); border-radius:16px; padding:14px; border:1px solid var(--line-2);")}><div style={s("font-size:11px; color:#9fb0aa;")}>At PSA 10</div><div className="cg-num" style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:22px; color:#00c2a8;")}>$420</div></div>
            </div>
            <div style={s("background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:16px; margin-bottom:14px;")}>
              <div style={s("font-weight:700; font-size:13px; color:var(--ink); margin-bottom:14px;")}>Grade probability</div>
              <div style={s("display:flex; align-items:flex-end; gap:10px; height:96px;")}>
                <div style={s("flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;")}><div style={s("width:100%; height:26%; background:var(--track); border-radius:6px 6px 0 0;")}></div><span className="cg-num" style={s("font-size:10px; color:var(--muted-2);")}>8</span></div>
                <div style={s("flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;")}><div style={s("width:100%; height:62%; background:#9fe7da; border-radius:6px 6px 0 0;")}></div><span className="cg-num" style={s("font-size:10px; color:var(--muted-2);")}>9</span></div>
                <div style={s("flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;")}><div style={s("width:100%; height:100%; background:#00c2a8; border-radius:6px 6px 0 0; position:relative;")}><span className="cg-num" style={s("position:absolute; top:-18px; left:50%; transform:translateX(-50%); font-weight:700; font-size:11px; color:var(--accent-deep);")}>54%</span></div><span className="cg-num" style={s("font-size:10px; color:var(--ink); font-weight:700;")}>10</span></div>
              </div>
            </div>
            <div style={s("background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:6px 16px;")}>
              <div style={s("display:flex; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--line); font-size:13px;")}><span style={s("color:var(--muted-2);")}>Grading fee (PSA)</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>−$19</span></div>
              <div style={s("display:flex; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--line); font-size:13px;")}><span style={s("color:var(--muted-2);")}>Shipping both ways</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>−$22</span></div>
              <div style={s("display:flex; justify-content:space-between; padding:11px 0; font-size:13px;")}><span style={s("color:var(--muted-2);")}>Selling fees (12%)</span><span className="cg-num" style={s("color:var(--ink); font-weight:600;")}>−$50</span></div>
            </div>
          </div>
          <div style={s("flex:none; padding:12px 20px 24px;")}><div onClick={p.goHome} style={s("height:54px; border-radius:16px; background:#00c2a8; display:flex; align-items:center; justify-content:center; color:#04332c; font-weight:700; font-size:15px; cursor:pointer;")}>Add to PSA submission</div></div>
        </div>
  );
}
