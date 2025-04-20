import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

const Computers = ({ isMobile }: { isMobile: boolean }) => {
  // For simplicity, we'll create a basic 3D object instead of loading a GLTF model
  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      
      {/* Basic 3D objects to represent a computer workstation */}
      <group position={[0, -3.25, 0]}>
        {/* Monitor */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 2, 0.2]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 2.5, 0.11]} receiveShadow>
          <boxGeometry args={[2.8, 1.8, 0.01]} />
          <meshStandardMaterial color="#00aaff" emissive="#003366" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Monitor stand */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Desk */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[isMobile ? 5 : 8, 0.5, isMobile ? 3 : 4]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>
        
        {/* Keyboard */}
        <mesh position={[0, 1.05, 1]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.1, 1]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the 'isMobile' state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas; 