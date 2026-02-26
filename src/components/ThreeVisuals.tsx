import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, Box, Sphere, MeshDistortMaterial, Line, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Core Bitcoin Engine (Decentralized Nodes & Hashing)
// ----------------------------------------------------------------------------
export const BitcoinVisual = ({ isMining }: { isMining?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const speed = isMining ? 1.5 : 0.2;
      groupRef.current.rotation.y += state.clock.getDelta() * speed;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={isMining ? 10 : 2} rotationIntensity={isMining ? 2 : 0.5} floatIntensity={1}>
        <Icosahedron args={[1.5, 1]}>
          <meshBasicMaterial color="#facc15" wireframe transparent opacity={0.3} />
        </Icosahedron>
        <Sphere args={[0.8, 32, 32]}>
          <MeshDistortMaterial color="#f59e0b" distort={isMining ? 0.8 : 0.4} speed={isMining ? 5 : 2} roughness={0} metalness={0.8} />
        </Sphere>
      </Float>
      
      {/* Node Orbits */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <ringGeometry args={[2.5 + Math.random() * 0.5, 2.52 + Math.random() * 0.5, 64]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.1} side={THREE.DoubleSide} />
          <mesh position={[2.5, 0, 0]}>
            <sphereGeometry args={[0.08]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </mesh>
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------------
// DeFi AMM Sandbox (Constant Product Pool)
// ----------------------------------------------------------------------------
export const AMMVisual = ({ ratio }: { ratio: number }) => {
  // ratio is from 0 to 1. 0.5 is balanced.
  // x * y = k. Let k = 1.
  // if ratio = 0.5, x=1, y=1.
  // if ratio = 0.1, x is small, y is large.
  
  const xSize = 0.5 + ratio * 1.5;
  const ySize = 0.5 + (1 - ratio) * 1.5;

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Token X */}
        <mesh position={[-1.5, 0, 0]}>
          <sphereGeometry args={[xSize, 32, 32]} />
          <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.8} />
        </mesh>
        
        {/* Token Y */}
        <mesh position={[1.5, 0, 0]}>
          <sphereGeometry args={[ySize, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* The Connection (The Pool) */}
        <Line 
          points={[[-1.5, 0, 0], [1.5, 0, 0]]} 
          color="#ffffff" 
          lineWidth={1} 
          transparent 
          opacity={0.2} 
        />
      </Float>
      
      {/* Liquid particles orbiting the pool */}
      {[...Array(10)].map((_, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={1}>
          <mesh position={[Math.cos(i) * 2, Math.sin(i) * 2, Math.sin(i * 2)]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#ec4899" : "#3b82f6"} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------------
// Ethereum World Computer (Prismatic Smart Contracts)
// ----------------------------------------------------------------------------
export const EthereumVisual = () => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (outerRef.current && innerRef.current) {
      outerRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      outerRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        {/* EVM Core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial color="#c084fc" roughness={0.1} metalness={0.9} clearcoat={1} transparent opacity={0.9} />
        </mesh>
        
        {/* Layer 2 / Smart Contract execution layer */}
        <mesh ref={outerRef}>
          <octahedronGeometry args={[1.8, 1]} />
          <meshBasicMaterial color="#9333ea" wireframe transparent opacity={0.4} />
        </mesh>
      </Float>
    </group>
  );
};

// ----------------------------------------------------------------------------
// Solana Speed (Linear blocks & high throughput lines)
// ----------------------------------------------------------------------------
export const SolanaVisual = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z = (clock.elapsedTime * 2) % 4;
    }
  });

  return (
    <group>
      {/* Proof of History Time Sequence */}
      <group ref={groupRef}>
        {[...Array(20)].map((_, i) => (
          <Box key={i} args={[0.8, 0.1, 0.4]} position={[0, 0, -i * 0.8]}>
            <meshStandardMaterial color="#14f195" emissive="#14f195" emissiveIntensity={0.5 - (i * 0.02)} transparent opacity={1 - (i * 0.05)} />
          </Box>
        ))}
      </group>
      
      {/* High-speed transaction lines */}
      {[...Array(15)].map((_, i) => (
        <Line 
          key={`line-${i}`}
          points={[[Math.random() * 4 - 2, Math.random() * 4 - 2, 5], [Math.random() * 4 - 2, Math.random() * 4 - 2, -10]]} 
          color="#9945FF" 
          lineWidth={2}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------------
// Generic Fallback (Network graph)
// ----------------------------------------------------------------------------
export const GenericVisual = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={10} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Icosahedron args={[2, 2]}>
        <meshBasicMaterial color="#4b5563" wireframe transparent opacity={0.2} />
      </Icosahedron>
      <Sphere args={[0.5, 16, 16]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
      </Sphere>
    </group>
  );
};