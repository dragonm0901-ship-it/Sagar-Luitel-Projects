
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, MeshWobbleMaterial, Stars, Float as DreiFloat, Text, Html } from '@react-three/drei';
import * as THREE_LIB from 'three';
import { PROVINCES } from '../constants';

const Mesh = 'mesh' as any;
const ExtrudeGeometry = 'extrudeGeometry' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const SpotLight = 'spotLight' as any;
const BoxGeometry = 'boxGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const SphereGeometry = 'sphereGeometry' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const ConeGeometry = 'coneGeometry' as any;
const Group = 'group' as any;

const ProvinceMarker: React.FC<{ 
  position: [number, number, number]; 
  name: string; 
  turnout: number;
  onSelect: (name: string, turnout: number) => void;
}> = ({ position, name, turnout, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE_LIB.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 + Math.sin(state.clock.elapsedTime * 10) * 0.2 : 1);
    }
  });

  return (
    <Mesh 
      ref={meshRef}
      position={position} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(name, turnout)}
    >
      <SphereGeometry args={[0.12, 16, 16]} />
      <MeshStandardMaterial 
        color={hovered ? "#60a5fa" : "#ffffff"} 
        emissive={hovered ? "#60a5fa" : "#ffffff"}
        emissiveIntensity={hovered ? 2 : 0.5}
      />
    </Mesh>
  );
};

const NepalMapMesh: React.FC = () => {
  const meshRef = useRef<THREE_LIB.Mesh>(null!);
  const [selectedProvince, setSelectedProvince] = useState<{name: string, turnout: number} | null>(null);
  const { camera } = useThree();

  const shape = useMemo(() => {
    const s = new THREE_LIB.Shape();
    s.moveTo(-2.5, -0.6);
    s.lineTo(2.5, -0.6);
    s.lineTo(2.8, 1.0);
    s.lineTo(-2.2, 1.2);
    s.lineTo(-2.5, -0.6);
    return s;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (selectedProvince) {
      camera.position.z = THREE_LIB.MathUtils.lerp(camera.position.z, 4.5, 0.05);
    } else {
      camera.position.z = THREE_LIB.MathUtils.lerp(camera.position.z, 6, 0.05);
    }
  });

  // Rough coordinates for markers relative to the shape
  const provinceCoords: [number, number, number][] = [
    [2.0, 0.2, 0.4],   // Koshi
    [1.2, -0.4, 0.4],  // Madhesh
    [0.3, 0.1, 0.4],   // Bagmati
    [-0.6, 0.2, 0.4],  // Gandaki
    [-1.4, -0.3, 0.4], // Lumbini
    [-1.8, 0.5, 0.4],  // Karnali
    [-2.4, 0.6, 0.4],  // Sudurpashchim
  ];

  return (
    <DreiFloat speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Mesh ref={meshRef} castShadow onClick={() => setSelectedProvince(null)}>
        <ExtrudeGeometry args={[shape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.1 }]} />
        <MeshWobbleMaterial color="#DC143C" factor={0.05} speed={0.5} roughness={0.2} metalness={0.8} />
      </Mesh>
      
      {PROVINCES.map((p, i) => (
        <ProvinceMarker 
          key={p.name} 
          position={provinceCoords[i]} 
          name={p.name} 
          turnout={p.turnout}
          onSelect={(name, turnout) => setSelectedProvince({name, turnout})}
        />
      ))}

      {selectedProvince && (
        <Html position={[0, 0, 1]}>
          <div className="glass p-4 rounded-xl shadow-2xl min-w-[150px] animate-in zoom-in duration-300 border-blue-500/50">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">{selectedProvince.name}</h4>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-bold">Turnout:</span>
              <span className="text-blue-400 font-black text-lg">{selectedProvince.turnout}%</span>
            </div>
            <button 
              onClick={() => setSelectedProvince(null)}
              className="mt-2 w-full text-[10px] font-bold text-slate-500 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </Html>
      )}

      <Text
        position={[0, 1.8, 0.5]}
        fontSize={0.4}
        color="white"
        font="https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff"
        anchorX="center"
        anchorY="middle"
      >
        Digital Nepal
      </Text>
    </DreiFloat>
  );
};

