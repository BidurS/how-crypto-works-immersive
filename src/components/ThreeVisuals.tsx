import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, Box, Sphere, MeshDistortMaterial, Line, Float, Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Home Page: Neural Consensus Cover (AI-Inspired generative network)
// ----------------------------------------------------------------------------
export const NeuralConsensus = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create static set of points
  const count = 100;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Dynamic Nodes */}
      <Points positions={points}>
        <PointMaterial 
          transparent 
          color="#3b82f6" 
          size={0.05} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Connectivity Lattice (Simplified representation) */}
      {[...Array(20)].map((_, i) => (
        <Line
          key={i}
          points={[
            [points[i*3], points[i*3+1], points[i*3+2]],
            [points[(i+1)*3] || 0, points[(i+1)*3+1] || 0, points[(i+1)*3+2] || 0]
          ]}
          color="#1d4ed8"
          lineWidth={0.5}
          transparent
          opacity={0.2}
        />
      ))}

      {/* Central Core Brain */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[1.5, 32, 32]}>
          <MeshDistortMaterial 
            color="#3b82f6" 
            emissive="#1d4ed8" 
            emissiveIntensity={0.5} 
            distort={0.4} 
            speed={2} 
            roughness={0}
            transparent
            opacity={0.1}
          />
        </Sphere>
      </Float>
    </group>
  );
};

