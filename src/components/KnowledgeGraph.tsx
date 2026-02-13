"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ═══════════════════════════════════════════
// Deterministic PRNG (mulberry32)
// ═══════════════════════════════════════════

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ═══════════════════════════════════════════
// Graph types
// ═══════════════════════════════════════════

interface GNode {
  restX: number;
  restY: number;
  restZ: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  filled: boolean;
  phase: number;
  connections: number[];
}

interface GEdge {
  source: number;
  target: number;
}

// ═══════════════════════════════════════════
// Graph generation — 3D clustered layout
// ═══════════════════════════════════════════

function generateGraph(): { nodes: GNode[]; edges: GEdge[] } {
  const rand = mulberry32(42);
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];

  // 3D cluster centres — spread horizontally for wide cloud shape
  const clusters = [
    { cx: -3.8, cy: 0.0, cz: 0, spread: 1.6 },
    { cx: -1.8, cy: -0.5, cz: 0.3, spread: 2.2 },
    { cx: 0.5, cy: 0.3, cz: -0.2, spread: 2.2 },
    { cx: 2.8, cy: -0.3, cz: 0.3, spread: 1.8 },
    { cx: 4.2, cy: 0.5, cz: -0.5, spread: 1.3 },
    { cx: -1.0, cy: 1.5, cz: 0.5, spread: 1.6 },
    { cx: 1.5, cy: -1.5, cz: -0.3, spread: 1.6 },
  ];

  const NODE_COUNT = 55;

  for (let i = 0; i < NODE_COUNT; i++) {
    const c = clusters[Math.floor(rand() * clusters.length)];

    // Gaussian-like distribution (sum of 3 uniforms → bell curve)
    const gx = ((rand() + rand() + rand()) / 3) * 2 - 1;
    const gy = ((rand() + rand() + rand()) / 3) * 2 - 1;
    const gz = ((rand() + rand() + rand()) / 3) * 2 - 1;

    const x = c.cx + gx * c.spread;
    const y = c.cy + gy * c.spread * 0.7;
    const z = c.cz + gz * c.spread * 0.5;

    // Size distribution — mostly small, few large
    const roll = rand();
    let radius: number;
    if (roll < 0.4) radius = 0.05 + rand() * 0.03;
    else if (roll < 0.65) radius = 0.08 + rand() * 0.05;
    else if (roll < 0.82) radius = 0.14 + rand() * 0.08;
    else if (roll < 0.94) radius = 0.22 + rand() * 0.1;
    else radius = 0.33 + rand() * 0.1;

    nodes.push({
      restX: x,
      restY: y,
      restZ: z,
      x,
      y,
      z,
      vx: 0,
      vy: 0,
      vz: 0,
      radius,
      filled: rand() < 0.35,
      phase: rand() * Math.PI * 2,
      connections: [],
    });
  }

  // Build edges between nearby nodes
  const maxDist = 3.5;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].restX - nodes[j].restX;
      const dy = nodes[i].restY - nodes[j].restY;
      const dz = nodes[i].restZ - nodes[j].restZ;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < maxDist && rand() < (1 - d / maxDist) * 0.5) {
        edges.push({ source: i, target: j });
        nodes[i].connections.push(j);
        nodes[j].connections.push(i);
      }
    }
  }

  return { nodes, edges };
}

// ═══════════════════════════════════════════
// Reusable temp vectors (avoid GC in render loop)
// ═══════════════════════════════════════════

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _localRay = new THREE.Ray();
const _invMat = new THREE.Matrix4();

// ═══════════════════════════════════════════
// Inner R3F scene
// ═══════════════════════════════════════════

