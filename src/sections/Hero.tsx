import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cta = ctaRef.current;
    const mainImage = mainImageRef.current;
    const secondaryImage = secondaryImageRef.current;
    const pattern = patternRef.current;

    if (!section || !headline || !subheadline || !cta || !mainImage || !secondaryImage || !pattern) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(headline.querySelectorAll('.headline-line'), {
        rotateX: -90,
        y: 80,
        opacity: 0,
        transformOrigin: 'center bottom',
      });
      gsap.set(subheadline, { filter: 'blur(20px)', opacity: 0, y: 40 });
      gsap.set(cta, { scale: 0.8, opacity: 0 });
      gsap.set(mainImage, { clipPath: 'inset(0 100% 0 0)', x: 100 });
      gsap.set(secondaryImage, { clipPath: 'inset(100% 0 0 0)', y: 80 });
      gsap.set(pattern.querySelectorAll('line'), { strokeDashoffset: 100 });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });

      // Pattern draw animation
      tl.to(pattern.querySelectorAll('line'), {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'expo.out',
        stagger: 0.02,
      }, 0);

      // Headline animation
      tl.to(headline.querySelectorAll('.headline-line'), {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.15,
      }, 0.3);

      // Main image reveal
      tl.to(mainImage, {
        clipPath: 'inset(0 0% 0 0)',
        x: 0,
        duration: 1.2,
        ease: 'expo.out',
      }, 0.5);

      // Secondary image reveal
      tl.to(secondaryImage, {
        clipPath: 'inset(0% 0 0 0)',
        y: 0,
        duration: 1,
        ease: 'expo.out',
      }, 0.8);

      // Subheadline
      tl.to(subheadline, {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
      }, 0.9);

      // CTA button
      tl.to(cta, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, 1.1);

      // Scroll-triggered animations
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          scrub: 0.5,
          pin: true,
        },
      });

      // Headline dispersal on scroll
      scrollTl.to(headline.querySelectorAll('.headline-line'), {
        letterSpacing: '30px',
        opacity: 0.3,
        stagger: 0.05,
      }, 0.2);

      // Images parallax
      scrollTl.to(mainImage, {
        y: -80,
        scale: 1.05,
      }, 0);

      scrollTl.to(secondaryImage, {
        y: -40,
      }, 0);

      // Content fade out
      scrollTl.to([subheadline, cta], {
        opacity: 0,
        y: -30,
      }, 0.3);

      // Everything scale down
      scrollTl.to([headline, mainImage, secondaryImage], {
        scale: 0.9,
        opacity: 0,
      }, 0.5);

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: projectsSection, offsetY: 0 },
        ease: 'power3.inOut',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen w-full bg-white overflow-hidden perspective-1000"
    >
      {/* Grid Pattern Background */}
      <svg
        ref={patternRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.4 }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="100" strokeDashoffset="100" />
            <line x1="0" y1="0" x2="0" y2="60" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="100" strokeDashoffset="100" />
            <line x1="0" y1="60" x2="60" y2="0" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="100" strokeDashoffset="100" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative z-10 min-h-screen section-padding flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-20">
          {/* Content Column */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Headline */}
            <div ref={headlineRef} className="preserve-3d mb-8">
              <div className="headline-line text-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-black leading-none">
                WEB
              </div>
              <div className="headline-line text-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-black leading-none">
                DEVELOPER
              </div>
              <div className="headline-line text-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-black leading-none">
                PORTFOLIO
              </div>
            </div>

            {/* Subheadline */}
            <p
              ref={subheadlineRef}
              className="text-lg md:text-xl text-black/70 max-w-xl mb-10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Crafting digital experiences that merge cutting-edge technology with bold design vision
            </p>

            {/* CTA Button */}
            <a
              ref={ctaRef}
              href="#projects"
              onClick={(e) => { e.preventDefault(); scrollToProjects(); }}
              className="inline-block btn-primary text-base"
              data-cursor-hover
            >
              <span>Explore My Work</span>
            </a>
          </div>

          {/* Images Column */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              {/* Main Image */}
              <div
                ref={mainImageRef}
                className="absolute top-0 right-0 w-[70%] md:w-[65%] aspect-[4/5] z-20"
              >
                <img
                  src="/hero-main.jpg"
                  alt="Portrait"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Image */}
              <div
                ref={secondaryImageRef}
                className="absolute bottom-0 left-0 w-[55%] md:w-[50%] aspect-[3/4] z-10"
              >
                <img
                  src="/hero-secondary.jpg"
                  alt="Creative"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-black/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-black/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Accent Shapes */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-black animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-40 right-20 w-6 h-6 border-2 border-black/30 rotate-12" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-black/20 rounded-full" />
    </section>
  );
};

export default Hero;
