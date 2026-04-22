import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { skillCategories } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Billboard, Preload, Text } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface SkillBubbleData {
  group: string;
  name: string;
  category: string;
  color: string;
  glow: string;
  radius: number;
  position: [number, number, number];
  floatOffset: number;
  driftOffset: number;
}

const groupPalette: Record<string, { color: string; glow: string }> = {
  "Programming Languages": { color: "#38bdf8", glow: "#7dd3fc" },
  "Frontend & Mobile Development": { color: "#818cf8", glow: "#c4b5fd" },
  "Backend & Cloud Infrastructure": { color: "#14b8a6", glow: "#5eead4" },
  "Data Engineering & Databases": { color: "#f59e0b", glow: "#fcd34d" },
  "DevOps & Observability": { color: "#22c55e", glow: "#86efac" },
  "Security & Compliance": { color: "#ef4444", glow: "#fca5a5" },
  "Core Competencies": { color: "#a78bfa", glow: "#ddd6fe" },
};

const defaultPalette = { color: "#38bdf8", glow: "#7dd3fc" };

const getCategoryGroup = (title: string) =>
  title.split(" - ")[0]?.trim() || title;

const skillBubbles: SkillBubbleData[] = skillCategories
  .flatMap((category, categoryIndex) =>
    category.skills.map((name) => {
      const group = getCategoryGroup(category.title);
      const palette = groupPalette[group] ?? defaultPalette;

      return {
        group,
        name,
        category: category.title,
        color: palette.color,
        glow: palette.glow,
        radius: 0,
        position: [0, 0, 0] as [number, number, number],
        floatOffset: 0,
        driftOffset: 0,
      };
    }),
  )
  .filter(
    (bubble, index, array) =>
      array.findIndex((candidate) => candidate.name === bubble.name) === index,
  );

const arrangedBubbles: SkillBubbleData[] = skillBubbles.map(
  (bubble, index, array) => {
    const total = array.length;
    const maxRadius = 8.6;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const radial = Math.sqrt((index + 0.45) / total) * maxRadius;
    const theta = index * goldenAngle + ((index % 6) - 2.5) * 0.015;
    const x = Math.cos(theta) * radial * 1.2;
    const y = Math.sin(theta) * radial * 0.78;
    const size = THREE.MathUtils.clamp(
      0.2 + bubble.name.length * 0.0025,
      0.2,
      0.31,
    );

    return {
      ...bubble,
      radius: size,
      position: [x, y, 0],
      floatOffset: index * 0.37,
      driftOffset: index * 0.51,
    };
  },
);

const skillGroups = Array.from(
  new Set(arrangedBubbles.map((bubble) => bubble.group)),
);

