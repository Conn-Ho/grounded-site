"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/* ───────────────────────────────────────────────
   Theme
   ─────────────────────────────────────────────── */
interface ThemeColors {
  bg: string;
  platformTop: string;
  platformSide: string;
  platformEdge: string;
  platformLabel: string;
  boxTop: string;
  boxSide: string;
  boxEdge: string;
  boxActiveTop: string;
  boxActiveSide: string;
  boxActiveEdge: string;
  coreTop: string;
  coreSide: string;
  coreEdge: string;
  nodeBg: string;
  nodeEdge: string;
  nodeLabel: string;
  accent: string;
  connection: string;
  text: string;
  dim: string;
}

const DARK: ThemeColors = {
  bg: "#0a0908",
  platformTop: "rgba(30,26,22,0.92)",
  platformSide: "rgba(22,20,16,0.88)",
  platformEdge: "rgba(61,53,40,0.7)",
  platformLabel: "#9a958f",
  boxTop: "#3a322a",
  boxSide: "#2a241e",
  boxEdge: "rgba(90,70,50,0.7)",
  boxActiveTop: "#4a3020",
  boxActiveSide: "#362416",
  boxActiveEdge: "#F65310",
  coreTop: "#0a0a0a",
  coreSide: "#050505",
  coreEdge: "#F65310",
  nodeBg: "#2a241e",
  nodeEdge: "rgba(246,83,16,0.35)",
  nodeLabel: "#d5cfc5",
  accent: "#F65310",
  connection: "#F65310",
  text: "#f5f1ea",
  dim: "#b8b1a5",
};

const LIGHT: ThemeColors = {
  bg: "#f5f5f5",
  platformTop: "#f0eeeb",
  platformSide: "#e8e6e3",
  platformEdge: "#d0cec8",
  platformLabel: "#9a9895",
  boxTop: "#ffffff",
  boxSide: "#f5f5f5",
  boxEdge: "#d0d0d0",
  boxActiveTop: "#fff8f5",
  boxActiveSide: "#ffece5",
  boxActiveEdge: "#F65310",
  coreTop: "#1a1a1a",
  coreSide: "#0f0f0f",
  coreEdge: "#F65310",
  nodeBg: "#ffffff",
  nodeEdge: "#d0d0d0",
  nodeLabel: "#4a4a4a",
  accent: "#F65310",
  connection: "#F65310",
  text: "#1a1a1a",
  dim: "#4a4a4a",
};

function useTheme() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => {
      const hasDark = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (document.documentElement.hasAttribute("data-theme")) {
        setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
      } else {
        setIsDark(hasDark || (!document.documentElement.classList.contains("light") && prefersDark));
      }
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", check);
    return () => { obs.disconnect(); mq.removeEventListener("change", check); };
  }, []);
  return isDark ? DARK : LIGHT;
}

/* ───────────────────────────────────────────────
   Utils
   ─────────────────────────────────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ───────────────────────────────────────────────
   Particle Intro — converge to center, then explode
   ─────────────────────────────────────────────── */
const PARTICLE_COUNT = 500;

function centerTargets(count: number) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pts[i * 3] = 0;
    pts[i * 3 + 1] = 0;
    pts[i * 3 + 2] = 0;
  }
  return pts;
}

const PARTICLE_VERT = /* glsl */ `
  attribute vec3 targetPosition;
  attribute float particleSpeed;
  uniform float u_progress;
  uniform float u_time;
  uniform float u_size;
  varying float v_alpha;
  void main() {
    // 粒子向中心汇聚（ease-out cubic）
    float p = clamp(u_progress * (1.0 + particleSpeed * 0.5), 0.0, 1.0);
    float t = 1.0 - pow(1.0 - p, 3.0);
    vec3 pos = mix(position, targetPosition, t);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = u_size * (100.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    v_alpha = 0.6 + 0.3 * p;
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  uniform vec3 u_color;
  varying float v_alpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = v_alpha * smoothstep(0.5, 0.2, d);
    gl_FragColor = vec4(u_color, alpha);
  }
`;

