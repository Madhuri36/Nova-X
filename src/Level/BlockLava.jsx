import { useEffect, useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

import useGame from "../stores/useGame";

import fragmentShader from "../shaders/lava/fragment.glsl";
import vertexShader from "../shaders/lava/vertex.glsl";
import { shaderMaterial } from "@react-three/drei";

import * as THREE from "three";

const LavaMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorDark: new THREE.Color("#ff6600"),
        uColorLight: new THREE.Color("#f2f217"),
    },
    vertexShader,
    fragmentShader
);

extend({ LavaMaterial });

export function BlockLava({
    geometry = boxGeometry,
    material = levelMaterials.lava,
    position = [0, 0, 0],
}) {
    const lavaMaterial = useRef();

    const startBurning = useGame((state) => state.startBurning);
    const isBurning = useGame((state) => state.isBurning);
    const fail = useGame((state) => state.fail);
    const updateLivesOnFail = useGame((state) => state.updateLivesOnFail);

    const lavaSize = useMemo(() => 2, []);
    const floorSize = useMemo(() => (4 - lavaSize) / 2, [lavaSize]);
    const marginFloor = useMemo(() => floorSize / 2 + lavaSize / 2, [floorSize, lavaSize]);

    useEffect(() => {
        lavaMaterial.current.uTime += Math.random() * 10;
    }, []);

    useFrame((state, delta) => {
        lavaMaterial.current.uTime += delta * 0.3;
    });

    const handleCollision = (event) => {
        if (!isBurning) updateLivesOnFail();
        startBurning();
        fail();
    };

    return (
        <group position={position}>
            <Floor position={[0, -0.1, marginFloor]} scale={[4, 0.2, floorSize]} />
            <Floor position={[0, -0.1, -marginFloor]} scale={[4, 0.2, floorSize]} />
            <RigidBody type="fixed" position={[0, 0, 0]} restitution={0.2} friction={0} name="lava" colliders={false}>
                <CuboidCollider
                    args={[2, 0.05, lavaSize / 2]}
                    position={[0, -0.4, 0]}
                    restitution={0.2}
                    friction={1}
                    onCollisionEnter={handleCollision}
                />
            </RigidBody>
            <mesh
                geometry={geometry}
                material={material}
                position-y={-0.125}
                scale={[4, 0.15, lavaSize]}
                castShadow
                receiveShadow>
                <lavaMaterial ref={lavaMaterial} />
            </mesh>
        </group>
    );
}
