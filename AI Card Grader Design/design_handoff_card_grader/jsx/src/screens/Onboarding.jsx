import React from 'react';
import { s } from '../style.js';

export default function Onboarding(p) {
  return (
<div style={s("height:100%; display:flex; flex-direction:column; animation:cg-fade .3s ease;")}>
          <div style={s("flex:none; display:flex; justify-content:flex-end; padding:2px 26px;")}><span onClick={p.goPaywall} style={s("font-size:14px; color:var(--muted); font-weight:600; cursor:pointer;")}>Skip</span></div>
          <div style={s("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 34px;")}>
            <div style={s("position:relative; width:230px; height:296px; margin-bottom:40px;")}>
              <div style={s("position:absolute; inset:0; background:linear-gradient(150deg,rgba(0,194,168,.14),rgba(91,108,255,.14)); border-radius:28px;")}></div>
              <div style={s("position:absolute; left:30px; top:34px; width:118px; height:166px; border-radius:12px; transform:rotate(-9deg); background:var(--thumb); border:1px solid var(--line-2); box-shadow:0 10px 24px rgba(13,30,26,.16);")}></div>
              <div style={s("position:absolute; right:26px; bottom:28px; width:118px; height:166px; border-radius:12px; transform:rotate(8deg); background:var(--slab); border:1px solid var(--line-2); box-shadow:0 14px 30px rgba(13,30,26,.24); display:flex; align-items:center; justify-content:center;")}><span style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:40px; color:#00c2a8;")}>10</span></div>
              <div style={s("position:absolute; right:4px; top:6px; width:46px; height:46px; border-radius:50%; background:#00c2a8; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(0,194,168,.4);")}><svg width="20" height="20" viewBox="0 0 20 20" style={s("fill:none; stroke:#04332c; stroke-width:2.2")} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h1L8 2h4l1.5 2h1A2.5 2.5 0 0 1 17 6.5V14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="10" cy="10" r="3"/></svg></div>
            </div>
            {p.slide === 0 && (<div style={s("text-align:center;")}><div style={s("font-family:'DM Mono',monospace; font-size:12px; letter-spacing:0.12em; color:var(--accent-deep); margin-bottom:14px;")}>SNAP · GRADE · KNOW</div><h2 style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:32px; line-height:1.06; letter-spacing:-0.02em; color:var(--ink); margin:0 0 14px;")}>AI grading from<br/>two photos</h2><p style={s("font-size:15px; line-height:1.55; color:var(--muted-2); margin:0;")}>Shoot the front and back, get a predicted PSA grade with sub-grades in seconds.</p></div>)}
            {p.slide === 1 && (<div style={s("text-align:center;")}><div style={s("font-family:'DM Mono',monospace; font-size:12px; letter-spacing:0.12em; color:var(--accent-deep); margin-bottom:14px;")}>BUY SMARTER</div><h2 style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:32px; line-height:1.06; letter-spacing:-0.02em; color:var(--ink); margin:0 0 14px;")}>Know the value<br/>before you buy</h2><p style={s("font-size:15px; line-height:1.55; color:var(--muted-2); margin:0;")}>See raw and graded comps plus net ROI before you ever commit cash.</p></div>)}
            {p.slide === 2 && (<div style={s("text-align:center;")}><div style={s("font-family:'DM Mono',monospace; font-size:12px; letter-spacing:0.12em; color:var(--accent-deep); margin-bottom:14px;")}>TRACK EVERYTHING</div><h2 style={s("font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:32px; line-height:1.06; letter-spacing:-0.02em; color:var(--ink); margin:0 0 14px;")}>Watch your<br/>collection grow</h2><p style={s("font-size:15px; line-height:1.55; color:var(--muted-2); margin:0;")}>Live portfolio value, real gem-rate, and price alerts on every card.</p></div>)}
          </div>
          <div style={s("flex:none; padding:0 32px 26px;")}>
            <div style={s("display:flex; gap:7px; justify-content:center; margin-bottom:22px;")}><span style={p.dot0}></span><span style={p.dot1}></span><span style={p.dot2}></span></div>
            <div onClick={p.nextSlide} style={s("height:56px; border-radius:18px; background:var(--ink); display:flex; align-items:center; justify-content:center; color:var(--bg); font-weight:700; font-size:16px; cursor:pointer;")}>Next</div>
          </div>
        </div>
  );
}