function GraphScene() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const linesGeoRef = useRef<THREE.BufferGeometry>(null);

  // Stable graph data
  const { nodes, edges } = useMemo(() => generateGraph(), []);
  const nodesRef = useRef(nodes);

  // Edge position buffer (mutated in-place each frame)
  const edgePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    for (let i = 0; i < edges.length; i++) {
      const a = nodes[edges[i].source];
      const b = nodes[edges[i].target];
      arr[i * 6] = a.restX;
      arr[i * 6 + 1] = a.restY;
      arr[i * 6 + 2] = a.restZ;
      arr[i * 6 + 3] = b.restX;
      arr[i * 6 + 4] = b.restY;
      arr[i * 6 + 5] = b.restZ;
    }
    return arr;
  }, [edges, nodes]);

  // Interaction state
  const dragRef = useRef<{
    idx: number;
    plane: THREE.Plane;
    offset: THREE.Vector3;
  } | null>(null);
  const hoveredRef = useRef(-1);

  const { gl, camera, raycaster } = useThree();

  // Shared geometry & materials
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 12, 8), []);
  const filledMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#670000",
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
    [],
  );
  const outlineMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#9d7c7c",
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    [],
  );

  // ── Set up edge geometry ──
  useEffect(() => {
    if (linesGeoRef.current) {
      linesGeoRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(edgePositions, 3),
      );
    }
  }, [edgePositions]);

  // ── Global pointer events for drag release ──
  useEffect(() => {
    const el = gl.domElement;
    const onUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        el.style.cursor = hoveredRef.current >= 0 ? "grab" : "";
      }
    };
    const onLeave = () => {
      dragRef.current = null;
      hoveredRef.current = -1;
      el.style.cursor = "";
    };
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      sphereGeo.dispose();
      filledMat.dispose();
      outlineMat.dispose();
    };
  }, [sphereGeo, filledMat, outlineMat]);

  // ── Frame loop: rotation + physics + render updates ──
  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const ns = nodesRef.current;
    const drag = dragRef.current;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.035);

    // ── Auto-rotate (pause during drag) ──
    if (!drag) {
      group.rotation.y += dt * 0.12;
    }

    // ── Mouse ray in group-local space ──
    _invMat.copy(group.matrixWorld).invert();
    _localRay.copy(state.raycaster.ray);
    _localRay.origin.applyMatrix4(_invMat);
    _localRay.direction.transformDirection(_invMat);

    const mouseIn =
      Math.abs(state.pointer.x) <= 1 && Math.abs(state.pointer.y) <= 1;

    // ── Physics constants ──
    const K = 35; // spring stiffness → rest
    const CD = 7; // damping coefficient
    const KELP_R = 2.0; // mouse influence radius (3D units)
    const KELP_F = 35; // kelp push force
    const AMB = 0.8; // ambient sway
    const EK1 = 12; // 1-hop edge pull
    const EK2 = 3; // 2-hop edge pull

    // ── Physics step ──
    for (let i = 0; i < ns.length; i++) {
      const n = ns[i];

      // Dragged node: smooth cursor follow via plane intersection
      if (drag && drag.idx === i) {
        const hd = _localRay.distanceToPlane(drag.plane);
        if (hd !== null && hd > 0) {
          _v1
            .copy(_localRay.origin)
            .addScaledVector(_localRay.direction, hd)
            .add(drag.offset);
          const l = Math.min(1, dt * 18);
          n.vx = (_v1.x - n.x) / Math.max(dt, 0.001);
          n.vy = (_v1.y - n.y) / Math.max(dt, 0.001);
          n.vz = (_v1.z - n.z) / Math.max(dt, 0.001);
          n.x += (_v1.x - n.x) * l;
          n.y += (_v1.y - n.y) * l;
          n.z += (_v1.z - n.z) * l;
        }
        continue;
      }

      // Spring–damper: F = −kx − cv
      let fx = -K * (n.x - n.restX) - CD * n.vx;
      let fy = -K * (n.y - n.restY) - CD * n.vy;
      let fz = -K * (n.z - n.restZ) - CD * n.vz;

      // Ambient sway (layered waves)
      fx += Math.sin(t * 0.45 + n.phase) * AMB;
      fx += Math.sin(t * 1.1 + n.phase * 2.3) * AMB * 0.15;
      fy += Math.cos(t * 0.28 + n.phase * 1.6) * AMB * 0.55;
      fz += Math.sin(t * 0.35 + n.phase * 0.7) * AMB * 0.4;

      // Kelp-wave from mouse ray
      if (mouseIn) {
        _v1.set(n.x, n.y, n.z);
        _localRay.closestPointToPoint(_v1, _v2);
        _v3.subVectors(_v1, _v2);
        const dist = _v3.length();

        if (dist < KELP_R && dist > 0.01) {
          const inf = 1 - dist / KELP_R;
          const inf2 = inf * inf;
          const wave = Math.sin(t * 2.0 + n.phase + dist * 0.5) * 0.3 + 0.7;
          _v3.normalize();
          fx += _v3.x * KELP_F * inf2 * wave;
          fy += _v3.y * KELP_F * inf2 * wave;
          fz += _v3.z * KELP_F * inf2 * wave;
        }
      }

      // Drag propagation through edges
      if (drag) {
        const dn = ns[drag.idx];
        if (n.connections.includes(drag.idx)) {
          // 1-hop: strong pull
          fx += (dn.x - n.x - (dn.restX - n.restX)) * EK1;
          fy += (dn.y - n.y - (dn.restY - n.restY)) * EK1;
          fz += (dn.z - n.z - (dn.restZ - n.restZ)) * EK1;
        } else {
          // 2-hop: weaker pull
          for (const ci of n.connections) {
            if (ns[ci].connections.includes(drag.idx)) {
              fx += (dn.x - n.x - (dn.restX - n.restX)) * EK2;
              fy += (dn.y - n.y - (dn.restY - n.restY)) * EK2;
              fz += (dn.z - n.z - (dn.restZ - n.restZ)) * EK2;
              break;
            }
          }
        }
      }

      // Semi-implicit Euler
      n.vx += fx * dt;
      n.vy += fy * dt;
      n.vz += fz * dt;
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      n.z += n.vz * dt;
    }

    // ── Update mesh positions & scales ──
    for (let i = 0; i < ns.length; i++) {
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.set(ns[i].x, ns[i].y, ns[i].z);
        const active = hoveredRef.current === i || drag?.idx === i;
        mesh.scale.setScalar(active ? ns[i].radius * 1.2 : ns[i].radius);
      }
    }

    // ── Update edge line positions ──
    const ep = edgePositions;
    for (let i = 0; i < edges.length; i++) {
      const a = ns[edges[i].source];
      const b = ns[edges[i].target];
      ep[i * 6] = a.x;
      ep[i * 6 + 1] = a.y;
      ep[i * 6 + 2] = a.z;
      ep[i * 6 + 3] = b.x;
      ep[i * 6 + 4] = b.y;
      ep[i * 6 + 5] = b.z;
    }
    if (linesGeoRef.current) {
      const attr = linesGeoRef.current.attributes
        .position as THREE.BufferAttribute;
      if (attr) attr.needsUpdate = true;
    }
  });

  // ── Start drag on a node ──
  const handleDragStart = useCallback(
    (i: number) => {
      const group = groupRef.current;
      if (!group) return;
      const n = nodesRef.current[i];

      // Camera forward direction in the group's local space
      const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
      const normal = new THREE.Vector3(0, 0, -1)
        .applyQuaternion(camera.quaternion)
        .transformDirection(inv)
        .normalize();

      // Drag plane through node position, perpendicular to camera
      const nodePos = new THREE.Vector3(n.x, n.y, n.z);
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
        normal,
        nodePos,
      );

      // Local ray → intersect with drag plane → compute offset
      const lr = new THREE.Ray();
      lr.copy(raycaster.ray);
      lr.origin.applyMatrix4(inv);
      lr.direction.transformDirection(inv);

      const hit = new THREE.Vector3();
      if (lr.intersectPlane(plane, hit)) {
        dragRef.current = {
          idx: i,
          plane,
          offset: new THREE.Vector3().subVectors(nodePos, hit),
        };
      } else {
        dragRef.current = { idx: i, plane, offset: new THREE.Vector3() };
      }

      gl.domElement.style.cursor = "grabbing";
    },
    [camera, raycaster, gl],
  );

  return (
    <group ref={groupRef} rotation={[0.08, 0.3, 0]} scale={1.4}>
      {/* ── Edges ── */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={linesGeoRef} />
        <lineBasicMaterial
          color="#9d7c7c"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </lineSegments>

      {/* ── Nodes ── */}
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[node.restX, node.restY, node.restZ]}
          scale={node.radius}
          geometry={sphereGeo}
          material={node.filled ? filledMat : outlineMat}
          onPointerOver={() => {
            hoveredRef.current = i;
            if (!dragRef.current) gl.domElement.style.cursor = "grab";
          }}
          onPointerOut={() => {
            if (hoveredRef.current === i) hoveredRef.current = -1;
            if (!dragRef.current) gl.domElement.style.cursor = "";
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            handleDragStart(i);
          }}
        />
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════
// Exported component
// ═══════════════════════════════════════════

export default function KnowledgeGraph({ className }: { className?: string }) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <GraphScene />
      </Canvas>
    </div>
  );
}
