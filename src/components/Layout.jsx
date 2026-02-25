import AdminBanner from './AdminBanner.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * Layout — wraps all authenticated pages.
 * Provides: Emergent background, admin banner, bottom nav, padding for nav.
 * 
 * Props:
 *   hideNav — hides bottom nav (e.g. for game page)
 *   className — extra classes for content area
 */
export default function Layout({ children, hideNav = false, className = '' }) {
  return (
    <div className="min-h-screen bg-emergent relative">
      {/* Ambient glow orbs */}
      <div className="glow-orb w-72 h-72 bg-brand-purple/15 top-10 -left-20" />
      <div className="glow-orb w-96 h-96 bg-brand-pink/10 top-1/3 -right-32" />
      <div className="glow-orb w-64 h-64 bg-brand-teal/10 bottom-20 left-1/4" />

      {/* Admin read-only banner */}
      <AdminBanner />

      {/* Page content */}
      <main className={`relative z-10 ${hideNav ? '' : 'pb-20'} ${className}`}>
        {children}
      </main>

      {/* Bottom navigation */}
      {!hideNav && <BottomNav />}
    </div>
  )
}
