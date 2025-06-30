"use client";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import { MutableRefObject } from 'react';

interface AnimatedViewProps {
  onBack: () => void;
  initialTexts?: string[];
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#362478" emissive="#362478" emissiveIntensity={0.6} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#362478" emissive="#362478" emissiveIntensity={0.5} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#2d1d63" emissive="#2d1d63" emissiveIntensity={0.6} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#2d1d63" emissive="#2d1d63" emissiveIntensity={0.55} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Right wall */}
      <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#2d1d63" emissive="#2d1d63" emissiveIntensity={0.55} roughness={0.7} metalness={0.3} />
      </mesh>
      
      {/* Corner lighting */}
      <pointLight position={[-4.5, -2, -4.5]} intensity={0.4} color="#8b5cf6" distance={6} decay={2} />
      <pointLight position={[4.5, -2, -4.5]} intensity={0.4} color="#8b5cf6" distance={6} decay={2} />
      <pointLight position={[-4.5, 2, -4.5]} intensity={0.4} color="#8b5cf6" distance={6} decay={2} />
      <pointLight position={[4.5, 2, -4.5]} intensity={0.4} color="#8b5cf6" distance={6} decay={2} />
      
      {/* Edge glow */}
      <mesh position={[-5, 0, -5]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.1, 5, 0.1]} />
        <meshBasicMaterial color="#8b5cf6" opacity={0.3} transparent />
      </mesh>
      <mesh position={[5, 0, -5]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[0.1, 5, 0.1]} />
        <meshBasicMaterial color="#8b5cf6" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

