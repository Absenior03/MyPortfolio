import { MutableRefObject, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Preload, Text } from "@react-three/drei";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProgressRef = MutableRefObject<number>;
type KeystrokeRef = MutableRefObject<number>;

export type ComputersCanvasProps = {
  progressRef?: ProgressRef;
  keystrokeRef?: KeystrokeRef;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

// ─── Keyboard geometry and layout ─────────────────────────────────────────────

const KEYBOARD_KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
];

const NUMBER_ROW_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"];

const KEY_SPACING_X = 0.52;
const KEY_SPACING_Z = 0.44;
const KEYBOARD_SCALE = 1.85;
const KEYBOARD_ROW_OFFSETS = [-2.42, -2.24, -2.08];

const TYPING_SEQUENCE = "SOFTWARE ENGINEER";
const KEY_PULSE_DURATION = 0.24;
const MODIFIER_KEY_SIZE: [number, number, number] = [0.52, 0.08, 0.4];

const keyFromCharacter = (char: string) => {
  if (char === " ") return "SPACE";
  return char.toUpperCase();
};

const getPulse = (startedAt: number | undefined, now: number) => {
  if (startedAt === undefined) return 0;
  const elapsed = now - startedAt;
  if (elapsed <= 0 || elapsed > KEY_PULSE_DURATION) return 0;
  const t = 1 - elapsed / KEY_PULSE_DURATION;
  return t * t;
};

type KeyboardKeyProps = {
  keyId: string;
  label: string;
  position: [number, number, number];
  size: [number, number, number];
  pulseRef: MutableRefObject<Record<string, number>>;
  activeColor?: string;
  idleColor?: string;
  activeEmissive?: string;
  idleEmissive?: string;
  textColor?: string;
  textOutline?: string;
  textSize?: number;
  travel?: number;
};

