import { useState, useEffect } from 'react'

/**
 * DpmRing — animated SVG donut chart.
 * 
 * Props:
 *   value — 0–100 percentage
 *   label — text below the number
 *   color — hex color for the ring
 *   size — diameter in px (default 100)
 *   strokeWidth — ring thickness (default 8)
 */
export default function DpmRing({ value = 0, label = '', color = '#a855f7', size = 100, strokeWidth = 8 }) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(value), 200)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Value ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s ease-out', filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{Math.round(animated)}%</span>
        </div>
      </div>
      {label && <span className="text-[11px] font-medium text-white/50">{label}</span>}
    </div>
  )
}
