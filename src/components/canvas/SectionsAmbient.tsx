import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const AmbientField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  const positions = useMemo(() => {
    const count = 520;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    return arr;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012;
      pointsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    }

    if (ringARef.current) {
      ringARef.current.rotation.x += delta * 0.08;
      ringARef.current.rotation.z -= delta * 0.05;
      ringARef.current.position.y = lerp(
        -2.5,
        2.5,
        (Math.sin(state.clock.elapsedTime * 0.35) + 1) * 0.5,
      );
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.y -= delta * 0.09;
      ringBRef.current.rotation.z += delta * 0.06;
      ringBRef.current.position.y = lerp(
        2.5,
        -2.5,
        (Math.sin(state.clock.elapsedTime * 0.28) + 1) * 0.5,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.28} color="#b8d8ff" />
      <pointLight
        position={[0, 4, 3]}
        intensity={0.55}
        color="#67e8f9"
        distance={18}
      />
      <pointLight
        position={[-4, -2, 2]}
        intensity={0.36}
        color="#93c5fd"
        distance={14}
      />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#7dd3fc"
          transparent
          opacity={0.34}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <mesh ref={ringARef} position={[-4, 0, -3.5]}>
        <torusGeometry args={[1.05, 0.05, 16, 80]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.34}
          transparent
          opacity={0.32}
        />
      </mesh>

      <mesh ref={ringBRef} position={[4, 0, -3.5]}>
        <torusGeometry args={[1.35, 0.05, 16, 96]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#0891b2"
          emissiveIntensity={0.3}
          transparent
          opacity={0.28}
        />
      </mesh>
    </>
  );
};

const SectionsAmbientCanvas = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.07),transparent_60%)]" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 54 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <AmbientField />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default SectionsAmbientCanvas;
