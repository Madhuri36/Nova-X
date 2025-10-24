import { useRef, useEffect, useMemo } from "react";
import { RigidBody, useRevoluteJoint, CuboidCollider } from "@react-three/rapier";

import { boxGeometry, levelMaterials } from "./Level";
import useGame from "../stores/useGame";

import * as THREE from "three";

const rotation = new THREE.Quaternion();
rotation.setFromEuler(new THREE.Euler(0, 0, 0));

export function BlockSeesaw({
    geometry = boxGeometry,
    material = levelMaterials.obstacle,
    position = [0, 0, 0],
}) {
    const cone = useRef();
    const plank = useRef();
    const randomX = useMemo(() => Math.random() * 2 - 1, []);

    const resetRotation = () => {
        plank.current?.setRotation(rotation);
        plank.current?.setAngvel({ x: 0, y: 0, z: 0 });
    };

    useEffect(() => {
        const unsubscribePhase = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value === "ready") resetRotation();
            }
        );
        return () => {
            unsubscribePhase();
        };
    }, []);

    useRevoluteJoint(
        cone,
        plank,
        [
            [0, 1, 0],
            [0, -0.1, 0],
            [1, 0, 0],
        ],
        {
            bounceThreshold: 0,
            contactBefore: true,
            enableLimit: true,
        }
    );

    return (
        <group position={[randomX, position[1], position[2]]}>
            <CuboidCollider
                args={[0.1, 0.1, 2]}
                position={[0, -0.1, 0]}
                restitution={0.2}
                friction={0}
            />
            <RigidBody ref={cone} type="fixed" colliders={"hull"}></RigidBody>
            <RigidBody
                ref={plank}
                name="obstacle"
                colliders={"cuboid"}
                position-y={0.6}
                friction={0}
                restitution={0.2}
                rotation={[0.15, 0, 0]}>
                <mesh castShadow receiveShadow material={material}>
                    <boxGeometry args={[0.5, 0.2, 7.5]} />
                </mesh>
            </RigidBody>
        </group>
    );
}
