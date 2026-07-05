interface ProgressRingProps {
  pct: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}

export default function ProgressRing({ pct, size = 120, strokeWidth = 10, label, sublabel }: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - pct / 100)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c6dfa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <div className="text-2xl font-bold text-white">{label}</div>}
        {sublabel && <div className="text-[10px] text-white/40 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  )
}
