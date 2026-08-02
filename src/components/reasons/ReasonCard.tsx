import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  emoji: string;
  title: string;
  text: string;
  index: number;
}

const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 });

function burst(x: number, y: number) {
  confetti({
    particleCount: 26,
    spread: 70,
    startVelocity: 28,
    scalar: 0.9,
    shapes: [heart],
    colors: ['#e0355c', '#9c1f3f', '#f5a8b8'],
    origin: { x, y },
    gravity: 0.9,
    ticks: 130,
  });
}

export default function ReasonCard({ emoji, title, text, index }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    burst(x, y);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      onClick={handleClick}
      data-cursor="hover"
      className="glass group relative cursor-pointer rounded-2xl p-6 text-center shadow-lg shadow-black/20 transition-shadow hover:shadow-rose/20"
    >
      <motion.div
        className="mb-3 text-4xl"
        whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {emoji}
      </motion.div>
      <h3 className="font-display mb-2 text-lg font-semibold text-rose-light">{title}</h3>
      <p className="text-sm leading-relaxed text-cream/75">{text}</p>
    </motion.div>
  );
}
