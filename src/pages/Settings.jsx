import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings({ user, onLogout }) {
  const { logout } = useAuth()
  const doLogout = onLogout || logout

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [contactMethod, setContactMethod] = useState('phone')
  const [currentRole, setCurrentRole] = useState(user?.role || 'Student')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const roles = [
    { value: 'Admin', color: '#eab308', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)' },
    { value: 'Teacher', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)' },
    { value: 'Ambassador', color: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)' },
    { value: 'Student', color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.2)' },
    { value: 'Parent', color: '#ec4899', bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.4)' },
    { value: 'User', color: '#6366f1', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)' },
  ]

  const handleSave = async () => {
    setSaving(true)
    // TODO Phase 2: POST to Airtable
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Settings</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>Manage your profile and preferences</p>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
          background: 'linear-gradient(135deg, #e84b8a, #f97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff',
        }}>
          {user?.avatar ? (
            <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.name?.[0] || 'U'
          )}
        </div>
        <button style={{
          padding: '8px 16px', borderRadius: 10,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>Change Photo</button>
      </div>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="Full Name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Phone Number" value={phone} onChange={setPhone} type="tel" />

        {/* Preferred Contact Method */}
        <div>
          <label style={labelStyle}>Preferred Contact Method</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <ContactOption
              icon="📱" label="Phone/SMS" desc="Receive messages via text"
              active={contactMethod === 'phone'} onClick={() => setContactMethod('phone')}
            />
            <ContactOption
              icon="📧" label="Email" desc="Receive messages via email"
              active={contactMethod === 'email'} onClick={() => setContactMethod('email')}
            />
          </div>
        </div>

        {/* Role — now includes User */}
        <div>
          <label style={labelStyle}>Role</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {roles.map(r => (
              <button key={r.value} onClick={() => setCurrentRole(r.value)} style={{
                padding: '8px 18px', borderRadius: 20, cursor: 'pointer',
                background: currentRole === r.value ? r.bg : 'transparent',
                border: `1.5px solid ${currentRole === r.value ? r.border : 'rgba(255,255,255,0.1)'}`,
                color: currentRole === r.value ? r.color : 'rgba(255,255,255,0.4)',
                fontWeight: currentRole === r.value ? 600 : 400, fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
              }}>{r.value}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} disabled={saving} style={{
        width: '100%', marginTop: 32, padding: '16px',
        background: saved ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #e84b8a, #f97316)',
        border: 'none', borderRadius: 14, color: '#fff', fontSize: 17, fontWeight: 700,
        cursor: saving ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif",
        transition: 'all 0.3s',
      }}>
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
      </button>

      {/* Danger Zone */}
      <div style={{ marginTop: 40, padding: '20px', borderRadius: 14, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
        <h3 style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Danger Zone</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '8px 16px', borderRadius: 8, background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
            fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>Change Password</button>
          <button style={{
            padding: '8px 16px', borderRadius: 8, background: 'transparent',
            border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444',
            fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>Delete Account</button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, marginBottom: 8,
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
        fontSize: 15, boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", outline: 'none',
      }} />
    </div>
  )
}

function ContactOption({ icon, label, desc, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
      background: active ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.03)',
      border: active ? '2px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
      textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: active ? '6px solid #a855f7' : '2px solid rgba(255,255,255,0.2)',
        boxSizing: 'border-box',
      }} />
      <div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon} {label}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{desc}</div>
      </div>
    </button>
  )
}
