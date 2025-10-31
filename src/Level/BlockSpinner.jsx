import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import { boxGeometry, levelMaterials } from "./Level";


export function BlockSpinner({
    geometry = boxGeometry,
    material = levelMaterials.obstacle,
    position = [0, 0, 0],
}) {
    const [randomSpeed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1));
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * -randomSpeed, 0));
        obstacle.current?.setNextKinematicRotation(rotation);
    });

    return (
        <group position={position}>
            <RigidBody
                name="obstacle"
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}>
                <mesh
                    geometry={geometry}
                    material={material}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}