const KeyboardKey = ({
  keyId,
  label,
  position,
  size,
  pulseRef,
  activeColor = "#0b1220",
  idleColor = "#060b16",
  activeEmissive = "#0f2c4b",
  idleEmissive = "#172033",
  textColor = "#7dd3fc",
  textOutline = "#0ea5e9",
  textSize = 0.12,
  travel = 0.025,
}: KeyboardKeyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = getPulse(
      pulseRef.current[keyId],
      state.clock.getElapsedTime(),
    );
    meshRef.current.position.y = -pulse * travel;

    const mat = meshRef.current.material;
    if (mat instanceof THREE.MeshStandardMaterial) {
      mat.color.set(pulse > 0.01 ? activeColor : idleColor);
      mat.emissive.set(pulse > 0.01 ? activeEmissive : idleEmissive);
      mat.emissiveIntensity = 0.24 + pulse * 1.35;
      mat.roughness = 0.38 - pulse * 0.1;
      mat.metalness = 0.52 + pulse * 0.12;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={idleColor}
          metalness={0.52}
          roughness={0.38}
          emissive={idleEmissive}
          emissiveIntensity={0.24}
        />
      </mesh>
      <Text
        position={[0, 0.051, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={textSize}
        letterSpacing={0}
        color={textColor}
        outlineWidth={0.004}
        outlineColor={textOutline}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const Keyboard = ({ keystrokeRef }: { keystrokeRef: KeystrokeRef }) => {
  const pulseRef = useRef<Record<string, number>>({});
  const prevStepRef = useRef(0);

  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    const step = clamp(
      Math.floor(keystrokeRef.current),
      0,
      TYPING_SEQUENCE.length,
    );
    const prev = prevStepRef.current;

    if (step === prev) return;

    const direction = step > prev ? 1 : -1;
    for (
      let i = prev + direction;
      direction > 0 ? i <= step : i >= step;
      i += direction
    ) {
      if (direction > 0) {
        const char = TYPING_SEQUENCE[i - 1] ?? "";
        const keyId = keyFromCharacter(char);
        pulseRef.current[keyId] = now;
      } else {
        pulseRef.current.BACKSPACE = now;
      }
    }

    prevStepRef.current = step;
  });

  return (
    <group
      scale={[KEYBOARD_SCALE, KEYBOARD_SCALE, KEYBOARD_SCALE]}
      position={[0, 0.18, 0.35]}
    >
      {/* Low-profile aluminum shell */}
      <mesh position={[0, 0.02, 0.12]} castShadow receiveShadow>
        <boxGeometry args={[7.3, 0.24, 3.5]} />
        <meshStandardMaterial
          color="#0b1220"
          metalness={0.82}
          roughness={0.26}
          emissive="#111827"
          emissiveIntensity={0.28}
        />
      </mesh>

      {/* Keyboard deck */}
      <mesh position={[0, 0.15, 0.12]} castShadow receiveShadow>
        <boxGeometry args={[6.9, 0.06, 3.1]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.7}
          roughness={0.34}
        />
      </mesh>

      {/* Rear wedge for a modern typing angle */}
      <mesh
        position={[0, 0.16, -0.78]}
        rotation={[-0.08, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[6.75, 0.22, 0.62]} />
        <meshStandardMaterial
          color="#101827"
          metalness={0.78}
          roughness={0.28}
        />
      </mesh>

      {/* Accent light bar */}
      <mesh position={[0, 0.22, -0.88]} castShadow>
        <boxGeometry args={[4.8, 0.02, 0.14]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Front bezel */}
      <mesh position={[0, 0.12, 1.58]} castShadow receiveShadow>
        <boxGeometry args={[6.35, 0.03, 0.34]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.62}
          roughness={0.42}
        />
      </mesh>

      {/* Key rows with flat legends */}
      {NUMBER_ROW_KEYS.map((label, idx) => {
        const x = -2.68 + idx * KEY_SPACING_X;
        return (
          <KeyboardKey
            key={`num-${label}`}
            keyId={`STATIC-${label}`}
            label={label}
            position={[x, 0.2, -0.34]}
            size={[0.42, 0.09, 0.4]}
            pulseRef={pulseRef}
          />
        );
      })}

      {KEYBOARD_KEYS.map((row, rowIdx) =>
        row.map((label, colIdx) => {
          const x = KEYBOARD_ROW_OFFSETS[rowIdx] + colIdx * KEY_SPACING_X;
          const z = 0.1 + rowIdx * KEY_SPACING_Z;
          return (
            <KeyboardKey
              key={`key-${rowIdx}-${colIdx}`}
              keyId={label}
              label={label}
              position={[x, 0.2, z]}
              size={[0.42, 0.09, 0.42]}
              pulseRef={pulseRef}
            />
          );
        }),
      )}

      {/* Utility keys for complete Mac-style silhouette */}
      <KeyboardKey
        keyId="STATIC-TAB"
        label="TAB"
        position={[-2.95, 0.2, 0.1]}
        size={[0.62, 0.09, 0.4]}
        pulseRef={pulseRef}
        textSize={0.08}
      />

      <KeyboardKey
        keyId="STATIC-CAPS"
        label="CAPS"
        position={[-2.98, 0.2, 0.54]}
        size={[0.72, 0.09, 0.4]}
        pulseRef={pulseRef}
        textSize={0.07}
      />

      <KeyboardKey
        keyId="STATIC-SHIFT-L"
        label="SHIFT"
        position={[-2.86, 0.2, 0.98]}
        size={[0.96, 0.09, 0.4]}
        pulseRef={pulseRef}
        textSize={0.07}
      />

      <KeyboardKey
        keyId="STATIC-ENTER"
        label="ENTER"
        position={[3.05, 0.2, 0.54]}
        size={[0.6, 0.09, 0.4]}
        pulseRef={pulseRef}
        textSize={0.06}
      />

      <KeyboardKey
        keyId="STATIC-SHIFT-R"
        label="SHIFT"
        position={[3.18, 0.2, 0.98]}
        size={[0.56, 0.09, 0.4]}
        pulseRef={pulseRef}
        textSize={0.06}
      />

      {/* Space key */}
      <KeyboardKey
        keyId="SPACE"
        label="SPACE"
        position={[0, 0.2, 1.42]}
        size={[1.8, 0.09, 0.4]}
        pulseRef={pulseRef}
        textSize={0.08}
        travel={0.02}
      />

      {/* Mac-style modifier row */}
      {[
        { id: "FN", x: -2.95 },
        { id: "CTRL", x: -2.35 },
        { id: "OPT", x: -1.75 },
        { id: "CMD", x: -1.15 },
        { id: "CMD", x: 1.15 },
        { id: "OPT", x: 1.75 },
        { id: "LEFT", x: 2.45 },
        { id: "RIGHT", x: 3.05 },
      ].map((key, idx) => (
        <KeyboardKey
          key={`mod-${key.id}-${idx}`}
          keyId={`STATIC-${key.id}-${idx}`}
          label={key.id}
          position={[key.x, 0.2, 1.42]}
          size={MODIFIER_KEY_SIZE}
          pulseRef={pulseRef}
          textSize={0.06}
          travel={0}
        />
      ))}

      {/* Backspace key */}
      <KeyboardKey
        keyId="BACKSPACE"
        label="DEL"
        position={[3.0, 0.2, 0.1]}
        size={[0.74, 0.09, 0.4]}
        pulseRef={pulseRef}
        activeColor="#2b1020"
        idleColor="#171022"
        activeEmissive="#7f1d1d"
        idleEmissive="#2b1020"
        textSize={0.07}
      />

      {/* Minimal side chamfers */}
      <mesh position={[-2.82, 0.08, 0.15]} rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.16, 0.2, 2.65]} />
        <meshStandardMaterial
          color="#0a1020"
          metalness={0.8}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[2.82, 0.08, 0.15]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[0.16, 0.2, 2.65]} />
        <meshStandardMaterial
          color="#0a1020"
          metalness={0.8}
          roughness={0.28}
        />
      </mesh>

      {/* Ground shadow receiver */}
      <ContactShadows
        position={[0, -0.18, 0.25]}
        opacity={0.72}
        scale={8.5}
        blur={2.8}
        far={5}
      />
    </group>
  );
};

