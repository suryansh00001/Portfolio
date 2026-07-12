import * as THREE from "three";
import { RenderTexture, useGLTF, useTexture } from "@react-three/drei";
import { ThreeEvent, extend, useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useRef, useMemo } from "react";
import { GLTF, MeshLineMesh, RigidBodyType, User } from "../types/types";
import CardTexture from "./CardTexture";

extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload("/card.glb");
useTexture.preload("/band.jpg");

const segmentProps = { type: "dynamic", canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 } as const;

const Card = ({ student: user }: { student: User }) => {
  const cardVisualRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const lastPointer = useRef({ x: 0, y: 0, time: 0 });
  const throwVelocity = useRef({ x: 0, y: 0 });
  const dragDistance = useRef(0);
  const suppressClick = useRef(false);
  const isClickFlipping = useRef(false);
  const clickFlipProgress = useRef(0);
  const clickFlipStartY = useRef(0);
  const clickFlipEndY = useRef(0);
  const dragThresholdPx = 8;
  const clickFlipDuration = 0.42;
  const dragAngularScale = 0.0018;
  const dragMaxAngularVelocity = 12;
  const throwAngularScale = 0.0014;
  const throwMaxAngularVelocity = 12;

  const fixedPoint = useRef<RigidBodyType>(null);
  const ropeTop = useRef<RigidBodyType>(null);
  const ropeMiddle = useRef<RigidBodyType>(null);
  const ropeBottom = useRef<RigidBodyType>(null);
  const card = useRef<RigidBodyType>(null);
  const bandLine = useRef<MeshLineMesh>(null);

  const { nodes, materials } = useGLTF("/card.glb") as unknown as GLTF;
  const texture = useTexture("/images/band.jpg");

  const { width, height } = useThree((state) => state.size);

  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(Array.from({ length: 4 }, () => new THREE.Vector3()));
    c.curveType = "chordal";
    return c;
  }, []);

  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempVec2 = useMemo(() => new THREE.Vector3(), []);
  const cardAngVel = useMemo(() => new THREE.Vector3(), []);
  const cardRotQ = useMemo(() => new THREE.Quaternion(), []);

  useRopeJoint(fixedPoint as React.RefObject<RigidBodyType>, ropeTop as React.RefObject<RigidBodyType>, [[0, -0.5, 0], [0, 0, 0], 1]);
  useRopeJoint(ropeTop as React.RefObject<RigidBodyType>, ropeMiddle as React.RefObject<RigidBodyType>, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(ropeMiddle as React.RefObject<RigidBodyType>, ropeBottom as React.RefObject<RigidBodyType>, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(ropeBottom as React.RefObject<RigidBodyType>, card as React.RefObject<RigidBodyType>, [[0, 0, 0], [0, 1.45, 0]]);

  useMemo(() => { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; }, [texture]);

  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const normalizeAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    isClickFlipping.current = false;
    isDragging.current = true;
    activePointerId.current = event.pointerId;
    lastPointer.current = { x: event.clientX, y: event.clientY, time: performance.now() };
    throwVelocity.current = { x: 0, y: 0 };
    dragDistance.current = 0;
    suppressClick.current = false;
    const target = event.target as unknown as {
      setPointerCapture?: (pointerId: number) => void;
    };
    target.setPointerCapture?.(event.pointerId);
    card.current?.wakeUp();
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current || activePointerId.current !== event.pointerId) return;
    event.stopPropagation();

    const now = performance.now();
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
    dragDistance.current += Math.abs(dx) + Math.abs(dy);
    if (dragDistance.current > dragThresholdPx) {
      suppressClick.current = true;
    }
    const dt = Math.max((now - lastPointer.current.time) / 1000, 1 / 120);

    const velocityX = dx / dt;
    const velocityY = dy / dt;
    throwVelocity.current = { x: velocityX, y: velocityY };

    card.current?.setAngvel({
      x: THREE.MathUtils.clamp(-velocityY * dragAngularScale, -dragMaxAngularVelocity, dragMaxAngularVelocity),
      y: THREE.MathUtils.clamp(velocityX * dragAngularScale, -dragMaxAngularVelocity, dragMaxAngularVelocity),
      z: 0,
    }, true);

    lastPointer.current = { x: event.clientX, y: event.clientY, time: now };
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current || activePointerId.current !== event.pointerId) return;
    event.stopPropagation();
    isDragging.current = false;
    activePointerId.current = null;

    const target = event.target as unknown as {
      releasePointerCapture?: (pointerId: number) => void;
    };
    target.releasePointerCapture?.(event.pointerId);

    const currentAngVel = card.current?.angvel();
    card.current?.setAngvel({
      x: THREE.MathUtils.clamp((currentAngVel?.x || 0) - throwVelocity.current.y * throwAngularScale, -throwMaxAngularVelocity, throwMaxAngularVelocity),
      y: THREE.MathUtils.clamp((currentAngVel?.y || 0) + throwVelocity.current.x * throwAngularScale, -throwMaxAngularVelocity, throwMaxAngularVelocity),
      z: currentAngVel?.z || 0,
    }, true);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    const currentY = cardVisualRef.current?.rotation.y ?? 0;
    clickFlipStartY.current = currentY;
    clickFlipEndY.current = currentY + Math.PI;
    clickFlipProgress.current = 0;
    isClickFlipping.current = true;

    card.current?.wakeUp();
    const currentAngVel = card.current?.angvel();
    card.current?.setAngvel({
      x: THREE.MathUtils.clamp((currentAngVel?.x || 0) + (Math.random() - 0.5) * 1.6, -4, 4),
      y: THREE.MathUtils.clamp((currentAngVel?.y || 0) + (Math.random() - 0.5) * 0.6, -1, 1),
      z: THREE.MathUtils.clamp((currentAngVel?.z || 0) + (Math.random() - 0.5) * 1.6, -4, 4),
    }, true);
    const currentPos = card.current?.translation();
    card.current?.setTranslation({
      x: (currentPos?.x || 0) + (Math.random() - 0.5) * 0.18,
      y: (currentPos?.y || 0) - Math.random() * 0.08,
      z: (currentPos?.z || 0) + (Math.random() - 0.5) * 0.05,
    }, true);
  };

  useFrame((_, delta) => {
    if (isClickFlipping.current && cardVisualRef.current) {
      clickFlipProgress.current += delta / clickFlipDuration;
      const t = Math.min(clickFlipProgress.current, 1);
      const eased = easeInOutCubic(t);
      cardVisualRef.current.rotation.y = THREE.MathUtils.lerp(clickFlipStartY.current, clickFlipEndY.current, eased);

      if (t >= 1) {
        cardVisualRef.current.rotation.y = normalizeAngle(clickFlipEndY.current);
        isClickFlipping.current = false;
      }
    }

    if (!fixedPoint.current) return;

    [ropeTop, ropeMiddle].forEach((ref) => {
      const curr = ref.current;
      if (!curr) return;
      const target = curr.translation();
      curr.lerped ??= tempVec.copy(target);
      const dist = curr.lerped.distanceTo(target);
      const t = 1 - Math.exp(-(10 + Math.min(dist, 1) * (50 - 10)) * delta);
      curr.lerped.lerp(target, t);
    });

    curve.points[0].copy(ropeBottom.current?.translation() || tempVec2);
    curve.points[1].copy(ropeMiddle.current?.translation() || tempVec2);
    curve.points[2].copy(ropeTop.current?.translation() || tempVec2);
    curve.points[3].copy(fixedPoint.current.translation());

    bandLine.current?.geometry.setPoints(curve.getPoints(32));

    cardAngVel.copy(card.current?.angvel() || tempVec2);
    const currentRot = card.current?.rotation();
    if (currentRot) {
      cardRotQ.set(currentRot.x, currentRot.y, currentRot.z, currentRot.w);
      const euler = new THREE.Euler().setFromQuaternion(cardRotQ, "YXZ");
      const diffY = normalizeAngle(2 * euler.y) / 2;

      if (!isDragging.current) {
        card.current?.setAngvel({
          x: cardAngVel.x,
          y: cardAngVel.y - diffY * 0.8, // gentle restoring torque targeting flat view
          z: cardAngVel.z,
        });
      }
    }
  });

  return (
    <>
      <group position={[0, 5.5, 0]}>
        <RigidBody ref={fixedPoint} {...segmentProps} type="fixed" />
        <RigidBody ref={ropeTop} {...segmentProps} position={[0.5, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={ropeMiddle} {...segmentProps} position={[1, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={ropeBottom} {...segmentProps} position={[1.5, 0, 1]}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody ref={card} {...segmentProps} position={[2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group scale={3} position={[0, -2.125, -0.05]}>
            <group
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={handleClick}
              ref={cardVisualRef}
            >
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial roughness={1} clearcoat={.5} clearcoatRoughness={1} metalness={.3}>
                  <RenderTexture colorSpace={THREE.SRGBColorSpace} attach="map" width={1024} height={1024}>
                    <CardTexture {...user} />
                  </RenderTexture>
                </meshPhysicalMaterial>
              </mesh>
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={bandLine}>
        <meshLineGeometry />
        <meshLineMaterial
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
};

export default Card;
