import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const CustomCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uVelocity;
    varying vec2 vUv;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 5; i++) {
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5);
      vec2 toCenter = uv - center;
      float dist = length(toCenter);
      
      // Create turbulent warp effect
      float noise1 = fbm(toCenter * 3.0 + uTime * 0.5);
      float noise2 = fbm(toCenter * 5.0 - uTime * 0.3);
      float noise3 = fbm(toCenter * 8.0 + uTime * 0.2);
      
      // Mouse influence
      vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
      float mouseDist = length(uv - uMouse);
      float mouseFactor = smoothstep(0.5, 0.0, mouseDist);
      
      // Combine noises for turbulent effect
      float turbulence = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      turbulence += mouseFactor * 0.3;
      
      // Create warp distortion
      float warp = sin(dist * 20.0 - uTime * 2.0 + turbulence * 3.0) * 0.5 + 0.5;
      
      // Ring patterns
      float ring1 = smoothstep(0.15, 0.12, abs(dist - 0.25 + turbulence * 0.05));
      float ring2 = smoothstep(0.08, 0.05, abs(dist - 0.35 + turbulence * 0.03));
      float ring3 = smoothstep(0.05, 0.02, abs(dist - 0.15 + turbulence * 0.08));
      
      // Core glow
      float core = smoothstep(0.08, 0.0, dist);
      
      // Combine all elements
      float finalPattern = ring1 * 0.4 + ring2 * 0.3 + ring3 * 0.5 + core * 0.8;
      finalPattern *= (0.7 + warp * 0.3);
      
      // Add velocity trail effect
      float trail = smoothstep(0.4, 0.0, dist) * uVelocity * 0.5;
      finalPattern += trail;
      
      // Color: black and white with subtle variations
      vec3 color = vec3(finalPattern);
      color *= 0.9 + turbulence * 0.2;
      
      // Edge fade
      float edgeFade = smoothstep(0.5, 0.3, dist);
      
      gl_FragColor = vec4(color, finalPattern * edgeFade * 0.9);
    }
  `;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.targetX = e.clientX;
    mouseRef.current.targetY = e.clientY;
  }, []);

  useEffect(() => {
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const container = containerRef.current;
    if (!container) return;

    // Setup Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(120, 120);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(120, 120) },
        uVelocity: { value: 0 },
      },
      transparent: true,
      blending: THREE.NormalBlending,
    });
    materialRef.current = material;

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    let lastX = 0;
    let lastY = 0;
    
    const animate = () => {
      timeRef.current += 0.016;
      
      // Smooth mouse following
      const smoothFactor = 0.15;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * smoothFactor;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * smoothFactor;
      
      // Calculate velocity
      const velocity = Math.sqrt(
        Math.pow(mouseRef.current.x - lastX, 2) + 
        Math.pow(mouseRef.current.y - lastY, 2)
      );
      lastX = mouseRef.current.x;
      lastY = mouseRef.current.y;
      
      // Update uniforms
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = timeRef.current;
        materialRef.current.uniforms.uMouse.value.set(
          mouseRef.current.x / window.innerWidth,
          1 - mouseRef.current.y / window.innerHeight
        );
        materialRef.current.uniforms.uVelocity.value = Math.min(velocity * 0.1, 1);
      }
      
      // Update cursor position
      container.style.transform = `translate(${mouseRef.current.x - 60}px, ${mouseRef.current.y - 60}px)`;
      
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle hover states
    const handleMouseEnter = () => {
      gsap.to(container, { scale: 1.5, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(container, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [handleMouseMove]);

  // Check for touch device
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return null;

  return (
    <div
      ref={containerRef}
      className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ width: 120, height: 120 }}
    />
  );
};

export default CustomCursor;