// ─── Robot arm + hand (one side) ────────────────────────────────────────────────

const RobotHand = ({
  side,
  keystrokeRef,
  fingerIndex,
}: {
  side: "left" | "right";
  keystrokeRef: KeystrokeRef;
  fingerIndex: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const wristRef = useRef<THREE.Group>(null);
  const fingerRef = useRef<THREE.Group>(null);

  const xSign = side === "left" ? -1 : 1;

  // Key positions scaled to match the keyboard geometry.
  const keyPositions = useMemo<[number, number][]>(() => {
    const positions: [number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 10; col++) {
        const x =
          (KEYBOARD_ROW_OFFSETS[row] + col * KEY_SPACING_X) * KEYBOARD_SCALE;
        const z = (0.35 + row * KEY_SPACING_Z) * KEYBOARD_SCALE;
        positions.push([x, z]);
      }
    }
    return positions;
  }, []);

  const lastStrokeRef = useRef(-1);
  const pressRef = useRef(0);
  const targetKeyRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current || !wristRef.current || !fingerRef.current) return;

    const ks = keystrokeRef.current;
    const stroke = Math.floor(ks);

    const myStroke =
      stroke % 2 === fingerIndex ? stroke : lastStrokeRef.current;

    if (myStroke !== lastStrokeRef.current && myStroke >= 0 && myStroke < 30) {
      lastStrokeRef.current = myStroke;
      pressRef.current = 1.0;
      targetKeyRef.current = myStroke % keyPositions.length;
    }

    const [targetKeyX, targetKeyZ] = keyPositions[targetKeyRef.current];
    const targetPos = new THREE.Vector3(
      targetKeyX * 0.82,
      groupRef.current.position.y,
      targetKeyZ * 0.58,
    );

    groupRef.current.position.lerp(targetPos, 0.8);

    if (pressRef.current > 0) {
      pressRef.current = Math.max(0, pressRef.current - delta * 12);
    }
    const pressDip = Math.sin(pressRef.current * Math.PI) * 0.22;

    if (wristRef.current) {
      const targetRotX = -0.55 + pressDip * 1.35;
      wristRef.current.rotation.x = THREE.MathUtils.lerp(
        wristRef.current.rotation.x,
        targetRotX,
        0.7,
      );
    }

    if (fingerRef.current) {
      fingerRef.current.position.y = THREE.MathUtils.lerp(
        fingerRef.current.position.y,
        -pressDip,
        0.7,
      );
    }

    const t = performance.now() * 0.001;
    const idleY = 0.2 + Math.sin(t * 1.2 + fingerIndex * 2.0) * 0.035;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      idleY,
      0.05,
    );
  });

  return (
    <group ref={groupRef} position={[xSign * 2.3, 1.18, 1.85]}>
      {/* Upper arm */}
      <mesh position={[0, 0.32, -0.86]} rotation={[0.78, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 1.6, 16]} />
        <meshStandardMaterial
          color="#e0e7ff"
          metalness={0.6}
          roughness={0.3}
          emissive="#c7d2fe"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Forearm */}
      <mesh position={[0, -0.24, -0.34]} rotation={[0.82, 0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 1.4, 16]} />
        <meshStandardMaterial
          color="#e0e7ff"
          metalness={0.65}
          roughness={0.28}
          emissive="#bfdbfe"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Wrist joint */}
      <group ref={wristRef} position={[0, -0.5, 0.14]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#bfdbfe"
            metalness={0.75}
            roughness={0.2}
            emissive="#93c5fd"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Palm */}
        <mesh
          position={[0, -0.12, 0.28]}
          rotation={[0.72, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.5, 0.18, 0.6]} />
          <meshStandardMaterial
            color="#dbeafe"
            metalness={0.7}
            roughness={0.25}
            emissive="#bfdbfe"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Extended index finger */}
        <group ref={fingerRef} position={[xSign * 0.08, -0.1, 0.68]}>
          {/* Proximal phalanx */}
          <mesh position={[0, 0, 0.16]} rotation={[0.65, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.38, 12]} />
            <meshStandardMaterial
              color="#e0e7ff"
              metalness={0.75}
              roughness={0.25}
              emissive="#bfdbfe"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Distal phalanx */}
          <mesh position={[0, -0.02, 0.42]} rotation={[0.95, 0, 0]} castShadow>
            <cylinderGeometry args={[0.058, 0.068, 0.32, 12]} />
            <meshStandardMaterial
              color="#dbeafe"
              metalness={0.8}
              roughness={0.22}
              emissive="#93c5fd"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Fingertip cap - bright cyan glow */}
          <mesh position={[0, -0.06, 0.58]} castShadow receiveShadow>
            <sphereGeometry args={[0.068, 14, 14]} />
            <meshStandardMaterial
              color="#06b6d4"
              metalness={0.5}
              roughness={0.2}
              emissive="#22d3ee"
              emissiveIntensity={1.0}
            />
          </mesh>

          {/* Knuckle details */}
          {[0, 1].map((k) => (
            <mesh key={k} position={[0, 0, 0.22 + k * 0.27]} castShadow>
              <torusGeometry args={[0.07, 0.018, 8, 16]} />
              <meshStandardMaterial
                color="#bfdbfe"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>

        {/* Other curled fingers */}
        {[-0.18, 0.16, 0.32].map((ox, fi) => (
          <mesh
            key={fi}
            position={[ox * xSign, -0.1, 0.38]}
            rotation={[1.25, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.052, 0.062, 0.42, 10]} />
            <meshStandardMaterial
              color="#dbeafe"
              metalness={0.75}
              roughness={0.25}
              emissive="#bfdbfe"
              emissiveIntensity={0.15}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ─── Ambient particles ─────────────────────────────────────────────────────────

const DustParticles = () => {
  const meshRef = useRef<THREE.Points>(null);
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 1] = Math.random() * 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#7dd3fc"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
};

// ─── Main scene ────────────────────────────────────────────────────────────────

type SceneProps = {
  progressRef: ProgressRef;
  keystrokeRef: KeystrokeRef;
};

const TypingScene = ({ progressRef, keystrokeRef }: SceneProps) => {
  const sceneRef = useRef<THREE.Group>(null);

  const ORBIT_R = 6.1;
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.9, 0.95), []);

  useFrame((state, delta) => {
    if (!sceneRef.current) return;

    const rawProgress = clamp(progressRef.current, 0, 1);

    const PHASE2_START = 0.3;
    const PHASE2_END = 0.7;

    const p2Factor = THREE.MathUtils.smootherstep(
      clamp((rawProgress - PHASE2_START) / (PHASE2_END - PHASE2_START), 0, 1),
      0,
      1,
    );

    const orbitAngle = p2Factor * Math.PI;
    const orbitCx = Math.sin(orbitAngle) * ORBIT_R;
    const orbitCz = Math.cos(orbitAngle) * ORBIT_R;
    const orbitCy = lerp(3.3, 2.5, p2Factor);

    const targetCam = new THREE.Vector3(orbitCx, orbitCy, orbitCz);
    state.camera.position.lerp(targetCam, delta * 2.5);
    state.camera.lookAt(lookTarget);

    const scaleTarget = lerp(1.0, 0.68, p2Factor);
    sceneRef.current.scale.setScalar(
      THREE.MathUtils.lerp(sceneRef.current.scale.x, scaleTarget, delta * 3),
    );

    sceneRef.current.position.y = 0;
  });

  return (
    <>
      <ambientLight intensity={0.8} color="#ffffff" />

      <directionalLight
        position={[5, 10, 6]}
        intensity={2.2}
        color="#e0e7ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
      />

      <pointLight
        position={[-4, 7, 2]}
        intensity={1.3}
        color="#b3e5fc"
        distance={25}
      />

      <pointLight
        position={[0, 3, 4]}
        intensity={1.7}
        color="#80deea"
        distance={18}
      />

      <pointLight
        position={[0, 1.0, 2]}
        intensity={1.0}
        color="#fff9c4"
        distance={14}
      />

      <Environment preset="night" />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.4, 0]}
        receiveShadow
      >
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial
          color="#080810"
          metalness={0.2}
          roughness={0.85}
        />
      </mesh>

      <mesh position={[0, -0.02, 0.78]} receiveShadow castShadow>
        <boxGeometry args={[9.5, 0.14, 5.4]} />
        <meshStandardMaterial
          color="#0a0a12"
          metalness={0.25}
          roughness={0.75}
          emissive="#12121f"
          emissiveIntensity={0.12}
        />
      </mesh>

      <group ref={sceneRef} position={[0, 0.55, 0.2]}>
        <Keyboard keystrokeRef={keystrokeRef} />
        <DustParticles />
      </group>
    </>
  );
};

// ─── Canvas export ─────────────────────────────────────────────────────────────

const ComputersCanvas = ({
  progressRef,
  keystrokeRef,
}: ComputersCanvasProps) => {
  const fallbackProgress = useRef(0);
  const fallbackKeystroke = useRef(0);

  const activeProgress = progressRef ?? fallbackProgress;
  const activeKeystroke = keystrokeRef ?? fallbackKeystroke;

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.8, 1.8], fov: 48, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <TypingScene
          progressRef={activeProgress}
          keystrokeRef={activeKeystroke}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
