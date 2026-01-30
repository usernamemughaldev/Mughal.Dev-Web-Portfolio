import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Lightbulb, PenTool, Code, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Every great project starts with understanding. I dive deep into your goals, audience, and requirements to build a solid foundation.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'With insights in hand, I craft a strategic roadmap that outlines the approach, timeline, and milestones for success.',
    icon: Lightbulb,
  },
  {
    number: '03',
    title: 'Design',
    description: 'Visual concepts come to life through iterative design, ensuring every pixel serves a purpose and delights users.',
    icon: PenTool,
  },
  {
    number: '04',
    title: 'Development',
    description: 'Clean, efficient code brings designs to reality. I build with scalability, performance, and maintainability in mind.',
    icon: Code,
  },
  {
    number: '05',
    title: 'Launch',
    description: 'After thorough testing and refinement, your project goes live with ongoing support to ensure continued success.',
    icon: Rocket,
  },
];

const HowIWork = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const line = lineRef.current;
    const stepElements = stepsRef.current.filter(Boolean);

    if (!section || !headline || !subheadline || !line || stepElements.length === 0) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(headline, { y: 80, opacity: 0 });
      gsap.set(subheadline, { y: 40, opacity: 0 });
      gsap.set(line, { strokeDashoffset: 2000 });

      stepElements.forEach((step) => {
        if (!step) return;
        const number = step.querySelector('.step-number');
        const content = step.querySelector('.step-content');
        gsap.set(number, { rotateX: -90, opacity: 0, transformOrigin: 'center bottom' });
        gsap.set(content, { x: step.classList.contains('even') ? 50 : -50, opacity: 0 });
      });

      // Scroll-triggered entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Headline
      tl.to(headline, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
      }, 0);

      // Subheadline
      tl.to(subheadline, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
      }, 0.2);

      // Connecting line
      tl.to(line, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.out',
      }, 0.3);

      // Steps
      stepElements.forEach((step, i) => {
        if (!step) return;
        const number = step.querySelector('.step-number');
        const content = step.querySelector('.step-content');

        tl.to(number, {
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
        }, 0.5 + i * 0.2);

        tl.to(content, {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
        }, 0.7 + i * 0.2);
      });

      // Individual step scroll animations
      stepElements.forEach((step) => {
        if (!step) return;
        const number = step.querySelector('.step-number');
        
        gsap.to(number, {
          scale: 1.1,
          scrollTrigger: {
            trigger: step,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-i-work"
      className="relative min-h-screen w-full bg-white py-24 md:py-32 overflow-hidden"
    >
      <div className="section-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-20 md:mb-32">
          <h2
            ref={headlineRef}
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black mb-6"
          >
            HOW I WORK
          </h2>
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            My proven process for delivering exceptional results
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line SVG */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-4 hidden md:block"
            viewBox="0 0 4 1000"
            preserveAspectRatio="none"
          >
            <path
              ref={lineRef}
              d="M2 0 L2 1000"
              fill="none"
              stroke="black"
              strokeWidth="1"
              strokeDasharray="2000"
              strokeDashoffset="2000"
              opacity="0.2"
            />
            {/* Animated dash pattern */}
            <path
              d="M2 0 L2 1000"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeDasharray="10,20"
              opacity="0.1"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="30"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={step.number}
                  ref={(el) => { stepsRef.current[index] = el; }}
                  className={`step-item relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${isEven ? 'even' : ''}`}
                >
                  {/* Number Column */}
                  <div className={`flex items-center gap-6 ${isEven ? 'md:order-2 md:flex-row-reverse' : ''}`}>
                    <div className="step-number relative">
                      <span className="text-display text-6xl md:text-8xl lg:text-9xl text-black/10 select-none">
                        {step.number}
                      </span>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-black flex items-center justify-center">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`step-content ${isEven ? 'md:order-1 md:text-right' : ''}`}>
                    <h3 
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    <p 
                      className="text-lg text-black/60 leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default HowIWork;
