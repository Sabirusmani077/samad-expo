"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeHeroCanvasProps {
  variant?: "hero" | "ambient" | "dark";
  className?: string;
}

export function ThreeHeroCanvas({
  variant = "hero",
  className = "absolute inset-0 w-full h-full z-0",
}: ThreeHeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, variant === "hero" ? 8.5 : 10);

    // Luxury Maison Studio Lighting (Champagne Gold Key + Ivory Rim + Warm Crimson Fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf6e6c2, 2.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-6, -3, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xc10016, 2.8, 24);
    rimLight.position.set(2, 2, 4);
    scene.add(rimLight);

    const group = new THREE.Group();
    scene.add(group);

    // Materials: Cartier Champagne Gold, Lacquered Crimson & Obsidian Onyx
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xc8a464),
      emissive: new THREE.Color(0x3a2a0a),
      emissiveIntensity: 0.14,
      metalness: 0.72,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });

    const amberMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x9e0014),
      emissive: new THREE.Color(0x3a0007),
      emissiveIntensity: 0.18,
      metalness: 0.52,
      roughness: 0.18,
      clearcoat: 1.0,
    });

    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x181518),
      metalness: 0.75,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc8a464,
      wireframe: true,
      transparent: true,
      opacity: variant === "hero" ? 0.36 : 0.24,
    });

    const meshes: Array<{
      mesh: THREE.Object3D;
      basePos: THREE.Vector3;
      speed: number;
      amp: number;
      rotSpeed: { x: number; y: number; z: number };
    }> = [];

    if (variant === "hero") {
      // Sculptural Centerpiece Torus Knot offset gracefully toward center-right
      const knotGeo = new THREE.TorusKnotGeometry(1.55, 0.42, 160, 28);
      const knot = new THREE.Mesh(knotGeo, goldMat);
      knot.position.set(0.6, 0.2, -1.2);
      group.add(knot);
      meshes.push({
        mesh: knot,
        basePos: knot.position.clone(),
        speed: 0.7,
        amp: 0.25,
        rotSpeed: { x: 0.0022, y: 0.0038, z: 0.0012 },
      });

      // Architectural Outer Wireframe Ring
      const torusGeo = new THREE.TorusGeometry(2.65, 0.035, 16, 100);
      const ring = new THREE.Mesh(torusGeo, wireMat);
      ring.position.set(0.6, 0.2, -1.2);
      ring.rotation.x = Math.PI / 3.2;
      group.add(ring);
      meshes.push({
        mesh: ring,
        basePos: ring.position.clone(),
        speed: 0.5,
        amp: 0.15,
        rotSpeed: { x: -0.0015, y: 0.0025, z: 0.003 },
      });
    }

    // Floating Luxury 3D Geometric Gems & Cubes
    const gemConfigs =
      variant === "hero"
        ? [
            { pos: [-3.9, 2.0, -0.5], scale: 0.62, type: "octa", mat: goldMat },
            { pos: [-2.6, -2.2, 0.2], scale: 0.48, type: "ico", mat: pearlMat },
            { pos: [3.8, -1.8, -0.4], scale: 0.58, type: "box", mat: amberMat },
            { pos: [3.6, 2.3, -1.4], scale: 0.72, type: "wire", mat: wireMat },
            { pos: [-0.8, 2.7, -1.8], scale: 0.42, type: "box", mat: pearlMat },
          ]
        : [
            { pos: [-4.2, 1.5, -1.5], scale: 0.65, type: "octa", mat: goldMat },
            { pos: [4.0, -1.2, -1.8], scale: 0.75, type: "wire", mat: wireMat },
            { pos: [2.8, 1.8, -2.2], scale: 0.45, type: "ico", mat: amberMat },
            { pos: [-2.8, -1.7, -1.2], scale: 0.4, type: "box", mat: pearlMat },
          ];

    gemConfigs.forEach((cfg, idx) => {
      let geo: THREE.BufferGeometry;
      if (cfg.type === "octa") geo = new THREE.OctahedronGeometry(cfg.scale, 0);
      else if (cfg.type === "ico")
        geo = new THREE.IcosahedronGeometry(cfg.scale, 0);
      else if (cfg.type === "wire")
        geo = new THREE.IcosahedronGeometry(cfg.scale, 1);
      else geo = new THREE.BoxGeometry(cfg.scale, cfg.scale, cfg.scale);

      const mesh = new THREE.Mesh(geo, cfg.mat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      group.add(mesh);
      meshes.push({
        mesh,
        basePos: mesh.position.clone(),
        speed: 0.8 + idx * 0.15,
        amp: 0.22 + (idx % 2) * 0.1,
        rotSpeed: {
          x: 0.004 * (idx % 2 === 0 ? 1 : -1),
          y: 0.0055,
          z: 0.002,
        },
      });
    });

    // Subtle Floating 3D Gold Dust Particle Field
    const particleCount = variant === "hero" ? 85 : 40;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xe5c78e,
      size: 0.075,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Mouse Interactive Tilt Tracking
    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();

      if (!reduceMotion) {
        meshes.forEach((item) => {
          item.mesh.rotation.x += item.rotSpeed.x;
          item.mesh.rotation.y += item.rotSpeed.y;
          item.mesh.rotation.z += item.rotSpeed.z;
          item.mesh.position.y =
            item.basePos.y + Math.sin(elapsed * item.speed) * item.amp;
        });

        particles.rotation.y = elapsed * 0.03;
        particles.rotation.x = Math.sin(elapsed * 0.15) * 0.05;

        // Smooth camera & group mouse parallax
        group.rotation.y += (pointer.x * 0.35 - group.rotation.y) * 0.04;
        group.rotation.x += (-pointer.y * 0.25 - group.rotation.x) * 0.04;
      }

      renderer?.render(scene, camera);
      if (!reduceMotion) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer?.dispose();
      if (renderer?.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    />
  );
}
