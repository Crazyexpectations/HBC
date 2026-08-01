interface Props {
  x: number;
  y: number;
  size?: number;
}

// A tiny scurrying mouse for the "hunting" cat activity — purely decorative,
// cheap CSS jitter instead of real physics.
export default function Mouse({ x, y, size = 26 }: Props) {
  return (
    <div
      className="cat-mouse-scurry pointer-events-none absolute z-10"
      style={{ left: x, top: y, width: size, height: size, transform: 'translate(-50%, -50%)' }}
      aria-hidden
    >
      <svg viewBox="0 0 40 40" width="100%" height="100%">
        <path d="M8 22 Q2 14 10 12" fill="none" stroke="#8a8690" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="20" cy="24" rx="12" ry="9" fill="#a9a4b0" />
        <circle cx="10" cy="14" r="5" fill="#a9a4b0" />
        <circle cx="18" cy="12" r="5" fill="#a9a4b0" />
        <circle cx="10" cy="14" r="2.4" fill="#ffc9d6" />
        <circle cx="18" cy="12" r="2.4" fill="#ffc9d6" />
        <circle cx="12" cy="21" r="1.3" fill="#2a2830" />
        <circle cx="6" cy="24" r="1.6" fill="#ff8fab" />
      </svg>
    </div>
  );
}
