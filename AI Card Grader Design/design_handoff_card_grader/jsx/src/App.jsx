import React, { useState, useRef } from 'react';
import { StatusBar, HomeIndicator } from './Chrome.jsx';
import { s } from './style.js';
import Onboarding from './screens/Onboarding.jsx';
import Paywall from './screens/Paywall.jsx';
import Home from './screens/Home.jsx';
import Scan from './screens/Scan.jsx';
import Analysis from './screens/Analysis.jsx';
import Grade from './screens/Grade.jsx';
import Roi from './screens/Roi.jsx';
import Collection from './screens/Collection.jsx';
import Detail from './screens/Detail.jsx';
import Insights from './screens/Insights.jsx';
import Profile from './screens/Profile.jsx';

const SCREENS = {
  onboarding: Onboarding,
  paywall: Paywall,
  home: Home,
  scan: Scan,
  analysis: Analysis,
  grade: Grade,
  roi: Roi,
  collection: Collection,
  detail: Detail,
  insights: Insights,
  profile: Profile,
};

export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [theme, setTheme] = useState('light');
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  const go = (n) => () => { if (timer.current) clearTimeout(timer.current); setScreen(n); };
  const dot = (i) => slide === i
    ? { display: 'inline-block', width: '24px', height: '7px', borderRadius: '4px', background: 'var(--accent)' }
    : { display: 'inline-block', width: '7px', height: '7px', borderRadius: '4px', background: '#cdd6d2' };

  const p = {
    slide,
    dot0: dot(0), dot1: dot(1), dot2: dot(2),
    goOnboarding: go('onboarding'), goPaywall: go('paywall'), goHome: go('home'),
    goScan: go('scan'), goGrade: go('grade'), goRoi: go('roi'),
    goCollection: go('collection'), goDetail: go('detail'),
    goInsights: go('insights'), goProfile: go('profile'),
    toggleTheme: () => setTheme(t => (t === 'light' ? 'dark' : 'light')),
    nextSlide: () => setSlide(prev => { if (prev >= 2) { setScreen('paywall'); return prev; } return prev + 1; }),
    startProcessing: () => {
      if (timer.current) clearTimeout(timer.current);
      setScreen('analysis');
      timer.current = setTimeout(() => setScreen('grade'), 2300); // TODO: replace with real grading inference call
    },
  };

  const Active = SCREENS[screen];

  return (
    <div style={s("min-height:100vh; display:flex; align-items:flex-start; justify-content:center; background:#dfe3e1; font-family:'Hanken Grotesk',sans-serif; padding:18px 0;")}>
      <div>
        <div className="cg-app" data-theme={theme} style={s("width:390px; height:844px; background:var(--bg); border-radius:46px; border:1px solid rgba(13,30,26,.14); box-shadow:0 24px 60px rgba(13,30,26,.22); overflow:hidden; position:relative; display:flex; flex-direction:column; color:var(--ink);")}>
          <StatusBar />
          <div style={s("flex:1; position:relative; overflow:hidden;")}>
            <Active {...p} />
          </div>
          <HomeIndicator />
        </div>
        <div style={s("text-align:center; margin-top:14px; font-family:'DM Mono',monospace; font-size:11px; color:#9aa6a0; letter-spacing:0.04em;")}>INTERACTIVE PROTOTYPE · TAP TO NAVIGATE</div>
      </div>
    </div>
  );
}