const BubbleNode = ({
  bubble,
  cloudOffsetRef,
}: {
  bubble: SkillBubbleData;
  cloudOffsetRef: React.MutableRefObject<THREE.Vector2>;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const targetRef = useRef(new THREE.Vector3(...bubble.position));
  const repelOffsetRef = useRef(new THREE.Vector3());
  const repelTargetRef = useRef(new THREE.Vector3());
  const scaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const tempRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current || !shellRef.current || !haloRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const baseX =
      bubble.position[0] +
      Math.sin(elapsed * 0.48 + bubble.floatOffset) * 0.045;
    const baseY =
      bubble.position[1] +
      Math.cos(elapsed * 0.43 + bubble.floatOffset) * 0.045;

    const viewport = state.viewport.getCurrentViewport(
      state.camera,
      new THREE.Vector3(0, 0, 0),
    );
    const pointerX =
      state.pointer.x * (viewport.width * 0.5) * 0.92 -
      cloudOffsetRef.current.x;
    const pointerY =
      state.pointer.y * (viewport.height * 0.5) * 0.72 -
      cloudOffsetRef.current.y;
    const deltaX = baseX - pointerX;
    const deltaY = baseY - pointerY;
    const distance = Math.hypot(deltaX, deltaY) || 0.0001;
    const repelRadius = 1.08 + bubble.radius * 2.5;
    const normalized = THREE.MathUtils.clamp(1 - distance / repelRadius, 0, 1);
    const repelStrength = normalized * normalized * (3 - 2 * normalized);
    const repelForce = repelStrength * (0.95 + bubble.radius * 0.65);

    repelTargetRef.current.set(
      (deltaX / distance) * repelForce,
      (deltaY / distance) * repelForce,
      0,
    );

    repelOffsetRef.current.lerp(
      repelTargetRef.current,
      1 - Math.exp(-delta * 9),
    );

    targetRef.current.set(
      baseX + repelOffsetRef.current.x,
      baseY + repelOffsetRef.current.y,
      bubble.position[2],
    );

    groupRef.current.position.lerp(targetRef.current, 1 - Math.exp(-delta * 8));
    groupRef.current.rotation.x =
      Math.sin(elapsed * 0.8 + bubble.driftOffset) * 0.08;
    groupRef.current.rotation.y =
      Math.cos(elapsed * 0.74 + bubble.driftOffset) * 0.1;

    const scale = 1 + repelStrength * 0.12;
    tempRef.current.set(scale, scale, scale);
    scaleRef.current.lerp(tempRef.current, 1 - Math.exp(-delta * 10));
    groupRef.current.scale.copy(scaleRef.current);

    const shellMaterial = shellRef.current
      .material as THREE.MeshPhysicalMaterial;
    const haloMaterial = haloRef.current.material as THREE.MeshBasicMaterial;

    shellMaterial.emissiveIntensity = 0.38 + repelStrength * 0.8;
    haloMaterial.opacity = 0.14 + repelStrength * 0.24;
  });

  return (
    <group ref={groupRef} position={bubble.position}>
      <mesh ref={haloRef}>
        <sphereGeometry args={[bubble.radius * 1.42, 20, 20]} />
        <meshBasicMaterial
          color={bubble.glow}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={shellRef}>
        <sphereGeometry args={[bubble.radius, 28, 28]} />
        <meshPhysicalMaterial
          color={bubble.color}
          emissive={bubble.glow}
          emissiveIntensity={0.38}
          roughness={0.22}
          metalness={0.06}
          transmission={0.18}
          thickness={0.65}
          transparent
          opacity={0.94}
        />
      </mesh>

      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 0, bubble.radius + 0.04]}
          fontSize={0.095}
          color="#f8fbff"
          outlineWidth={0.008}
          outlineColor="#08111f"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.35}
        >
          {bubble.name}
        </Text>
      </Billboard>
    </group>
  );
};

