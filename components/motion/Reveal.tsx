"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

/**
 * Fade + slide a block into view. Uses whileInView so it also fires when
 * scrolled to, with a once guard so it doesn't replay.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