// Particle system for the walls
function WallParticles({ count = 1000 }) {
  // Generate initial positions and wall info for each particle
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const wall = Math.floor(Math.random() * 4); // Only 0,1,2,3 (no floor)
      let pos = [0, 0, 0];
      let speed = 0.1 + Math.random() * 0.15; // Even gentler movement
      
      // Varied sizes for different star brightnesses
      const sizeVariation = Math.random();
      let scale;
      if (sizeVariation > 0.95) { // 5% very bright stars
        scale = [0.03, 0.03, 0.01];
      } else if (sizeVariation > 0.8) { // 15% medium stars
        scale = [0.02, 0.02, 0.01];
      } else { // 80% small stars
        scale = [0.01, 0.01, 0.01];
      }
      
      // Direction will be constrained to the wall's surface
      let direction = [0, 0, 0];
      
      if (wall === 0) {
        // Back wall (z = -5)
        pos = [Math.random() * 10 - 5, Math.random() * 5 - 2.5, -5 + 0.01];
        direction = [
          (Math.random() - 0.5) * 0.3,
          -0.7 + (Math.random() - 0.5) * 0.3,
          0
        ];
      } else if (wall === 1) {
        // Left wall (x = -5)
        pos = [-5 + 0.01, Math.random() * 5 - 2.5, Math.random() * 10 - 5];
        direction = [
          0,
          -0.7 + (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        ];
      } else if (wall === 2) {
        // Right wall (x = 5)
        pos = [5 - 0.01, Math.random() * 5 - 2.5, Math.random() * 10 - 5];
        direction = [
          0,
          -0.7 + (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        ];
      } else if (wall === 3) {
        // Ceiling (y = 2.5)
        pos = [Math.random() * 10 - 5, 2.5 - 0.01, Math.random() * 10 - 5];
        direction = [
          (Math.random() - 0.5) * 0.3,
          0,
          (Math.random() - 0.5) * 0.3
        ];
      }
      
      // Normalize direction vector
      const length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
      direction = direction.map(d => d / length);
      
      // Star colors with slight variations, now based on wall color
      let baseColor: THREE.Color;
      if (wall === 0) {
        // Back wall
        baseColor = new THREE.Color("#2d1d63");
      } else if (wall === 1 || wall === 2) {
        // Left or Right wall
        baseColor = new THREE.Color("#2d1d63");
      } else if (wall === 3) {
        // Ceiling
        baseColor = new THREE.Color("#362478");
      } else {
        // Fallback (should not happen)
        baseColor = new THREE.Color("#2d1d63");
      }
      // Add a little random HSL variation for natural look (make it even smaller)
      baseColor.offsetHSL((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
      
      // Add twinkle speed variation
      const twinkleSpeed = 0.5 + Math.random() * 2;
      
      arr.push({ pos, color: baseColor, wall, speed, direction, scale, twinkleSpeed });
    }
    return arr;
  }, [count]);

  // Store current positions in a ref so they can be updated every frame
  const positionsRef = useRef(particles.map(p => [...p.pos]));

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (!geometryRef.current) return;
    const colors = new Float32Array(particles.flatMap(p => p.color.toArray()));
    geometryRef.current.setAttribute("color", new THREE.InstancedBufferAttribute(colors, 3));
  }, [particles]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      let { wall, speed, direction, scale, twinkleSpeed } = particles[i];
      let pos = positionsRef.current[i];

      // Move particle along the wall surface
      pos[0] += direction[0] * speed * delta;
      pos[1] += direction[1] * speed * delta;
      pos[2] += direction[2] * speed * delta;

      // Keep particles on their walls by resetting when they reach boundaries
      if (wall === 0) { // Back wall
        if (pos[0] < -5 || pos[0] > 5 || pos[1] < -2.5 || pos[1] > 2.5) {
          pos[0] = Math.random() * 10 - 5;
          pos[1] = Math.random() * 5 - 2.5;
          pos[2] = -5 + 0.01;
        }
      } else if (wall === 1) { // Left wall
        if (pos[1] < -2.5 || pos[1] > 2.5 || pos[2] < -5 || pos[2] > 5) {
          pos[0] = -5 + 0.01;
          pos[1] = Math.random() * 5 - 2.5;
          pos[2] = Math.random() * 10 - 5;
        }
      } else if (wall === 2) { // Right wall
        if (pos[1] < -2.5 || pos[1] > 2.5 || pos[2] < -5 || pos[2] > 5) {
          pos[0] = 5 - 0.01;
          pos[1] = Math.random() * 5 - 2.5;
          pos[2] = Math.random() * 10 - 5;
        }
      } else if (wall === 3) { // Ceiling
        if (pos[0] < -5 || pos[0] > 5 || pos[2] < -5 || pos[2] > 5) {
          pos[0] = Math.random() * 10 - 5;
          pos[1] = 2.5 - 0.01;
          pos[2] = Math.random() * 10 - 5;
        }
      }

      // Create transformation matrix
      const m = new THREE.Matrix4();
      m.makeTranslation(pos[0], pos[1], pos[2]);
      
      // Apply scale with twinkling effect
      const scaleMatrix = new THREE.Matrix4();
      const twinkle = 0.7 + 0.3 * Math.sin(state.clock.elapsedTime * twinkleSpeed + i);
      scaleMatrix.makeScale(
        scale[0] * twinkle,
        scale[1] * twinkle,
        scale[2]
      );
      m.multiply(scaleMatrix);
      
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry ref={geometryRef} args={[1, 1]} />
      <meshStandardMaterial
        emissive={0xffffff}
        emissiveIntensity={0.7}
        toneMapped={false}
        transparent={true}
        opacity={0.4}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Seeded random generator for deterministic designs
function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

function WallDesigns() {
  // Accent color palette
  const accents = ['#8b5cf6', '#a78bfa', '#f472b6', '#38bdf8'];
  // Use a fixed seed for deterministic design
  const randGen = useMemo(() => seededRandom(42), []);
  
  // Memoize all the random values and designs
  const designs = useMemo(() => {
    const randAccent = () => accents[Math.floor(randGen() * accents.length)];
    const rand = (a: number, b: number) => a + randGen() * (b - a);

    // Pre-calculate all random positions and values
    const backWallCircles = [...Array(3)].map(() => ({
      position: [rand(-3.2, 3.2), rand(-1.3, 1.3), -4.96] as [number, number, number],
      radius: rand(0.3, 0.6),
      color: randAccent(),
      opacity: rand(0.01, 0.02)
    }));

    const backWallArcs = [...Array(1)].map(() => ({
      rotation: rand(-0.5, 0.5),
      radius: rand(1.7, 2.2),
      color: randAccent()
    }));

    const rightWallLines = [...Array(3)].map(() => ({
      position: [4.97, rand(-1.5, 1.5), rand(-3, 3)] as [number, number, number],
      width: rand(2, 3.5),
      color: randAccent()
    }));

    const rightWallCircles = [...Array(3)].map(() => ({
      position: [4.96, rand(-1.5, 1.5), rand(-3, 3)] as [number, number, number],
      radius: rand(0.3, 0.7),
      color: randAccent()
    }));

    const ceilingLines = [...Array(5)].map((_, i) => ({
      position: [0, 2.48, -3.5 + i * 1.7] as [number, number, number],
      width: rand(5, 8),
      color: randAccent()
    }));

    return {
      backWallCircles,
      backWallArcs,
      rightWallLines,
      rightWallCircles,
      ceilingLines
    };
  }, []); // Empty dependency array means this only runs once

  return (
    <group>
      {/* Back wall: Overlapping glowing circles (bokeh) and soft lines */}
      <group>
        {/* Bokeh circles */}
        {designs.backWallCircles.map((circle, i) => (
          <mesh key={`backCircle${i}`} position={circle.position}>
            <circleGeometry args={[circle.radius, 40]} />
            <meshBasicMaterial color={circle.color} transparent opacity={circle.opacity} />
          </mesh>
        ))}
        {/* Soft gradient plane */}
        <mesh position={[0, 0, -4.98]}>
          <planeGeometry args={[8, 4]} />
          <meshBasicMaterial color={'#a78bfa'} transparent opacity={0.003} />
        </mesh>
        {/* Curved lines (arcs) */}
        {designs.backWallArcs.map((arc, i) => (
          <mesh key={`backArc${i}`} position={[0, 0, -4.95 + i * 0.001]} rotation={[0, 0, arc.rotation]}>
            <torusGeometry args={[arc.radius, 0.015, 16, 100, Math.PI * 0.9]} />
            <meshBasicMaterial color={arc.color} transparent opacity={0.08} />
          </mesh>
        ))}
      </group>

      {/* Right wall: horizontal glowing lines and bokeh */}
      <group>
        {designs.rightWallLines.map((line, i) => (
          <mesh key={`rightLine${i}`} position={line.position} rotation={[0, Math.PI / 2, Math.PI / 2]}>
            <planeGeometry args={[0.09, line.width]} />
            <meshBasicMaterial color={line.color} transparent opacity={0.13} />
          </mesh>
        ))}
        {designs.rightWallCircles.map((circle, i) => (
          <mesh key={`rightCircle${i}`} position={circle.position}>
            <circleGeometry args={[circle.radius, 32]} />
            <meshBasicMaterial color={circle.color} transparent opacity={0.12} />
          </mesh>
        ))}
      </group>

      {/* Ceiling: soft wave lines */}
      <group>
        {designs.ceilingLines.map((line, i) => (
          <mesh key={`ceilingLine${i}`} position={line.position} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[line.width, 0.09]} />
            <meshBasicMaterial color={line.color} transparent opacity={0.10} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function WallText({ texts }: { texts: string[] }) {
  const textRefs = useRef<THREE.Mesh[]>([]);
  const words = useMemo(() => texts.slice(0, 5), [texts]);

  useEffect(() => {
    console.log('WallText words:', words);
  }, [words]);

  useFrame((state) => {
    // Animate text only on left and front walls (U-shape path, full front wall width)
    const leftWallLength = 9.98; // z: -4.99 to 4.99
    const frontWallLength = 9.98; // x: -4.99 to 4.99 (full width)
    const pathLength = 2 * (leftWallLength + frontWallLength);
    const speed = 0.06; // Reduced speed
    words.forEach((word, i) => {
      // Each word gets a unique phase offset
      const phaseOffset = i / words.length;
      const t = ((state.clock.getElapsedTime() * speed + phaseOffset) % 1);
      const d = t * pathLength;
      let x = 0, y = 0, z = 0, rotY = 0;
      if (d < leftWallLength) {
        x = -4.99;
        z = -4.99 + d;
        y = Math.max(-1.7, Math.min(1.7, Math.cos((z - -4.99) / leftWallLength * Math.PI * 2 + i * (Math.PI / words.length)) * 1.5));
        rotY = Math.PI / 2;
      } else if (d < leftWallLength + frontWallLength) {
        x = -4.99 + (d - leftWallLength);
        z = -4.94;
        y = Math.max(-1.7, Math.min(1.7, Math.sin((x - -4.99) / frontWallLength * Math.PI * 2 + i * (Math.PI / words.length)) * 1.5));
        rotY = 0;
      } else if (d < leftWallLength + frontWallLength + leftWallLength) {
        x = -4.99;
        z = 4.99 - (d - (leftWallLength + frontWallLength));
        y = Math.max(-1.7, Math.min(1.7, Math.cos((z - -4.99) / leftWallLength * Math.PI * 2 + i * (Math.PI / words.length)) * 1.5));
        rotY = Math.PI / 2;
      } else {
        x = 4.99 - (d - (2 * leftWallLength + frontWallLength));
        z = -4.94;
        y = Math.max(-1.7, Math.min(1.7, Math.sin((x - -4.99) / frontWallLength * Math.PI * 2 + i * (Math.PI / words.length)) * 1.5));
        rotY = 0;
      }
      if (textRefs.current[i]) {
        textRefs.current[i].position.set(x, y, z);
        textRefs.current[i].rotation.y = rotY;
      }
    });
  });

  return (
    <group>
      {words.map((word, i) => {
        let fontSize = 0.4;
        let maxWidth = undefined;
        if (word.length > 40) {
          fontSize = 0.25;
          maxWidth = 3.8;
        } else if (word.length > 25) {
          fontSize = 0.28;
          maxWidth = 3.5;
        } else if (word.length > 12) {
          fontSize = 0.28;
          maxWidth = 3.2;
        } else if (word.length > 7) {
          fontSize = 0.33;
          maxWidth = 2.5;
        } else {
          fontSize = 0.4;
          maxWidth = 10;
        }
        return (
          <Text
            key={word + i}
            ref={el => {
              textRefs.current[i] = el;
              console.log(`Text element ${i} created:`, word);
            }}
            fontSize={fontSize}
            color="#e0e0ff"
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
            fillOpacity={1} // Increased opacity
            outlineWidth={0.02} // Increased outline
            outlineColor="#fff"
            outlineOpacity={0.3} // Increased outline opacity
            maxWidth={maxWidth}
          >
            {word}
          </Text>
        );
      })}
    </group>
  );
}

export default function AnimatedView({ onBack, initialTexts = ["SPLMNS"] }: AnimatedViewProps) {
  const [texts, setTexts] = useState<string[]>(initialTexts);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (initialTexts.length > 0) {
      setTexts(initialTexts);
    } else {
      setTexts(["SPLMNS"]); // Fallback to default
    }
  }, [initialTexts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      setTexts(prev => {
        const newTexts = [...prev, inputText.trim()];
        // Update localStorage when adding new text
        localStorage.setItem('animatedTexts', JSON.stringify(newTexts.slice(-5)));
        return newTexts.slice(-5); // Keep only the 5 most recent texts
      });
      setInputText("");
    }
  };

  // Add clear texts function
  const handleClearTexts = () => {
    setTexts(["SPLMNS"]); // Reset to default text
    localStorage.removeItem('animatedTexts');
  };

  // Custom camera setup to rotate view
  function CameraRig() {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.set(2.5, 0, 4);
      camera.lookAt(0, 0, 0);
    }, [camera]);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0926] via-[#1a0f33] to-[#251440] relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          className="px-4 py-2 bg-white/20 text-white rounded shadow hover:bg-white/40 transition" 
          onClick={onBack}
        >
          ← Back
        </button>
        <button 
          className="px-4 py-2 bg-red-500/20 text-white rounded shadow hover:bg-red-500/40 transition flex items-center gap-2" 
          onClick={handleClearTexts}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Clear All
        </button>
      </div>

      {/* Input form */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text..."
            className="px-4 py-2 bg-white/20 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white/20 text-white rounded shadow hover:bg-white/40 transition"
          >
            Add
          </button>
        </form>
      </div>

      <div className="w-[90vw] max-w-4xl aspect-video rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative bg-black">
        <Canvas camera={{ position: [2.5, 0, 4], fov: 60 }} style={{ width: "100%", height: "100%" }}>
          <CameraRig />
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 2, 4]} intensity={0.6} color="#fff" />
          <pointLight position={[0, 0, 2]} intensity={0.3} color="#fff" />
          <Room />
          <WallDesigns />
          <WallText texts={texts} />
          <WallParticles count={1000} />
          <fog attach="fog" args={['#0a0521', 1, 20]} />
          <EffectComposer>
            <Bloom
              intensity={0.5}
              radius={0.7}
              mipmapBlur
              luminanceThreshold={0.7}
              luminanceSmoothing={0.3}
            />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="mt-8 text-white/70 text-sm">3D Room with animated wall particles (Three.js)</div>
    </div>
  );
} 