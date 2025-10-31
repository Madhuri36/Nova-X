import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

import { boxGeometry, levelMaterials } from "./Level";

export function BlockAxe({
    geometry = boxGeometry,
    material = levelMaterials.obstacle,
    position = [0, 0, 0],
}) {
    const [randomSpeed] = useState(() => Math.random() + 0.6);
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const positionX = Math.sin(time * randomSpeed + timeOffset) * 1.25;
        obstacle.current?.setNextKinematicTranslation({
            x: position[0] + positionX,
            y: position[1] + 0.8,
            z: position[2],
        });
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
                    scale={[1.5, 1.5, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}
