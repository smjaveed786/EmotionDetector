import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingShape({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  return (
    <Float
      speed={speed}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.5, 0.5]}
    >
      <mesh position={position} castShadow>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <Sphere args={[0.8, 64, 64]} position={position}>
        <MeshDistortMaterial
          color="#0ea5e3"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#06b6d4"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Directional lights */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#0ea5e3" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />
      
      {/* Point lights for glow effect */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#0ea5e3" />
      
      {/* Floating shapes */}
      <FloatingShape position={[-4, 2, -5]} color="#0ea5e3" speed={1.2} />
      <FloatingShape position={[4, -2, -6]} color="#06b6d4" speed={1.5} />
      <FloatingShape position={[2, 3, -4]} color="#10b981" speed={1.8} />
      <FloatingShape position={[-3, -1, -5]} color="#0ea5e3" speed={1.4} />
      
      {/* Distorted spheres */}
      <FloatingSphere position={[-2, 0, -8]} />
      <FloatingSphere position={[3, 1, -10]} />
      
      {/* More geometric shapes */}
      <Float speed={1} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh position={[5, 0, -7]} castShadow>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.2}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </Float>
      
      <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-5, -2, -6]} castShadow>
          <tetrahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.25}
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>
      </Float>
    </>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene />
      </Canvas>
      
      {/* Gradient overlay to blend with background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-secondary/95 -z-10" />
    </div>
  );
}