function ParticleIntro() {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const start = randomSpherePoints(PARTICLE_COUNT, 5);
    const target = centerTargets(PARTICLE_COUNT);
    const spd = Float32Array.from({ length: PARTICLE_COUNT }, () => 0.5 + Math.random() * 0.5);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(start, 3));
    geo.setAttribute("targetPosition", new THREE.BufferAttribute(target, 3));
    geo.setAttribute("particleSpeed", new THREE.BufferAttribute(spd, 1));
    return geo;
  }, []);

  useFrame((state) => {
    const mat = shaderRef.current;
    if (!mat) return;
    const t = state.clock.elapsedTime;
    mat.uniforms.u_time.value = t;

    // 0.3s 延迟 + 1.5s 凝聚（更慢更明显）
    const delay = 0.3;
    const duration = 1.5;
    const raw = (t - delay) / duration;
    const progress = Math.max(0, Math.min(1, raw));
    mat.uniforms.u_progress.value = progress;

    // 粒子在 94% 进度后缩小消失
    if (progress > 0.94) {
      const fade = 1 - (progress - 0.94) / 0.06;
      mat.uniforms.u_size.value = 1.2 * Math.max(0, fade);
      if (pointsRef.current) pointsRef.current.visible = fade > 0.01;
    } else {
      mat.uniforms.u_size.value = 1.2;
      if (pointsRef.current) pointsRef.current.visible = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={shaderRef}
        attach="material"
        vertexShader={PARTICLE_VERT}
        fragmentShader={PARTICLE_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          u_progress: { value: 0 },
          u_time: { value: 0 },
          u_size: { value: 1.2 },
          u_color: { value: new THREE.Color("#F65310") },
        }}
      />
    </points>
  );
}

/* ───────────────────────────────────────────────
   Center Glow — 粒子汇聚后的中心光点
   ─────────────────────────────────────────────── */
