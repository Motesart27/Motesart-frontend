/**
 * Admin Dashboard — School of Motesart
 * Converted from admin-v9.html → React JSX
 *
 * Usage:
 *   import AdminDashboard from './AdminDashboard';
 *   import './AdminDashboard.css';
 *
 * Images are in ./assets/ — update import paths to match your bundler.
 */

import React from 'react';

// ─── Image imports ───────────────────────────────────────────
// Update these paths based on your project structure / bundler
import tamiImg from './assets/image-1-nav-tab-active.png';
import img2 from './assets/image-2.png';
import img3 from './assets/image-3.png';
import img4 from './assets/image-4.png';
import img5 from './assets/image-5.png';
import img6 from './assets/image-6.png';
import img7 from './assets/image-7.png';
import img8 from './assets/image-8.png';
import img9 from './assets/image-9.png';
import img10 from './assets/image-10.png';
import img11 from './assets/image-11.png';


// ═══════════════════════════════════════════════════════════════
// TOP NAV
// ═══════════════════════════════════════════════════════════════
function TopNav() {
  const tabs = [
    { label: 'Overview', dotColor: '#f97316', dotShadow: true, active: true },
    { label: 'T.A.M.i', isTami: true },
    { label: 'Students', dotColor: '#14b8a6' },
    { label: 'Teachers', dotColor: '#f97316' },
    { label: 'Ambassadors', dotColor: '#3b82f6' },
    { label: 'Parents', dotColor: '#a855f7' },
    { label: 'Game', dotColor: '#22c55e' },
  ];

  return (
    <div className="topnav">
      <div className="nav-brand">
        <span style={{ fontSize: 18 }}>⚡</span>
        <span className="nav-brand-label">ADMIN</span>
      </div>
      <div className="nav-tabs">
        {tabs.map((tab, i) => (
          <div key={i} className={`nav-tab${tab.active ? ' active' : ''}`}>
            {tab.isTami ? (
              <img className="tami-nav-img" src={tamiImg} alt="TAMi" />
            ) : (
              <div
                className="nav-dot"
                style={{
                  background: tab.dotColor,
                  ...(tab.dotShadow ? { boxShadow: `0 0 5px ${tab.dotColor}` } : {}),
                }}
              />
            )}
            {' '}{tab.label}
          </div>
        ))}
      </div>
      <div className="nav-right">
        <span className="nav-user">Dwain M · All Roles</span>
        <div className="bell">
          🔔<div className="bell-badge">4</div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// PROFILE HEADER
// ═══════════════════════════════════════════════════════════════
function ProfileHeader() {
  return (
    <div className="profile-header">
      <div className="back-btn">←</div>
      <div className="p-avatar">DM</div>
      <div style={{ flex: 1 }}>
        <div className="p-name">Dwain Motes</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span className="badge-admin">ADMIN</span>
        </div>
        <div className="p-sub">School of Motesart · Platform Administrator</div>
      </div>
      <div className="tami-pill">
        <img src={tamiImg} alt="T.A.M.i" />
        <div className="tami-online" />
        <span className="tami-pill-label">T.A.M.i</span>
      </div>
      <div className="bell" style={{ marginLeft: 12 }}>
        🔔<div className="bell-badge">4</div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════
function HeroSection() {
  const stats = [
    { value: '142', color: '#3b82f6', label: 'Total Signups' },
    { value: '12', color: '#22c55e', label: 'Schools Enrolled' },
    { value: '66%', color: '#f97316', label: 'Avg Conv. Rate' },
    { value: '.8K', color: '#e84b8a', label: 'Revenue Raised' },
  ];

  return (
    <div className="hero">
      <div className="hero-left">
        <div className="hero-greeting">Good afternoon, Dwain 🎉</div>
        <div className="ref-row">
          <span className="ref-label">Platform code:</span>
          <span className="ref-code">SOM-ADMIN</span>
          <span className="ref-copy">🔗 Copy</span>
        </div>
        <div className="hero-stats">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="hs-val" style={{ color: s.color }}>{s.value}</div>
              <div className="hs-lbl">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="share-btn" style={{ marginTop: 18 }}>📋 Share Platform Materials</div>
      </div>
      <div className="hero-right">
        <div className="hr-label">New Signup Sign-In Rate</div>
        <div className="hr-pct">82%</div>
        <div className="hr-bar">
          <div className="hr-bar-fill" />
        </div>
        <div className="hr-sub">Logged in within 7 days</div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="hr-label">States Represented</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>9</div>
          <div className="hr-sub" style={{ marginTop: 5 }}>TX · CA · FL · NY · GA · OH · IL · NC · WA</div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TAMI INSIGHT
// ═══════════════════════════════════════════════════════════════
function TamiInsight() {
  return (
    <div className="tami-insight">
      <img src={tamiImg} alt="T.A.M.i" />
      <div>
        <div className="ti-label">T.A.M.i Platform Intelligence</div>
        <div className="ti-text">
          Signups up <strong style={{ color: '#22c55e' }}>18%</strong> this week driven by
          Ambassador code MOTES2026. Texas leads with 23 new students. Revenue reached{' '}
          <strong style={{ color: '#f97316' }}>,820</strong> this month. Top ear training school:{' '}
          <strong style={{ color: '#14b8a6' }}>Westview Music Academy (82% accuracy)</strong>.
          3 students flagged for immediate outreach. 🎯
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// STAT CARDS
// ═══════════════════════════════════════════════════════════════
function StatsRow() {
  const cards = [
    { icon: '✍️', value: '142', label: 'Total Signups', change: '↑ 18 this week', colorClass: 's-or' },
    { icon: '🏫', value: '12', label: 'Schools Enrolled', change: '↑ 2 this month', colorClass: 's-te' },
    { icon: '📍', value: '9', label: 'States Represented', change: '↑ TX, FL added', colorClass: 's-bl' },
    { icon: '💰', value: '.8K', label: 'Revenue Circulating', change: '↑ 24% vs last month', colorClass: 's-pk' },
    { icon: '🎮', value: '1,284', label: 'Game Sessions / Week', change: '↑ 12% vs last week', colorClass: 's-pu' },
  ];

  return (
    <div className="stats-row">
      {cards.map((c, i) => (
        <div key={i} className={`stat-card ${c.colorClass}`}>
          <div className="stat-icon">{c.icon}</div>
          <div className="stat-val">{c.value}</div>
          <div className="stat-lbl">{c.label}</div>
          <div className="stat-chg up">{c.change}</div>
        </div>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// AMBASSADOR LEADERBOARD
// ═══════════════════════════════════════════════════════════════
function AmbassadorLeaderboard() {
  const ambassadors = [
    { medal: '🥇', medalBg: 'rgba(234,179,8,0.1)', initials: 'DM', avBg: 'rgba(249,115,22,0.15)', avColor: '#f97316', name: 'Dwain Motes', tier: '🏆 GOLD', tierClass: 't-go', refs: 47, conv: 31, rate: '66%', money: '20', signups: '47 signups' },
    { medal: '🥇', medalBg: 'rgba(234,179,8,0.07)', initials: 'JO', avBg: 'rgba(59,130,246,0.15)', avColor: '#3b82f6', name: 'James Okoro', tier: '🏆 GOLD', tierClass: 't-go', refs: 31, conv: 18, rate: '58%', money: '10', signups: '31 signups' },
    { medal: '🥈', medalBg: 'rgba(148,163,184,0.08)', initials: 'SR', avBg: 'rgba(168,85,247,0.15)', avColor: '#a855f7', name: 'Sofia Rivera', tier: '🥈 SILVER', tierClass: 't-si', refs: 24, conv: 13, rate: '54%', money: '10', signups: '24 signups' },
    { medal: '🥈', medalBg: 'rgba(148,163,184,0.05)', initials: 'AJ', avBg: 'rgba(232,75,138,0.15)', avColor: '#e84b8a', name: 'Aaliyah Johnson', tier: '🥈 SILVER', tierClass: 't-si', refs: 18, conv: 9, rate: '50%', money: '20', signups: '18 signups' },
    { medal: '🥉', medalBg: 'rgba(180,100,40,0.08)', initials: 'MW', avBg: 'rgba(34,197,94,0.15)', avColor: '#22c55e', name: 'Marcus Williams', tier: '🥉 BRONZE', tierClass: 't-br', refs: 12, conv: 5, rate: '42%', money: '50', signups: '12 signups' },
  ];

  return (
    <div className="card">
      <div className="card-hdr">
        <div>
          <div className="card-title">🔗 Ambassador Leaderboard</div>
          <div className="card-sub">8 active · ranked by performance tier</div>
        </div>
        <span className="pill p-or2">Live</span>
      </div>
      <div className="ftabs">
        <div className="ftab f-or">Signups</div>
        <div className="ftab">Money Raised</div>
        <div className="ftab">Tiers</div>
      </div>
      {ambassadors.map((a, i) => (
        <div key={i} className="amb-row">
          <div className="amb-medal" style={{ background: a.medalBg }}>{a.medal}</div>
          <div className="amb-av" style={{ background: a.avBg, color: a.avColor }}>{a.initials}</div>
          <div style={{ flex: 1 }}>
            <div className="amb-name-row">
              <span className="amb-name">{a.name}</span>
              <span className={`tier-badge ${a.tierClass}`}>{a.tier}</span>
            </div>
            <div className="amb-meta">
              <span>Refs: <b>{a.refs}</b></span>
              <span>Conv: <b>{a.conv}</b></span>
              <span>Rate: <b>{a.rate}</b></span>
            </div>
          </div>
          <div className="amb-right">
            <div className="amb-money">{a.money}</div>
            <div className="amb-count">{a.signups}</div>
          </div>
        </div>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TAMI LEADERS
// ═══════════════════════════════════════════════════════════════
function TamiLeaders() {
  const leaders = [
    { num: 1, initials: 'AJ', avBg: 'rgba(232,75,138,0.15)', avColor: '#e84b8a', name: 'Aaliyah Johnson', meta: 'Student · Westview Academy · TX', value: 94, valueColor: '#e84b8a' },
    { num: 2, initials: 'SR', avBg: 'rgba(20,184,166,0.15)', avColor: '#14b8a6', name: 'Sofia Rivera', meta: 'Student · Lincoln Arts · CA', value: 71, valueColor: '#14b8a6' },
    { num: 3, initials: 'DM', avBg: 'rgba(249,115,22,0.15)', avColor: '#f97316', name: 'Dwain Motes', meta: 'Admin · Platform-wide · TX', value: 58, valueColor: '#f97316' },
    { num: 4, initials: 'MW', avBg: 'rgba(59,130,246,0.15)', avColor: '#3b82f6', name: 'Marcus Williams', meta: 'Teacher · Music Theory 101 · NY', value: 44, valueColor: '#3b82f6' },
    { num: 5, initials: 'JO', avBg: 'rgba(168,85,247,0.15)', avColor: '#a855f7', name: 'James Okoro', meta: 'Ambassador · Outreach · GA', value: 38, valueColor: '#a855f7' },
  ];

  return (
    <div className="card">
      <div className="tami-card-hdr">
        <img src={tamiImg} alt="T.A.M.i" />
        <div style={{ flex: 1 }}>
          <div className="card-title">T.A.M.i Leaders</div>
          <div className="card-sub">
            Top engagement with <img className="tami-xs" src={tamiImg} alt="TAMi" /> across the platform
          </div>
        </div>
        <span className="pill p-pk2">Live</span>
      </div>
      <div className="ftabs">
        <div className="ftab f-pk">👤 User</div>
        <div className="ftab">🎓 Class</div>
        <div className="ftab">🏫 School</div>
        <div className="ftab">📍 State</div>
        <div className="ftab">🔥 Streak</div>
        <div className="ftab">⭐ Rising</div>
      </div>
      <div className="tab-cat-lbl">
        👤 Top Users by <img className="tami-xs" src={tamiImg} alt="TAMi" /> Engagement
      </div>
      {leaders.map((l, i) => (
        <div key={i} className="lr">
          <div className="lr-num">{l.num}</div>
          <div className="lr-av" style={{ background: l.avBg, color: l.avColor }}>{l.initials}</div>
          <div style={{ flex: 1 }}>
            <div className="lr-name">{l.name}</div>
            <div className="lr-meta">{l.meta}</div>
          </div>
          <div>
            <div className="lr-val-n" style={{ color: l.valueColor }}>{l.value}</div>
            <div className="lr-val-l">
              <img className="tami-xs" src={tamiImg} alt="TAMi" /> chats
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
        Switch tabs → 🎓 Class · 🏫 School · 📍 State · 🔥 Streak · ⭐ Rising Star
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// DPM HEALTH + RISK
// ═══════════════════════════════════════════════════════════════
function DpmHealth() {
  const bars = [
    { label: 'Students', width: '72%', gradient: 'linear-gradient(90deg,#14b8a6,#22c55e)', color: '#14b8a6', pct: '72%' },
    { label: 'Teachers', width: '88%', gradient: 'linear-gradient(90deg,#f97316,#fbbf24)', color: '#f97316', pct: '88%' },
    { label: 'Ambassadors', width: '65%', gradient: 'linear-gradient(90deg,#3b82f6,#a855f7)', color: '#3b82f6', pct: '65%' },
    { label: 'Parents', width: '41%', gradient: 'linear-gradient(90deg,#a855f7,#e84b8a)', color: '#a855f7', pct: '41%' },
  ];

  const risks = [
    { value: 8, label: '🔴 Critical', className: 'r-cr' },
    { value: 14, label: '🟠 At Risk', className: 'r-at' },
    { value: 21, label: '🟡 Watch', className: 'r-wa' },
    { value: 55, label: '🟢 On Track', className: 'r-on' },
  ];

  return (
    <div className="card">
      <div className="card-hdr">
        <div><div className="card-title">📊 DPM Health by Role</div></div>
        <span className="pill p-or2">Avg: 74%</span>
      </div>
      {bars.map((b, i) => (
        <div key={i} className="bar-row">
          <div className="bar-lbl">{b.label}</div>
          <div className="bw">
            <div className="bf" style={{ width: b.width, background: b.gradient }} />
          </div>
          <div className="bar-pct" style={{ color: b.color }}>{b.pct}</div>
        </div>
      ))}
      <div className="sdiv">
        <div className="slbl">Student Risk Breakdown</div>
        <div className="risk-row">
          {risks.map((r, i) => (
            <div key={i} className={`risk-box ${r.className}`}>
              <div className="rv">{r.value}</div>
              <div className="rl">{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// SYSTEM ALERTS + HEALTH
// ═══════════════════════════════════════════════════════════════
function SystemAlerts() {
  const alerts = [
    { color: '#ef4444', shadow: true, text: '14 students inactive 7+ days', time: 'T.A.M.i flagged · 2h ago' },
    { color: '#f97316', shadow: false, text: '3 teacher accounts pending verification', time: 'System · 5h ago' },
    { color: '#eab308', shadow: false, text: 'Airtable API at 82% rate limit', time: 'System · 8h ago' },
    { color: '#eab308', shadow: false, text: 'Session log sync delayed — Railway', time: 'System · 12h ago' },
  ];

  const healthItems = [
    { name: 'Railway Backend', dotClass: 'dg', statusClass: 'hg', status: 'Online' },
    { name: 'Netlify Frontend', dotClass: 'dg', statusClass: 'hg', status: 'Deployed' },
    { name: 'Airtable DB', dotClass: 'dy', statusClass: 'hy', status: 'High Load' },
    { name: 'T.A.M.i API', dotClass: 'dg', statusClass: 'hg', status: 'Active' },
  ];

  return (
    <div className="card">
      <div className="card-hdr">
        <div className="card-title">🔔 System Alerts</div>
        <span className="pill p-rd">4 active</span>
      </div>
      {alerts.map((a, i) => (
        <div key={i} className="alert-row">
          <div
            className="adot"
            style={{
              background: a.color,
              ...(a.shadow ? { boxShadow: `0 0 5px ${a.color}` } : {}),
            }}
          />
          <div>
            <div className="a-txt">{a.text}</div>
            <div className="a-time">{a.time}</div>
          </div>
        </div>
      ))}
      <div className="sdiv">
        <div className="slbl">⚙️ System Health</div>
        {healthItems.map((h, i) => (
          <div key={i} className="h-row">
            <div className="h-name">{h.name}</div>
            <div className="h-st">
              <div className={h.dotClass} />
              <span className={h.statusClass}>{h.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOP STATES
// ═══════════════════════════════════════════════════════════════
function TopStates() {
  const states = [
    { abbr: 'TX', width: '90%', count: 28 },
    { abbr: 'CA', width: '70%', count: 21 },
    { abbr: 'FL', width: '55%', count: 17 },
    { abbr: 'NY', width: '42%', count: 13 },
    { abbr: 'GA', width: '28%', count: 9 },
    { abbr: 'OH', width: '18%', count: 6 },
  ];

  return (
    <div className="card">
      <div className="card-hdr">
        <div className="card-title">📍 Top States</div>
        <span className="pill p-or2">9 states</span>
      </div>
      {states.map((s, i) => (
        <div key={i} className="bar-row">
          <div className="bar-lbl-sm">{s.abbr}</div>
          <div className="bw">
            <div className="bf" style={{ width: s.width, background: 'linear-gradient(90deg,#f97316,#e84b8a)' }} />
          </div>
          <div className="bar-cnt">{s.count}</div>
        </div>
      ))}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// REVENUE BREAKDOWN
// ═══════════════════════════════════════════════════════════════
function RevenueBreakdown() {
  const rows = [
    { label: 'Subscriptions', value: ',200', color: '#22c55e' },
    { label: 'Ambassador Referrals', value: ',710', color: '#f97316' },
    { label: 'School Licenses', value: '10', color: '#3b82f6' },
  ];

  return (
    <div className="card">
      <div className="card-hdr">
        <div className="card-title">💰 Revenue Breakdown</div>
        <span className="pill p-gr">+24%</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="money-row">
          <div className="m-lbl">{r.label}</div>
          <div className="m-val" style={{ color: r.color }}>{r.value}</div>
        </div>
      ))}
      <div
        className="money-row"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 6, paddingTop: 10, borderBottom: 'none' }}
      >
        <div className="m-lbl" style={{ fontWeight: 800, color: '#fff' }}>Total</div>
        <div className="m-val" style={{ color: '#e84b8a', fontSize: 18 }}>,820</div>
      </div>
      <div style={{ marginTop: 14, padding: 10, borderRadius: 10, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.1)', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>vs last month</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#22c55e' }}>+,120</div>
        <div style={{ fontSize: 11, color: 'rgba(34,197,94,0.7)' }}>↑ 24% growth</div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// QUICK ACTIONS
// ═══════════════════════════════════════════════════════════════
function QuickActions() {
  const actions = [
    { icon: '➕', label: 'Add User' },
    { icon: '📧', label: 'Broadcast' },
    { icon: '🔄', label: 'Restart Backend' },
    { icon: '📤', label: 'Export Data' },
    { icon: '🏫', label: 'Manage Schools' },
    { icon: '💰', label: 'Payouts' },
    { icon: '🤖', label: 'T.A.M.i Config' },
    { icon: '📝', label: 'View Logs' },
    { icon: '📊', label: 'Reports' },
  ];

  return (
    <div className="card">
      <div className="card-hdr">
        <div className="card-title">⚡ Quick Actions</div>
      </div>
      <div className="qa-grid">
        {actions.map((a, i) => (
          <div key={i} className="qa-btn">
            <div className="qa-icon">{a.icon}</div>
            <div className="qa-lbl">{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD (default export)
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  return (
    <>
      <TopNav />
      <ProfileHeader />

      <div className="main">
        <HeroSection />
        <TamiInsight />
        <StatsRow />

        {/* Row 1: Ambassador + TAMi Leaders */}
        <div className="grid-2col">
          <AmbassadorLeaderboard />
          <TamiLeaders />
        </div>

        {/* Row 2: DPM + Alerts/Health */}
        <div className="grid-2col">
          <DpmHealth />
          <SystemAlerts />
        </div>

        {/* Row 3: States + Revenue + Quick Actions */}
        <div className="grid-3col">
          <TopStates />
          <RevenueBreakdown />
          <QuickActions />
        </div>
      </div>
    </>
  );
}

// Also export individual components for flexibility
export {
  TopNav,
  ProfileHeader,
  HeroSection,
  TamiInsight,
  StatsRow,
  AmbassadorLeaderboard,
  TamiLeaders,
  DpmHealth,
  SystemAlerts,
  TopStates,
  RevenueBreakdown,
  QuickActions,
};
