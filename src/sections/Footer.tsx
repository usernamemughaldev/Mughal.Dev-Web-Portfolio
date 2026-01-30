import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const links1Ref = useRef<HTMLDivElement>(null);
  const links2Ref = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const border = borderRef.current;
    const logo = logoRef.current;
    const links1 = links1Ref.current;
    const links2 = links2Ref.current;
    const socials = socialsRef.current;
    const copyright = copyrightRef.current;

    if (!footer || !border || !logo || !links1 || !links2 || !socials || !copyright) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(border, { width: '0%' });
      gsap.set(logo, { y: 20, opacity: 0 });
      gsap.set(links1?.querySelectorAll('a') || [], { x: -20, opacity: 0 });
      gsap.set(links2?.querySelectorAll('a') || [], { x: -20, opacity: 0 });
      gsap.set(socials?.querySelectorAll('a') || [], { scale: 0, opacity: 0 });
      gsap.set(copyright, { opacity: 0 });

      // Scroll-triggered entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });

      // Border line
      tl.to(border, {
        width: '100%',
        duration: 0.8,
        ease: 'expo.out',
      }, 0);

      // Logo
      tl.to(logo, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
      }, 0.2);

      // Links column 1
      tl.to(links1?.querySelectorAll('a') || [], {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'expo.out',
        stagger: 0.08,
      }, 0.5);

      // Links column 2
      tl.to(links2?.querySelectorAll('a') || [], {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'expo.out',
        stagger: 0.08,
      }, 0.7);

      // Social icons
      tl.to(socials?.querySelectorAll('a') || [], {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.7)',
        stagger: 0.1,
      }, 0.9);

      // Copyright
      tl.to(copyright, {
        opacity: 1,
        duration: 0.4,
        ease: 'smooth',
      }, 1);

    }, footer);

    return () => ctx.revert();
  }, []);

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const connectLinks = [
    { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/mughal.dev' },
    { label: 'Email', href: 'mailto:hello@mughal.dev' },
    { label: 'LinkedIn', href: '#' },
    { label: 'GitHub', href: '#' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const section = document.getElementById(href.slice(1));
      if (section) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: section, offsetY: 0 },
          ease: 'power3.inOut',
        });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-white pt-20 pb-8"
    >
      {/* Top Border */}
      <div
        ref={borderRef}
        className="absolute top-0 left-0 h-px bg-black/10"
        style={{ width: '0%' }}
      />

      <div className="section-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* Brand Column */}
          <div ref={logoRef}>
            <a 
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className="text-2xl font-bold text-black mb-4 inline-block"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Mughal.Dev
            </a>
            <p className="text-black/60 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Crafting digital excellence through innovative web development and design solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div ref={links1Ref}>
            <h4 
              className="text-sm font-bold tracking-widest text-black mb-6 uppercase"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-black/60 hover:text-black transition-colors duration-300 relative group"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    data-cursor-hover
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div ref={links2Ref}>
            <h4 
              className="text-sm font-bold tracking-widest text-black mb-6 uppercase"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Connect
            </h4>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-black/60 hover:text-black transition-colors duration-300 relative group"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    data-cursor-hover
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div ref={copyrightRef}>
            <p className="text-black/50 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              © 2024 Mughal.Dev. All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div ref={socialsRef} className="flex items-center gap-4">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 border border-black/20 flex items-center justify-center text-black/60 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              data-cursor-hover
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 border border-black/20 flex items-center justify-center text-black/60 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              data-cursor-hover
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 border border-black/20 flex items-center justify-center text-black/60 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              data-cursor-hover
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
