import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Palette, 
  Code2, 
  ShoppingCart, 
  Search, 
  Layout, 
  Wrench 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    icon: Palette,
    title: 'Web Design',
    description: 'Creating visually stunning, user-centered designs that communicate brand stories and drive engagement.',
  },
  {
    icon: Code2,
    title: 'Web Development',
    description: 'Building robust, scalable applications with clean code architecture and modern development practices.',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Solutions',
    description: 'Developing high-converting online stores with seamless checkout experiences and inventory management.',
  },
  {
    icon: Search,
    title: 'SEO Optimization',
    description: 'Implementing strategies that improve visibility, drive organic traffic, and increase search rankings.',
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description: 'Crafting intuitive interfaces and delightful user experiences through research-driven design decisions.',
  },
  {
    icon: Wrench,
    title: 'Website Maintenance',
    description: 'Providing ongoing support, updates, and optimization to keep your digital presence running smoothly.',
  },
];

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !headline || !subheadline || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Split headline into words
      const words = headline.textContent?.split(' ') || [];
      headline.innerHTML = words.map(word => 
        `<span class="inline-block overflow-hidden mr-4"><span class="word inline-block">${word}</span></span>`
      ).join('');

      const wordElements = headline.querySelectorAll('.word');

      // Initial states
      gsap.set(wordElements, { y: 60, opacity: 0 });
      gsap.set(subheadline, { filter: 'blur(10px)', opacity: 0 });
      gsap.set(cards, { rotateY: -90, opacity: 0, transformOrigin: 'left center' });

      // Scroll-triggered entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Headline words
      tl.to(wordElements, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'expo.out',
        stagger: 0.1,
      }, 0);

      // Subheadline
      tl.to(subheadline, {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.5,
        ease: 'smooth',
      }, 0.3);

      // Cards 3D flip
      tl.to(cards, {
        rotateY: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.12,
      }, 0.4);

      // Parallax on scroll
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: -20 - (i % 3) * 10,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
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
      id="skills"
      className="relative min-h-screen w-full bg-white py-24 md:py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-black/[0.02] pointer-events-none" />

      <div className="section-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2
            ref={headlineRef}
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black mb-6"
          >
            MY SKILLS
          </h2>
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 perspective-1000">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.title}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group relative bg-white border border-black/10 p-8 md:p-10 preserve-3d transition-all duration-500 hover:border-black/30 hover:shadow-[-20px_20px_40px_rgba(0,0,0,0.1)]"
                style={{
                  transform: index % 3 === 1 ? 'translateY(40px)' : 'translateY(0)',
                }}
                data-cursor-hover
              >
                {/* Icon */}
                <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-10 h-10 text-black stroke-[1.5]" />
                </div>

                {/* Title */}
                <h3 
                  className="text-xl md:text-2xl font-bold text-black mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {skill.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-black/60 leading-relaxed transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {skill.description}
                </p>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-black/5 border-l-[40px] border-l-transparent transition-all duration-300 group-hover:border-t-black/20" />
              </div>
            );
          })}
        </div>

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10 hidden lg:block">
          <line x1="33%" y1="40%" x2="50%" y2="45%" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="50%" y1="45%" x2="66%" y2="40%" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="33%" y1="70%" x2="50%" y2="75%" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="50%" y1="75%" x2="66%" y2="70%" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>
    </section>
  );
};

export default Skills;
