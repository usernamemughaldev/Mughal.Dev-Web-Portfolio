import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    category: 'WEB DEVELOPMENT',
    title: 'Modern E-Commerce Platform',
    description: 'A full-featured online shopping experience with real-time inventory, seamless checkout, and personalized recommendations.',
    image: '/project-1.jpg',
  },
  {
    category: 'WEB DESIGN',
    title: 'Creative Portfolio Website',
    description: 'A stunning portfolio showcasing creative work with smooth animations and immersive interactions.',
    image: '/project-2.jpg',
  },
  {
    category: 'WEB DEVELOPMENT',
    title: 'Corporate Business Website',
    description: 'A professional business presence with clean design, clear messaging, and conversion-focused layouts.',
    image: '/project-3.jpg',
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const headline = headlineRef.current;
    const progress = progressRef.current;

    if (!section || !container || !wrapper || !headline || !progress) return;

    const ctx = gsap.context(() => {
      // Split headline into characters
      const chars = headline.textContent?.split('') || [];
      headline.innerHTML = chars.map(char => 
        `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      const charElements = headline.querySelectorAll('span');

      // Headline entrance
      gsap.from(charElements, {
        y: '100%',
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.03,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Horizontal scroll
      const slides = wrapper.querySelectorAll('.project-slide');
      const totalWidth = wrapper.scrollWidth - window.innerWidth;

      const horizontalScroll = gsap.to(wrapper, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update progress bar
            gsap.to(progress, {
              width: `${self.progress * 100}%`,
              duration: 0.1,
            });
          },
        },
      });

      // Individual slide animations
      slides.forEach((slide) => {
        const content = slide.querySelector('.slide-content');
        const image = slide.querySelector('.slide-image');
        const category = slide.querySelector('.slide-category');
        const title = slide.querySelector('.slide-title');
        const desc = slide.querySelector('.slide-desc');
        const cta = slide.querySelector('.slide-cta');

        // Create timeline for each slide
        const slideTl = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            containerAnimation: horizontalScroll,
            start: 'left 80%',
            end: 'left 20%',
            scrub: 0.5,
          },
        });

        slideTl.from(content, {
          x: -100,
          opacity: 0,
        }, 0);

        slideTl.from(image, {
          scale: 1.1,
          clipPath: 'inset(0 100% 0 0)',
        }, 0);

        slideTl.from(category, {
          y: 20,
          opacity: 0,
        }, 0.2);

        slideTl.from(title, {
          y: 40,
          opacity: 0,
        }, 0.3);

        slideTl.from(desc, {
          x: -30,
          opacity: 0,
        }, 0.4);

        slideTl.from(cta, {
          scale: 0.8,
          opacity: 0,
        }, 0.5);
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-white overflow-hidden"
    >
      {/* Section Header */}
      <div className="section-padding py-16 md:py-24">
        <h2
          ref={headlineRef}
          className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black overflow-hidden"
        >
          FEATURED PROJECTS
        </h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="relative h-screen">
        <div
          ref={wrapperRef}
          className="flex h-full"
          style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="project-slide w-screen h-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-2"
            >
              {/* Content Side */}
              <div className="slide-content flex flex-col justify-center section-padding py-12 lg:py-0 order-2 lg:order-1">
                <span className="slide-category text-sm font-medium tracking-widest text-black/50 mb-4">
                  {project.category}
                </span>
                <h3 className="slide-title text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black mb-6">
                  {project.title}
                </h3>
                <p className="slide-desc text-lg text-black/70 mb-8 max-w-md leading-relaxed">
                  {project.description}
                </p>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="slide-cta inline-flex items-center gap-3 btn-primary w-fit"
                  data-cursor-hover
                >
                  <span>View Project</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Image Side */}
              <div className="slide-image relative h-full overflow-hidden order-1 lg:order-2">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {/* Project Number Overlay */}
                <div className="absolute bottom-8 right-8 text-display text-8xl md:text-9xl text-white/20">
                  0{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-1 bg-black/10 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-black"
            style={{ width: '0%' }}
          />
        </div>

        {/* Project Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {projects.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-black/20"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
