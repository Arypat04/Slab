import React from 'react';
import { s } from '../style.js';

export default function Scan(p) {
  return (
<div style={s("height:100%; display:flex; flex-direction:column; animation:cg-fade .3s ease;")}>
          <div style={s("flex:none; display:flex; align-items:center; justify-content:space-between; padding:2px 20px 0;")}>
            <div onClick={p.goHome} style={s("width:40px; height:40px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center; color:var(--ink); font-size:17px; cursor:pointer;")}>✕</div>
            <div style={s("display:flex; background:var(--surface-2); border-radius:100px; padding:4px;")}><span style={s("padding:8px 16px; border-radius:100px; background:#00c2a8; color:#04332c; font-weight:700; font-size:13px;")}>Front Only</span><span style={s("padding:8px 16px; color:var(--muted-2); font-weight:600; font-size:13px;")}>Front &amp; Back</span></div>
            <div style={s("width:40px; height:40px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center;")}><svg width="17" height="17" viewBox="0 0 17 17" style={s("fill:#f0a83a; stroke:#f0a83a; stroke-width:1")} strokeLinejoin="round"><path d="M9 1 3 9h4l-1 7 6-8H8Z"/></svg></div>
          </div>
          <div style={s("flex:1; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px 20px;")}>
            <div style={s("position:absolute; inset:14px 20px; background:radial-gradient(120% 80% at 50% 40%,#26302d,#141b19); border-radius:28px;")}></div>
            <div style={s("position:relative; width:248px; height:344px;")}>
              <div style={s("position:absolute; inset:0; border-radius:18px; background:repeating-linear-gradient(135deg,#20302c,#20302c 8px,#1a2623 8px,#1a2623 16px); border:1px solid #2c3a36;")}></div>
              <span style={s("position:absolute; top:-3px; left:-3px; width:34px; height:34px; border-top:3px solid #00c2a8; border-left:3px solid #00c2a8; border-radius:14px 0 0 0;")}></span>
              <span style={s("position:absolute; top:-3px; right:-3px; width:34px; height:34px; border-top:3px solid #00c2a8; border-right:3px solid #00c2a8; border-radius:0 14px 0 0;")}></span>
              <span style={s("position:absolute; bottom:-3px; left:-3px; width:34px; height:34px; border-bottom:3px solid #00c2a8; border-left:3px solid #00c2a8; border-radius:0 0 0 14px;")}></span>
              <span style={s("position:absolute; bottom:-3px; right:-3px; width:34px; height:34px; border-bottom:3px solid #00c2a8; border-right:3px solid #00c2a8; border-radius:0 0 14px 0;")}></span>
              <span style={s("position:absolute; bottom:14px; left:50%; transform:translateX(-50%); font-family:'DM Mono',monospace; font-size:10px; color:#6f827b;")}>RAW CARD / PSA LABEL</span>
            </div>
            <div style={s("position:absolute; bottom:24px; left:0; right:0; display:flex; justify-content:center;")}><span style={s("display:flex; align-items:center; gap:8px; background:rgba(24,179,104,.2); color:#5ee49f; font-weight:600; font-size:13px; padding:8px 16px; border-radius:100px;")}><span style={s("width:8px; height:8px; border-radius:50%; background:#5ee49f;")}></span>Aligned — hold steady</span></div>
          </div>
          <div style={s("flex:none; text-align:center; padding:0 20px 4px;")}><span style={s("font-size:14px; color:var(--muted-2); font-weight:500;")}>Align your card within the frame</span></div>
          <div style={s("flex:none; display:flex; align-items:center; justify-content:space-between; padding:14px 40px 30px;")}>
            <div style={s("width:52px; height:52px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center; color:var(--ink); font-weight:700; font-size:13px;")}>.5×</div>
            <div onClick={p.startProcessing} style={s("width:76px; height:76px; border-radius:50%; border:4px solid var(--ink); padding:4px; cursor:pointer;")}><div style={s("width:100%; height:100%; border-radius:50%; background:#00c2a8;")}></div></div>
            <div style={s("width:52px; height:52px; border-radius:50%; background:var(--surface-2); display:flex; align-items:center; justify-content:center;")}><svg width="20" height="20" viewBox="0 0 20 20" style={s("fill:none; stroke:var(--ink); stroke-width:1.7")} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="12" rx="2"/><circle cx="10" cy="10" r="3"/></svg></div>
          </div>
        </div>
  );
}
