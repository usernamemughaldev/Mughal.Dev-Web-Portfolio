import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, ArrowRight, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement>(null);
  const secondaryCtaRef = useRef<HTMLAnchorElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const primaryCta = primaryCtaRef.current;
    const secondaryCta = secondaryCtaRef.current;
    const decor = decorRef.current;

    if (!section || !headline || !subheadline || !primaryCta || !secondaryCta || !decor) return;

    const ctx = gsap.context(() => {
      // Split headline into words
      const words = headline.textContent?.split(' ') || [];
      headline.innerHTML = words.map(word => 
        `<span class="inline-block overflow-hidden"><span class="word inline-block">${word}</span></span>`
      ).join('');

      const wordElements = headline.querySelectorAll('.word');

      // Initial states
      gsap.set(wordElements, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(subheadline, { y: 30, opacity: 0 });
      gsap.set(primaryCta, { scale: 0.9, opacity: 0 });
      gsap.set(secondaryCta, { scale: 0.9, opacity: 0 });
      gsap.set(decor.children, { opacity: 0, scale: 0.8 });

      // Scroll-triggered entrance with pinned reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

      // Headline words reveal
      tl.to(wordElements, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.1,
      }, 0);

      // Subheadline
      tl.to(subheadline, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
      }, 0.4);

      // Primary CTA
      tl.to(primaryCta, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, 0.5);

      // Secondary CTA
      tl.to(secondaryCta, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, 0.6);

      // Decorative elements
      tl.to(decor.children, {
        opacity: 0.1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.1,
      }, 0.7);

      // Continuous button pulse
      gsap.to(primaryCta, {
        boxShadow: '0 0 40px rgba(0,0,0,0.2)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen w-full bg-white py-24 md:py-32 overflow-hidden flex items-center"
    >
      {/* Decorative Floating Shapes */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 border border-black/20 rotate-45" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-black/5" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-black/10 rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-2 border-black/5 rotate-12" />
      </div>

      <div className="section-padding relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2
            ref={headlineRef}
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black mb-8"
          >
            LET'S WORK TOGETHER
          </h2>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-black/60 mb-12 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Have a project in mind? Let's create something amazing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <a
              ref={primaryCtaRef}
              href="mailto:hello@mughal.dev"
              className="inline-flex items-center gap-3 btn-primary text-lg px-10 py-5"
              data-cursor-hover
            >
              <Mail className="w-5 h-5" />
              <span>Get In Touch</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              ref={secondaryCtaRef}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-black text-black font-medium transition-all duration-300 hover:bg-black hover:text-white"
              data-cursor-hover
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule a Call</span>
            </a>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-black/60 text-sm">hello@mughal.dev</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="text-black/60 text-sm">+1 (555) 123-4567</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-black/60 text-sm">San Francisco, CA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Transition */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/[0.03] to-transparent pointer-events-none" />
    </section>
  );
};

export default Contact;
