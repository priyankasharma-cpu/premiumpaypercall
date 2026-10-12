import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PhoneIncoming, Menu, X, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Button, CallCTA } from './UI';
import { AnimatedIcon } from './AnimatedIcon';
import { officialSocialProfiles } from '../data/brand';

export function Logo({ white = false }) {
  return <Link to="/" className={`logo ${white ? 'logo-white' : ''}`} aria-label="Premium Pay Per Call home"><picture><source media="(max-width: 700px)" srcSet={white ? '/brand/logo-white.svg' : '/brand/logo-compact.svg'}/><img src={white ? '/brand/logo-white.svg' : '/brand/logo.svg'} width="254" height="58" alt="Premium Pay Per Call"/></picture></Link>;
}
const links = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About Us' }, { to: '/verticals', label: 'Our Verticals' }, { to: '/#how-it-works', label: 'How It Works' }, { to: '/contact', label: 'Contact Us' }];
function NavigationLinks({ close }) {
  const { pathname, hash } = useLocation();
  return links.map(({ to, label }) => to.includes('#')
    ? <Link key={to} to={to} onClick={close} className={pathname === '/' && hash === '#how-it-works' ? 'active' : ''}>{label}</Link>
    : <NavLink key={to} end={to === '/'} to={to} onClick={close}>{label}</NavLink>);
}
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const location = useLocation();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 20); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => {
    if (!open) return;
    const resize = () => { if (window.innerWidth > 1180) setOpen(false); };
    const keydown = e => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
      if (e.key !== 'Tab') return;
      const items = [toggleRef.current, ...(menuRef.current?.querySelectorAll('a') || [])];
      const index = items.indexOf(document.activeElement);
      if (e.shiftKey && index <= 0) { e.preventDefault(); items.at(-1)?.focus(); }
      else if (!e.shiftKey && index === items.length - 1) { e.preventDefault(); items[0]?.focus(); }
    };
    window.addEventListener('resize', resize); document.addEventListener('keydown', keydown);
    return () => { window.removeEventListener('resize', resize); document.removeEventListener('keydown', keydown); };
  }, [open]);
  return <header className={`header ${scrolled ? 'is-scrolled' : ''}`}><div className="container header-inner"><Logo/><nav className="navigation desktop-navigation" aria-label="Main navigation"><NavigationLinks/></nav><CallCTA className="header-partner">Partner With Us</CallCTA><button ref={toggleRef} id="menu-toggle" className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(v => !v)}>{open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button></div><AnimatePresence>{open && <motion.nav ref={menuRef} id="main-navigation" className="mobile-navigation" aria-label="Mobile navigation" initial={reduced ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : .2 }}><div className="mobile-nav-links"><NavigationLinks close={() => setOpen(false)}/></div><CallCTA className="mobile-partner">Partner With Us</CallCTA></motion.nav>}</AnimatePresence></header>;
}
function SocialLinks() {
  const icons = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram };
  const profiles = Object.entries(officialSocialProfiles).filter(([, url]) => { try { return new URL(url).protocol === 'https:'; } catch { return false; } });
  if (!profiles.length) return null;
  return <div className="social-links" aria-label="Official social profiles">{profiles.map(([platform, url]) => {
    const Icon = icons[platform];
    return <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Premium Pay Per Call on ${platform === 'x' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)}`}>{Icon ? <Icon size={19} aria-hidden="true"/> : <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-7.5L5.2 22H2l8.3-9.5L1 2h6.5l4.4 6.9zM17.8 20h1.7L6.6 4H4.8z"/></svg>}</a>;
  })}</div>;
}
export function Footer() {
  return <footer><div className="container footer-main"><div className="footer-brand"><Logo white/><p>Premium Pay Per Call focuses on consumer-initiated inbound call opportunities across Home Improvement, SSDI, and Home Security.</p><SocialLinks/><span className="footer-focus"><span className="live-dot"/> Built for business conversations</span></div><div className="footer-links"><h3>Quick Links</h3><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/verticals">Our Verticals</Link><Link to="/#how-it-works">How It Works</Link><Link to="/contact">Contact Us</Link></div><div className="footer-links"><h3>Our Verticals</h3><Link to="/verticals#home-improvement">Home Improvement</Link><Link to="/verticals#ssdi">SSDI</Link><Link to="/verticals#home-security">Home Security</Link></div><div className="footer-connect"><span className="eyebrow">PARTNER WITH US</span><h3>Let's make a connection.</h3><p>Explore a partnership built around your call buying needs.</p><CallCTA>Let's Talk Inbound Calls</CallCTA></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Premium Pay Per Call. All rights reserved.</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms-and-conditions">Terms & Conditions</Link></div></div></footer>;
}
export function PartnerCTA() { return <section className="partner-section"><div className="container partner-inner"><div><span className="eyebrow">LET'S CONNECT</span><h2>Looking for high-intent<br/>inbound call opportunities?</h2><p>Connect with Premium Pay Per Call to discuss your vertical interests, call buying requirements, and potential partnership opportunities.</p><div className="button-row"><CallCTA>Become an Advertiser</CallCTA><Button secondary light>Contact Our Team</Button></div></div><div className="cta-phone" aria-hidden="true"><AnimatedIcon icon={PhoneIncoming} size={90}/><span className="cta-orbit-dot"/><i/></div></div></section>; }