function CenterGlow({ accentColor }: { accentColor: string }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const g = glowRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * 3) * 0.5 + 0.5;
    const s = 0.6 + pulse * 0.5;
    g.scale.setScalar(s);
    (g.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.4;
  });

  return (
    <mesh ref={glowRef} position={[0, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial
        color={accentColor}
        transparent
        opacity={0.7}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function randomSpherePoints(count: number, radius: number) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pts[i * 3 + 2] = r * Math.cos(phi);
  }
  return pts;
}

/* ───────────────────────────────────────────────
   Platform
   ─────────────────────────────────────────────── */
function Platform({
  width = 3,
  depth = 3,
  height = 0.12,
  position = [0, 0, 0] as [number, number, number],
  label = "",
  theme,
}: {
  width?: number;
  depth?: number;
  height?: number;
  position?: [number, number, number];
  label?: string;
  theme: ThemeColors;
}) {
  const materials = useMemo(() => {
    const top = new THREE.MeshStandardMaterial({
      color: theme.platformTop,
      transparent: true,
      opacity: 0.95,
      roughness: 0.6,
      metalness: 0.15,
    });
    const side = new THREE.MeshStandardMaterial({
      color: theme.platformSide,
      transparent: true,
      opacity: 0.9,
      roughness: 0.7,
      metalness: 0.08,
    });
    const edge = new THREE.MeshStandardMaterial({
      color: theme.platformEdge,
      transparent: true,
      opacity: 0.8,
      roughness: 0.5,
      metalness: 0.1,
    });
    return [side, side, top, edge, side, side];
  }, [theme]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>
      {label && (
        <Html
          position={[width * 0.35, -height / 2 - 0.02, depth * 0.35]}
          center
          style={{ pointerEvents: "none" }}
        >
          <span
            style={{
              color: theme.platformLabel,
              fontSize: "9px",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              opacity: 0.65,
            }}
          >
            {label}
          </span>
        </Html>
      )}
    </group>
  );
}

/* ───────────────────────────────────────────────
   Box / Container
   ─────────────────────────────────────────────── */
interface BoxData {
  id: number;
  gx: number;
  gz: number;
  isCore?: boolean;
  label?: string;
  labelSub?: string;
}

function AnimatedBox({
  data,
  baseY,
  theme,
  hoveredId,
  setHoveredId,
  onClick,
}: {
  data: BoxData;
  baseY: number;
  theme: ThemeColors;
  hoveredId: number;
  setHoveredId: (id: number) => void;
  onClick?: (id: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [currentLift, setCurrentLift] = useState(0);
  const liftRef = useRef(0);
  const scaleRef = useRef(1);

  const isHovered = hoveredId === data.id;
  const isCore = data.isCore;

  const materials = useMemo(() => {
    const pick = (top: string, side: string, edge: string) => [
      new THREE.MeshStandardMaterial({ color: side, roughness: 0.7, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ color: side, roughness: 0.7, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ color: top, roughness: 0.6, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: side, roughness: 0.8, metalness: 0.02 }),
      new THREE.MeshStandardMaterial({ color: side, roughness: 0.7, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ color: side, roughness: 0.7, metalness: 0.05 }),
    ];
    if (isCore) return pick(theme.coreTop, theme.coreSide, theme.coreEdge);
    if (isHovered) return pick(theme.boxActiveTop, theme.boxActiveSide, theme.boxActiveEdge);
    return pick(theme.boxTop, theme.boxSide, theme.boxEdge);
  }, [theme, isHovered, isCore]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    const glow = glowRef.current;
    if (!group) return;

    // 律动悬浮
    const floatY = Math.sin(t * 1.8 + data.gx * 2 + data.gz * 2) * 0.06;
    const targetLift = isHovered ? 0.2 : 0;
    liftRef.current = lerp(liftRef.current, targetLift, 0.12);
    const targetScale = isHovered ? 1.08 : 1;
    scaleRef.current = lerp(scaleRef.current, targetScale, 0.12);

    group.position.y = baseY + floatY + liftRef.current;
    group.scale.setScalar(scaleRef.current);

    // 核心脉冲
    if (glow && isCore) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
      (glow.material as THREE.MeshBasicMaterial).opacity = 0.12 + pulse * 0.1;
      glow.scale.setScalar(1 + pulse * 0.15);
    }
  });

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredId(data.id);
      document.body.style.cursor = "pointer";
    },
    [data.id, setHoveredId]
  );

  const handlePointerOut = useCallback(() => {
    setHoveredId(-1);
    document.body.style.cursor = "auto";
  }, [setHoveredId]);

  return (
    <group
      ref={groupRef}
      position={[data.gx, baseY, data.gz]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={() => onClick?.(data.id)}
    >
      <mesh castShadow material={materials}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
      </mesh>

      {/* 核心光晕 */}
      {isCore && (
        <mesh ref={glowRef} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshBasicMaterial
            color={theme.accent}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 顶部小点 */}
      <mesh position={[0.15, 0.28, -0.15]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color={isHovered || isCore ? theme.accent : "#50c850"}
        />
      </mesh>

      {/* 标注 */}
      {(isHovered || (isCore && data.label)) && (
        <Html position={[0.4, 0.35, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
              borderRadius: "6px",
              padding: "6px 10px",
              border: `1px solid ${theme.accent}40`,
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                color: theme.accent,
                fontSize: "11px",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {data.label || "Agent Box"}
            </div>
            {data.labelSub && (
              <div
                style={{
                  color: theme.dim,
                  fontSize: "9px",
                  fontFamily: "monospace",
                  marginTop: "2px",
                }}
              >
                {data.labelSub}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ───────────────────────────────────────────────
   Region Node
   ─────────────────────────────────────────────── */
function RegionNode({
  position,
  label,
  theme,
  phase = 0,
}: {
  position: [number, number, number];
  label: string;
  theme: ThemeColors;
  phase?: number;
}) {
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dot = dotRef.current;
    if (!dot) return;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + phase);
    (dot.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.6;
  });

  return (
    <group position={position}>
      {/* 背景板 */}
      <mesh>
        <boxGeometry args={[0.7, 0.06, 0.4]} />
        <meshStandardMaterial
          color={theme.nodeBg}
          transparent
          opacity={0.9}
          roughness={0.8}
        />
      </mesh>
      {/* 边框 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.7, 0.06, 0.4)]} />
        <lineBasicMaterial color={theme.nodeEdge} transparent opacity={0.5} />
      </lineSegments>
      {/* 状态点 */}
      <mesh ref={dotRef} position={[0.28, 0.04, -0.12]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#50c850" transparent opacity={0.8} />
      </mesh>
      {/* 标签 */}
      <Html center style={{ pointerEvents: "none" }}>
        <span
          style={{
            color: theme.nodeLabel,
            fontSize: "8px",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
      </Html>
      {/* 连接点 */}
      <mesh position={[-0.38, 0, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={theme.nodeEdge} />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────────────
   Animated Dashed Connection
   ─────────────────────────────────────────────── */
function Connection({
  from,
  to,
  theme,
  phase = 0,
}: {
  from: [number, number, number];
  to: [number, number, number];
  theme: ThemeColors;
  phase?: number;
}) {
  const packetRef = useRef<THREE.Mesh>(null);

  const { points, lineObj, curve } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.3;
    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    const pts = c.getPoints(40);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineDashedMaterial({
      color: theme.connection,
      dashSize: 0.08,
      gapSize: 0.12,
      scale: 1,
      transparent: true,
      opacity: 0.45,
      linewidth: 1,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return { points: pts, lineObj: line, curve: c };
  }, [from, to, theme]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const packet = packetRef.current;
    if (!packet) return;

    const progress = ((t * 0.3 + phase) % 1 + 1) % 1;
    const p = curve.getPointAt(progress);
    packet.position.copy(p);

    const glow = 0.5 + 0.5 * Math.sin(t * 4 + phase * 2);
    (packet.material as THREE.MeshBasicMaterial).opacity = 0.5 + glow * 0.5;
  });

  return (
    <group>
      <primitive object={lineObj} />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.9} />
      </mesh>
      <mesh position={from}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────────────
   Beacon / Ambient pulse
   ─────────────────────────────────────────────── */
function Beacon({
  position,
  theme,
  phase = 0,
}: {
  position: [number, number, number];
  theme: ThemeColors;
  phase?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const ring = ringRef.current;
    if (!ring) return;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + phase);
    ring.scale.setScalar(1 + pulse * 0.8);
    (ring.material as THREE.MeshBasicMaterial).opacity = (0.06 + pulse * 0.08) * 0.5;
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.12, 16]} />
        <meshBasicMaterial
          color={theme.accent}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────────────
   Scene
   ─────────────────────────────────────────────── */
function Scene({ theme }: { theme: ThemeColors }) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* 灯光 */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[8, 12, 8]} intensity={1.5} />
      <pointLight position={[0, 4, 0]} intensity={0.8} color={theme.accent} distance={12} />

      {/* 开场粒子凝聚动画 */}
      <ParticleIntro />
      <CenterGlow accentColor={theme.accent} />
    </group>
  );
}

/* ───────────────────────────────────────────────
   Export
   ─────────────────────────────────────────────── */
export default function HeroVisual() {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  // 阻止 Canvas 区域滚轮事件冒泡导致页面滚动
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.stopPropagation();
    };
    el.addEventListener("wheel", onWheelNative, { passive: true });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0" onWheel={handleWheel}>
      <Canvas
        camera={{
          position: [7, 5, 7],
          fov: 35,
          near: 0.1,
          far: 100,
        } as any}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Scene theme={theme} />
      </Canvas>
    </div>
  );
}
