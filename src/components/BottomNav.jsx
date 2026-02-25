import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ICONS = {
  home: '🏠',
  play: '🎮',
  practice: '📈',
  homework: '📝',
  leaders: '🏆',
  settings: '⚙️',
  classes: '👩‍🏫',
  children: '👨‍👩‍👧',
}

// Nav items per role
const NAV_CONFIG = {
  Student: [
    { key: 'home', label: 'Home', path: '/dashboard' },
    { key: 'play', label: 'Play', path: '/game' },
    { key: 'practice', label: 'Practice', path: '/practice' },
    { key: 'homework', label: 'Homework', path: '/homework' },
    { key: 'leaders', label: 'Leaders', path: '/leaderboard' },
  ],
  User: [
    { key: 'home', label: 'Home', path: '/dashboard' },
    { key: 'play', label: 'Play', path: '/game' },
    { key: 'practice', label: 'Practice', path: '/practice' },
    { key: 'leaders', label: 'Leaders', path: '/leaderboard' },
    { key: 'settings', label: 'Settings', path: '/settings' },
  ],
  Teacher: [
    { key: 'home', label: 'Home', path: '/dashboard' },
    { key: 'classes', label: 'Classes', path: '/teacher' },
    { key: 'homework', label: 'Homework', path: '/homework' },
    { key: 'leaders', label: 'Leaders', path: '/leaderboard' },
    { key: 'settings', label: 'Settings', path: '/settings' },
  ],
  Parent: [
    { key: 'home', label: 'Home', path: '/dashboard' },
    { key: 'children', label: 'Children', path: '/parent' },
    { key: 'practice', label: 'Practice', path: '/practice' },
    { key: 'leaders', label: 'Leaders', path: '/leaderboard' },
    { key: 'settings', label: 'Settings', path: '/settings' },
  ],
  Admin: [
    { key: 'home', label: 'Home', path: '/dashboard' },
    { key: 'classes', label: 'Teachers', path: '/teacher' },
    { key: 'leaders', label: 'Leaders', path: '/leaderboard' },
    { key: 'practice', label: 'Practice', path: '/practice' },
    { key: 'settings', label: 'Settings', path: '/settings' },
  ],
}

export default function BottomNav() {
  const { role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const items = NAV_CONFIG[role] || NAV_CONFIG.User

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = location.pathname === item.path
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={active ? 'nav-item-active' : 'nav-item'}
          >
            <span className="text-lg">{ICONS[item.key]}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