export const HeroVisual: React.FC = () => {
  return (
    <div className="w-full h-[350px] md:h-[550px]" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <AmbientLight intensity={0.6} />
        <PointLight position={[10, 10, 10]} intensity={2} />
        <SpotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={1} />
        <NepalMapMesh />
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={1} fade speed={0.5} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

const RotatingLogo: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const meshRef = useRef<THREE_LIB.Group>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const renderSymbol = () => {
    switch (type) {
      case 'Tree':
        return (
          <Group>
            <Mesh position={[0, -0.4, 0]}>
              <CylinderGeometry args={[0.1, 0.15, 0.8]} />
              <MeshStandardMaterial color="#78350f" />
            </Mesh>
            <Mesh position={[0, 0.2, 0]}>
              <SphereGeometry args={[0.4, 16, 16]} />
              <MeshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
            </Mesh>
          </Group>
        );
      case 'Sun':
        return (
          <Mesh>
            <SphereGeometry args={[0.5, 32, 32]} />
            <MeshWobbleMaterial color={color} factor={0.2} speed={1} roughness={0.1} />
          </Mesh>
        );
      case 'Hammer':
        return (
          <Group rotation={[0, 0, Math.PI / 4]}>
            <Mesh position={[0, -0.2, 0]}>
              <BoxGeometry args={[0.1, 0.8, 0.1]} />
              <MeshStandardMaterial color="#444" />
            </Mesh>
            <Mesh position={[0, 0.25, 0]}>
              <BoxGeometry args={[0.5, 0.2, 0.2]} />
              <MeshStandardMaterial color={color} />
            </Mesh>
          </Group>
        );
      case 'Bell':
        return (
          <Group>
            <Mesh position={[0, 0, 0]}>
              <ConeGeometry args={[0.4, 0.8, 16]} />
              <MeshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Mesh>
            <Mesh position={[0, -0.4, 0]}>
              <SphereGeometry args={[0.1]} />
              <MeshStandardMaterial color="#fff" />
            </Mesh>
          </Group>
        );
      case 'Flag':
        return (
          <Group>
            <Mesh position={[-0.3, 0, 0]}>
              <CylinderGeometry args={[0.02, 0.02, 1]} />
              <MeshStandardMaterial color="#333" />
            </Mesh>
            <Mesh position={[0.1, 0.3, 0]}>
              <BoxGeometry args={[0.8, 0.4, 0.02]} />
              <MeshStandardMaterial color={color} />
            </Mesh>
          </Group>
        );
      default:
        return (
          <Mesh>
            <BoxGeometry args={[0.6, 0.6, 0.6]} />
            <MeshStandardMaterial color={color} />
          </Mesh>
        );
    }
  };

  return <Group ref={meshRef}>{renderSymbol()}</Group>;
};

export const PartyLogo3D: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  return (
    <Canvas style={{ height: '80px', width: '80px' }} camera={{ position: [0, 0, 2], fov: 40 }} aria-hidden="true">
      <AmbientLight intensity={1} />
      <PointLight position={[2, 2, 2]} />
      <RotatingLogo type={type} color={color} />
    </Canvas>
  );
};

export const BallotBoxAnimation: React.FC = () => {
  return (
    <div className="w-full h-[300px]" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <AmbientLight intensity={0.8} />
        <PointLight position={[5, 5, 5]} />
        <DreiFloat speed={3} rotationIntensity={1} floatIntensity={2}>
          <Mesh castShadow>
            <BoxGeometry args={[1.5, 2, 0.8]} />
            <MeshStandardMaterial color="#003893" metalness={0.5} roughness={0.2} />
          </Mesh>
          <Mesh position={[0, 1, 0]}>
            <BoxGeometry args={[0.8, 0.05, 0.3]} />
            <MeshStandardMaterial color="#ffffff" />
          </Mesh>
        </DreiFloat>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};