const SkillsCloud = () => {
  const cloudRef = useRef<THREE.Group>(null);
  const cloudOffsetRef = useRef(new THREE.Vector2(0, 0));
  const panCurrentRef = useRef(new THREE.Vector2(0, 0));
  const panTargetRef = useRef(new THREE.Vector2(0, 0));
  const dragRef = useRef({ active: false, x: 0, y: 0 });

  const PAN_LIMIT_X = 4.2;
  const PAN_LIMIT_Y = 2.8;

  const onDragStart = (e: ThreeEvent<PointerEvent>) => {
    dragRef.current.active = true;
    dragRef.current.x = e.nativeEvent.clientX;
    dragRef.current.y = e.nativeEvent.clientY;
    e.stopPropagation();
    const target = e.target as Element & {
      setPointerCapture?: (pointerId: number) => void;
    };
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }
  };

  const onDragMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragRef.current.active) {
      return;
    }

    const dx = e.nativeEvent.clientX - dragRef.current.x;
    const dy = e.nativeEvent.clientY - dragRef.current.y;

    dragRef.current.x = e.nativeEvent.clientX;
    dragRef.current.y = e.nativeEvent.clientY;

    panTargetRef.current.x = THREE.MathUtils.clamp(
      panTargetRef.current.x + dx * 0.018,
      -PAN_LIMIT_X,
      PAN_LIMIT_X,
    );
    panTargetRef.current.y = THREE.MathUtils.clamp(
      panTargetRef.current.y - dy * 0.018,
      -PAN_LIMIT_Y,
      PAN_LIMIT_Y,
    );

    e.stopPropagation();
  };

  const onDragEnd = (e: ThreeEvent<PointerEvent>) => {
    dragRef.current.active = false;
    e.stopPropagation();
    const target = e.target as Element & {
      releasePointerCapture?: (pointerId: number) => void;
    };
    if (target.releasePointerCapture) {
      target.releasePointerCapture(e.pointerId);
    }
  };

  useFrame((state, delta) => {
    if (!cloudRef.current) {
      return;
    }

    const t = state.clock.elapsedTime;
    panCurrentRef.current.lerp(panTargetRef.current, 1 - Math.exp(-delta * 8));

    const driftX = Math.sin(t * 0.12) * 0.16;
    const driftY = Math.cos(t * 0.1) * 0.1;

    cloudOffsetRef.current.set(
      panCurrentRef.current.x + driftX,
      panCurrentRef.current.y + driftY,
    );

    cloudRef.current.position.x = cloudOffsetRef.current.x;
    cloudRef.current.position.y = cloudOffsetRef.current.y;
    cloudRef.current.rotation.set(0, 0, 0);
  });

  return (
    <group ref={cloudRef}>
      <mesh
        position={[0, 0, -0.78]}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerOut={onDragEnd}
        onPointerLeave={onDragEnd}
      >
        <planeGeometry args={[24, 16]} />
        <meshBasicMaterial color="#0b1c35" transparent opacity={0.23} />
      </mesh>

      <mesh
        position={[0, 0, 0.8]}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerOut={onDragEnd}
        onPointerLeave={onDragEnd}
      >
        <planeGeometry args={[24, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {arrangedBubbles.map((bubble) => (
        <BubbleNode
          key={bubble.name}
          bubble={bubble}
          cloudOffsetRef={cloudOffsetRef}
        />
      ))}
    </group>
  );
};

const SkillsCanvas = () => {
  return (
    <div className="relative mt-10 overflow-hidden rounded-[32px] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(8,15,34,0.94),rgba(9,21,40,0.86))] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(56,189,248,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
      </div>

      <div className="absolute left-4 top-4 z-10 rounded-full border border-cyan-300/20 bg-[rgba(3,8,24,0.58)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-cyan-100/75 backdrop-blur-md md:left-6 md:top-6">
        Drag to pan · Hover to repel
      </div>

      <div className="h-[540px] w-full md:h-[620px]">
        <Canvas camera={{ position: [0, 0, 10.6], fov: 36 }} dpr={[1, 1.75]}>
          <color attach="background" args={["#081120"]} />
          <ambientLight intensity={0.75} />
          <directionalLight
            position={[0, 5, 6]}
            intensity={1.15}
            color="#d9f7ff"
          />
          <pointLight position={[-6, -1, 4]} intensity={0.85} color="#67e8f9" />
          <pointLight position={[6, 2, 4]} intensity={0.6} color="#c4b5fd" />
          <SkillsCloud />
          <fog attach="fog" args={["#081120", 11, 18]} />
          <Preload all />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2 md:bottom-6 md:left-6 md:right-6">
        {skillGroups.map((group) => {
          const palette = groupPalette[group] ?? defaultPalette;

          return (
            <div
              key={group}
              className="rounded-full border border-white/10 bg-[rgba(5,10,24,0.64)] px-3 py-2 text-[12px] text-white/80 backdrop-blur-md"
            >
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: palette.color }}
              />
              {group}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Skills = () => {
  useEffect(() => {
    gsap.fromTo(
      ".skills-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#skills-section",
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      },
    );
  }, []);

  return (
    <div id="skills-section">
      <motion.div className="skills-title" variants={textVariant()}>
        <p className={styles.sectionSubText}>What I can do</p>
        <h2 className={styles.sectionHeadText}>Skills & Technologies.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 max-w-3xl text-[17px] leading-[30px] text-secondary"
      >
        Explore the stack as an interactive flat-surface constellation: every
        skill appears as a 3D bubble on a 2D plane, with refined pointer-based
        repulsion for smoother, more responsive movement.
      </motion.div>

      <motion.div variants={fadeIn("up", "spring", 0.18, 1.1)}>
        <SkillsCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Skills, "skills");
