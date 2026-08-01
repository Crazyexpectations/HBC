import Cat, { CAT_PALETTES } from './Cat';

interface Props {
  palette?: keyof typeof CAT_PALETTES;
  bottom?: number | string;
  duration?: number;
  delay?: number;
  size?: number;
}

// A stray cat that strolls across the bottom of a section every so often —
// works on touch too (tap to pounce), unlike the cursor-following companion.
// Pure CSS position animation (`left`), so it costs nothing to have several.
export default function RoamingCat({ palette = 'charcoal', bottom = 24, duration = 22, delay = 2, size = 48 }: Props) {
  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        bottom,
        left: -80,
        animation: `cat-walk-across ${duration}s linear ${delay}s infinite`,
      }}
    >
      <div className="pointer-events-auto">
        <Cat palette={palette} size={size} bouncing />
      </div>
    </div>
  );
}