// ----------------------------------------------------------------------------
// Core Bitcoin Engine (Decentralized Nodes & Hashing)
// ----------------------------------------------------------------------------
export const BitcoinVisual = ({ isMining, state: visualState }: { isMining?: boolean, state?: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const speed = (isMining || visualState === 'mining-and-proof-of-work') ? 1.5 : 0.2;
      groupRef.current.rotation.y += state.clock.getDelta() * speed;
    }
    if (coreRef.current && visualState === 'monetary-policy') {
       // Pulse effect for halving
       const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
       coreRef.current.scale.set(scale, scale, scale);
    }
  });

  const isUTXO = visualState === 'utxo-model';

  return (
    <group ref={groupRef}>
      {!isUTXO ? (
        <Float speed={isMining ? 10 : 2} rotationIntensity={isMining ? 2 : 0.5} floatIntensity={1}>
          <Icosahedron args={[1.5, 1]}>
            <meshBasicMaterial color="#facc15" wireframe transparent opacity={0.3} />
          </Icosahedron>
          <Sphere ref={coreRef} args={[0.8, 32, 32]}>
            <MeshDistortMaterial 
              color="#f59e0b" 
              emissive="#f59e0b"
              emissiveIntensity={isMining ? 2 : 0.5}
              distort={(isMining || visualState === 'mining-and-proof-of-work') ? 0.8 : 0.4} 
              speed={isMining ? 5 : 2} 
              roughness={0} 
              metalness={0.8} 
            />
          </Sphere>
          {/* Fake Glow Bloom */}
          <Sphere args={[1.2, 32, 32]}>
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.05} />
          </Sphere>
        </Float>
      ) : (
        /* UTXO Representation: A cluster of small coins/bills */
        <group>
          {[...Array(12)].map((_, i) => (
            <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
              <Box 
                args={[0.4, 0.6, 0.05]} 
                position={[
                  Math.sin(i * 0.5) * 1.5, 
                  Math.cos(i * 0.5) * 1.5, 
                  Math.sin(i) * 0.5
                ]}
              >
                <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
              </Box>
            </Float>
          ))}
        </group>
      )}
      
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
  const xSize = 0.5 + ratio * 1.5;
  const ySize = 0.5 + (1 - ratio) * 1.5;

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Token X */}
        <mesh position={[-1.5, 0, 0]}>
          <sphereGeometry args={[xSize, 32, 32]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
        </mesh>
        
        {/* Token Y */}
        <mesh position={[1.5, 0, 0]}>
          <sphereGeometry args={[ySize, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
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
      {[...Array(15)].map((_, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={1}>
          <mesh position={[Math.cos(i) * 2.5, Math.sin(i) * 2.5, Math.sin(i * 2) * 0.5]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
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
          <meshPhysicalMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1} roughness={0.1} metalness={0.9} clearcoat={1} transparent opacity={0.9} />
        </mesh>
        
        {/* Layer 2 / Smart Contract execution layer */}
        <mesh ref={outerRef}>
          <octahedronGeometry args={[1.8, 1]} />
          <meshBasicMaterial color="#9333ea" wireframe transparent opacity={0.4} />
        </mesh>

        {/* Glow Sphere */}
        <Sphere args={[1.5, 32, 32]}>
          <meshBasicMaterial color="#c084fc" transparent opacity={0.05} />
        </Sphere>
      </Float>

      {/* Floating Contract "Opcodes" */}
      {[...Array(10)].map((_, i) => (
        <Float key={i} speed={2} floatIntensity={2}>
          <mesh position={[Math.cos(i) * 3, Math.sin(i) * 3, Math.tan(i) * 0.5]}>
            <tetrahedronGeometry args={[0.1]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        </Float>
      ))}
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
      groupRef.current.position.z = (clock.elapsedTime * 3) % 4;
    }
  });

  return (
    <group>
      {/* Proof of History Time Sequence */}
      <group ref={groupRef}>
        {[...Array(20)].map((_, i) => (
          <Box key={i} args={[0.8, 0.1, 0.4]} position={[0, 0, -i * 0.8]}>
            <meshStandardMaterial 
              color="#14f195" 
              emissive="#14f195" 
              emissiveIntensity={1 - (i * 0.04)} 
              transparent 
              opacity={1 - (i * 0.05)} 
            />
          </Box>
        ))}
      </group>
      
      {/* High-speed transaction lines */}
      {[...Array(25)].map((_, i) => (
        <Line 
          key={`line-${i}`}
          points={[[Math.random() * 6 - 3, Math.random() * 6 - 3, 5], [Math.random() * 6 - 3, Math.random() * 6 - 3, -10]]} 
          color={i % 2 === 0 ? "#14f195" : "#9945FF"} 
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------------
// Custody & Cryptography (Entropy & Keys)
// ----------------------------------------------------------------------------
export const CustodyVisual = ({ entropy }: { entropy: number }) => {
  const pointsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      // Particles condense as entropy increases
      const scale = 1 + (1 - entropy) * 2;
      pointsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      <group ref={pointsRef}>
        {[...Array(50)].map((_, i) => (
          <mesh key={i} position={[
            Math.sin(i * 0.5) * 2,
            Math.cos(i * 0.8) * 2,
            Math.sin(i * 1.2) * 2
          ]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial 
              color={entropy > 0.8 ? "#3b82f6" : "#6366f1"} 
              emissive={entropy > 0.8 ? "#3b82f6" : "#000"}
              emissiveIntensity={entropy * 2}
            />
          </mesh>
        ))}
      </group>
      
      {/* The "Key" Core */}
      <mesh>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={entropy} 
        />
      </mesh>

      {/* Outer shield */}
      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.05 * entropy} wireframe />
      </Sphere>
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
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
};

// ----------------------------------------------------------------------
// Mini Blockchain Progress Bar (Header)
// ----------------------------------------------------------------------
export const BlockchainProgress = ({ chapters, currentSlug, getProgress }: { 
  chapters: any[], 
  currentSlug: string, 
  getProgress: (slug: string) => { completed: boolean } 
}) => {
  return (
    <group scale={0.4}>
      {chapters.map((ch, i) => {
        const { completed } = getProgress(ch.slug);
        const isActive = ch.slug === currentSlug;
        const xPos = (i - chapters.length / 2) * 1.5;

        return (
          <group key={ch.id} position={[xPos, 0, 0]}>
            {/* The Block */}
            <Float speed={isActive ? 2 : 0} rotationIntensity={0.2} floatIntensity={0.5}>
              <Box args={[1, 1, 1]}>
                <meshStandardMaterial 
                  color={completed ? "#3b82f6" : (isActive ? "#facc15" : "#1f2937")}
                  emissive={completed ? "#3b82f6" : (isActive ? "#facc15" : "#000")}
                  emissiveIntensity={isActive ? 2 : (completed ? 0.5 : 0)}
                  transparent
                  opacity={completed || isActive ? 1 : 0.3}
                  wireframe={!completed && !isActive}
                />
              </Box>
            </Float>

            {/* Connecting Link */}
            {i < chapters.length - 1 && (
              <Line
                points={[[0.5, 0, 0], [1, 0, 0]]}
                color={completed ? "#3b82f6" : "#374151"}
                lineWidth={1}
                transparent
                opacity={0.5}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};