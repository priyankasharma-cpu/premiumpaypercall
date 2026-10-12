import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIcon, CallSignal } from './AnimatedIcon';
export function Button({ to = '/contact', children, secondary = false, light = false, className = '', call = !secondary && to.startsWith('/contact') }) { return <Link className={`button ${call ? 'call-button' : ''} ${secondary ? 'secondary' : ''} ${light ? 'light' : ''} ${className}`} to={to}>{call && <CallSignal/>}<span className="button-label">{children}</span><AnimatedIcon icon={ArrowUpRight} size={18}/></Link>; }
export function CallCTA(props) { return <Button {...props} call/>; }
export function Reveal({ children, className = '', delay = 0 }) { const reduced = useReducedMotion(); return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>; }
export function Heading({ eyebrow, title, children, center = false }) { return <div className={`section-heading ${center ? 'center' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>; }
export function TextLink({ to, children }) { return <Link className="text-link" to={to}>{children}<AnimatedIcon icon={ArrowRight} size={18}/></Link>; }
