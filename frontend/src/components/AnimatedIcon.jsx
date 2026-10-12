import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { PhoneIncoming, PhoneCall, ArrowRight, ArrowUpRight, ArrowDownLeft, Shield, ShieldCheck, House, Headset, FileText, Check, CheckCircle2, Search, Network, MessagesSquare, Target, Layers, Users, TrendingUp } from 'lucide-react';
const variants = new Map([[PhoneIncoming, 'phone'], [PhoneCall, 'phone'], [ArrowRight, 'arrow'], [ArrowUpRight, 'diagonal'], [ArrowDownLeft, 'diagonal'], [Shield, 'shield'], [ShieldCheck, 'shield'], [House, 'home'], [Headset, 'headset'], [FileText, 'document'], [Check, 'check'], [CheckCircle2, 'check'], [Search, 'search'], [Network, 'network'], [MessagesSquare, 'conversation'], [Target, 'target'], [Layers, 'layers'], [Users, 'people'], [TrendingUp, 'trend']]);
// Decorative icons animate only while visible; adjacent text provides their accessible label.
export function AnimatedIcon({ icon: Icon, size = 24, variant, className = '', ...props }) {
  const ref = useRef(null);
  const visible = useInView(ref, { margin: '0px 0px -20px 0px' });
  return <span ref={ref} className={`animated-icon icon-${variant || variants.get(Icon) || 'accent'} ${visible ? 'is-visible' : ''} ${className}`} aria-hidden="true"><Icon size={size} {...props}/></span>;
}
export function CallSignal({ size = 20 }) { return <span className="call-signal" aria-hidden="true"><span className="signal-wave"/><span className="signal-wave second"/><AnimatedIcon icon={PhoneIncoming} size={size}/></span>; }
