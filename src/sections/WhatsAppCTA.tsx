import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WhatsAppCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const icon = iconRef.current;
    const headline = headlineRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;

    if (!section || !icon || !headline || !description || !cta) return;

    const ctx = gsap.context(() => {
      // Split headline into words
      const words = headline.textContent?.split(' ') || [];
      headline.innerHTML = words.map(word => 
        `<span class="inline-block overflow-hidden mr-3"><span class="word inline-block">${word}</span></span>`
      ).join('');

      const wordElements = headline.querySelectorAll('.word');

      // Initial states
      gsap.set(icon, { scale: 0, rotate: -180 });
      gsap.set(wordElements, { y: 40, opacity: 0 });
      gsap.set(description, { y: 20, opacity: 0 });
      gsap.set(cta, { scale: 0.9, opacity: 0 });

      // Scroll-triggered entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Icon bounce in
      tl.to(icon, {
        scale: 1,
        rotate: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      }, 0);

      // Headline words
      tl.to(wordElements, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.08,
      }, 0.3);

      // Description
      tl.to(description, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
      }, 0.6);

      // CTA
      tl.to(cta, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, 0.8);

      // Continuous icon pulse
      gsap.to(icon, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Button glow pulse
      gsap.to(cta, {
        boxShadow: '0 0 30px rgba(37, 211, 102, 0.3)',
        duration: 3,
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
      className="relative w-full bg-[#25D366] py-20 md:py-28 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="section-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* WhatsApp Icon */}
          <div
            ref={iconRef}
            className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full mb-8 shadow-lg"
          >
            <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-[#25D366]" fill="currentColor" />
          </div>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6"
          >
            JOIN MY WHATSAPP CHANNEL
          </h2>

          {/* Description */}
          <p
            ref={descriptionRef}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Get exclusive web development tips, tutorials, and behind-the-scenes content delivered straight to your phone.
          </p>

          {/* CTA Button */}
          <a
            ref={ctaRef}
            href="https://whatsapp.com/channel/mughal.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[#25D366] px-10 py-5 font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
            data-cursor-hover
          >
            <MessageCircle className="w-6 h-6" fill="currentColor" />
            <span>Join Mughal.Dev Channel</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Member Count */}
          <p className="mt-6 text-white/70 text-sm">
            Join 2,500+ developers already on the channel
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/10 rounded-full" />
      <div className="absolute top-1/2 right-20 w-4 h-4 bg-white/30 rounded-full" />
    </section>
  );
};

export default WhatsAppCTA;
