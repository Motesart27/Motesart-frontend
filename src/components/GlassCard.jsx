/**
 * GlassCard — the core Emergent UI card component.
 * 
 * Props:
 *   hover — adds hover glow effect
 *   glow — 'purple' | 'teal' | 'pink' — colored border glow
 *   className — extra classes
 *   onClick — makes it clickable
 */
export default function GlassCard({ children, hover = false, glow, className = '', onClick, ...props }) {
  const glowStyles = {
    purple: 'border-brand-purple/30 shadow-glow-purple',
    teal: 'border-brand-teal/30 shadow-glow-teal',
    pink: 'border-brand-pink/30 shadow-glow-pink',
  }

  return (
    <div
      className={`
        ${hover ? 'glass-card-hover' : 'glass-card'}
        ${glow ? glowStyles[glow] : ''}
        p-4 ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
