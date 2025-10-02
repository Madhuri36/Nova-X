import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

export function BlockEnd({geometry = boxGeometry, material = levelMaterials.floor1, position = [0, 0, 0] }) {
    const coin = useRef();
    const { scene } = useGLTF(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/coin/model.gltf"
    );

    scene.children.forEach((mesh) => (mesh.castShadow = true));

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * 1.5, 0));
        coin.current?.setNextKinematicRotation(rotation);
    });
    return (
        <group position={position}>
            <Floor geometry={geometry} material={material}  position={[0, 0, 0]}/>
            <RigidBody
                type="kinematicPosition"
                ref={coin}
                colliders="hull"
                restitution={0.2}
                friction={0}>
                <primitive object={scene} position-y={1} />
            </RigidBody>
        </group>
    );
}