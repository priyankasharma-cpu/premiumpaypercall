import { motion, useReducedMotion } from 'framer-motion';
const line = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: .5, ease: [.22, 1, .36, 1] } } };
export default function HeroHeadline() {
  const reduced = useReducedMotion();
  return <motion.h1 initial={reduced ? false : 'hidden'} animate="visible" variants={{ visible: { transition: { staggerChildren: reduced ? 0 : .09 } } }}><motion.span className="hero-line" variants={line}>High-Intent </motion.span><motion.span className="hero-line accent" variants={line}>Inbound Calls. </motion.span><motion.span className="hero-line" variants={line}>Meaningful Business </motion.span><motion.span className="hero-line" variants={line}>Connections.</motion.span></motion.h1>;
}
