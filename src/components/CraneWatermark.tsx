// Minimal tower crane SVG silhouette for background watermark
export default function CraneWatermark() {
  return (
    <svg
      viewBox="0 0 300 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        right: 20,
        bottom: 0,
        width: 280,
        height: 420,
        opacity: 0.035,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Mast / tower column */}
      <rect x="138" y="100" width="24" height="380" fill="#000" />
      {/* Main jib (horizontal arm going left from top) */}
      <rect x="20" y="90" width="270" height="14" fill="#000" />
      {/* Counter-jib (shorter, going right) */}
      {/* Tie cables from top of mast to jib tip */}
      <line x1="150" y1="60" x2="20" y2="104" stroke="#000" strokeWidth="5" />
      <line x1="150" y1="60" x2="290" y2="104" stroke="#000" strokeWidth="5" />
      {/* Vertical cable + hook */}
      <line x1="80" y1="104" x2="80" y2="180" stroke="#000" strokeWidth="4" />
      <rect x="70" y="180" width="20" height="14" rx="2" fill="#000" />
      <path d="M80 194 Q65 210 72 224 Q80 240 92 228 Q100 218 88 212" stroke="#000" strokeWidth="4" fill="none" />
      {/* Cabin at top of mast */}
      <rect x="128" y="58" width="44" height="32" rx="3" fill="#000" />
      {/* Counter-weight block */}
      <rect x="232" y="104" width="42" height="22" rx="2" fill="#000" />
      {/* Base / foundation cross */}
      <rect x="90" y="468" width="120" height="16" rx="4" fill="#000" />
      <rect x="110" y="450" width="80" height="20" rx="3" fill="#000" />
    </svg>
  );
}
