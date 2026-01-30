import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navigation = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'how-i-work', label: 'How I Work' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Show/hide navigation based on scroll
    ScrollTrigger.create({
      start: 'top -100',
      end: 99999,
      onUpdate: (self) => {
        setIsVisible(self.progress > 0);
      },
    });

    // Track active section
    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(item.id),
          onEnterBack: () => setActiveSection(item.id),
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger && navItems.some(item => item.id === (st.vars.trigger as HTMLElement)?.id)) {
          st.kill();
        }
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: section, offsetY: 0 },
        ease: 'power3.inOut',
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md border-b border-black/10">
        <div className="section-padding py-4 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Mughal.Dev
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  activeSection === item.id ? 'text-black' : 'text-black/50 hover:text-black'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-black" />
                )}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            className="hidden md:block btn-primary text-sm"
          >
            <span>Get In Touch</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
