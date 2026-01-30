import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const body1Ref = useRef<HTMLParagraphElement>(null);
  const body2Ref = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const body1 = body1Ref.current;
    const body2 = body2Ref.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const decor = decorRef.current;

    if (!section || !headline || !body1 || !body2 || !cta || !image || !decor) return;

    const ctx = gsap.context(() => {
      // Split headline into characters
      const chars = headline.textContent?.split('') || [];
      headline.innerHTML = chars.map(char => 
        `<span class="inline-block overflow-hidden"><span class="char inline-block">${char === ' ' ? '&nbsp;' : char}</span></span>`
      ).join('');

      const charElements = headline.querySelectorAll('.char');

      // Initial states
      gsap.set(charElements, { y: '100%', rotate: 15, opacity: 0 });
      gsap.set([body1, body2], { x: -50, opacity: 0 });
      gsap.set(cta, { scale: 0.9, y: 30, opacity: 0 });
      gsap.set(image, { clipPath: 'circle(0% at 50% 50%)', x: 50 });
      gsap.set(decor.querySelectorAll('path'), { strokeDashoffset: 200 });

      // Scroll-triggered entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      });

      // Headline character animation
      tl.to(charElements, {
        y: '0%',
        rotate: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.03,
      }, 0);

      // Image reveal
      tl.to(image, {
        clipPath: 'circle(75% at 50% 50%)',
        x: 0,
        duration: 1.2,
        ease: 'expo.out',
      }, 0.3);

      // Body paragraphs
      tl.to(body1, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
      }, 0.4);

      tl.to(body2, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
      }, 0.6);

      // CTA button
      tl.to(cta, {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, 0.8);

      // Decorative lines
      tl.to(decor.querySelectorAll('path'), {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.2,
      }, 0.5);

      // Parallax on scroll
      gsap.to(headline, {
        y: -40,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      gsap.to(image, {
        y: -60,
        scale: 1.02,
        rotate: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen w-full bg-white py-24 md:py-32 overflow-hidden"
    >
      {/* Decorative SVG */}
      <svg
        ref={decorRef}
        className="absolute top-20 right-10 w-40 h-40 pointer-events-none opacity-20"
        viewBox="0 0 100 100"
      >
        <path
          d="M10 50 Q 50 10, 90 50"
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeDasharray="200"
          strokeDashoffset="200"
        />
        <path
          d="M10 50 Q 50 90, 90 50"
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeDasharray="200"
          strokeDashoffset="200"
        />
      </svg>

      <div className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content Column */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            {/* Headline */}
            <h2
              ref={headlineRef}
              className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black mb-10"
            >
              ABOUT ME
            </h2>

            {/* Body Text */}
            <p
              ref={body1Ref}
              className="text-lg md:text-xl text-black/80 mb-6 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              I'm a passionate web developer with over 5 years of experience creating digital solutions 
              that make an impact. My journey began with a curiosity for how things work on the web, 
              which evolved into a career building robust, scalable applications.
            </p>

            <p
              ref={body2Ref}
              className="text-lg md:text-xl text-black/80 mb-10 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              I specialize in modern JavaScript frameworks, clean architecture, and performance optimization. 
              Every project I undertake is an opportunity to push boundaries and deliver exceptional user experiences.
            </p>

            {/* CTA Button */}
            <a
              ref={ctaRef}
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                const skillsSection = document.getElementById('skills');
                if (skillsSection) {
                  gsap.to(window, {
                    duration: 1.2,
                    scrollTo: { y: skillsSection, offsetY: 0 },
                    ease: 'power3.inOut',
                  });
                }
              }}
              className="inline-block btn-primary"
              data-cursor-hover
            >
              <span>Learn More About My Journey</span>
            </a>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div
              ref={imageRef}
              className="relative aspect-[7/9] max-w-md mx-auto lg:max-w-none lg:-mr-10"
            >
              <img
                src="/hero-secondary.jpg"
                alt="About"
                className="w-full h-full object-cover"
              />
              
              {/* Corner Decorations */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-black" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-black" />
            </div>

            {/* Floating Quote Marks */}
            <div className="absolute -top-10 left-0 text-[200px] leading-none text-black/5 font-serif select-none pointer-events-none">
              "
            </div>
          </div>
        </div>
      </div>

      {/* Background Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/[0.02] to-transparent pointer-events-none" />
    </section>
  );
};

export default About;
