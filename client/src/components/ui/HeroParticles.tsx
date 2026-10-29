import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 60;
    const AMOUNTX = 60;
    const AMOUNTY = 40;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 500, 950);
    camera.lookAt(0, -80, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        );
        // Crimson tinted particles (THREE expects normalized 0-1 color components)
        colors.push(220 / 255, 20 / 255, 60 / 255);
      }
    }

    const geometry = new THREE.BufferGeometry();
    const pos = new THREE.Float32BufferAttribute(positions, 3);
    geometry.setAttribute('position', pos);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const arr = pos.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          arr[i * 3 + 1] =
            Math.sin((ix + count) * 0.15) * 35 +
            Math.sin((iy + count) * 0.25) * 35;
          i++;
        }
      }
      pos.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.05;
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

export default HeroParticles;
