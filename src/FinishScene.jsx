import { RigidBody, BallCollider } from "@react-three/rapier";
import { Instance, Instances } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";
import { useLoader } from "@react-three/fiber";

const wall = new THREE.BoxGeometry(0.2, 2, 4);
const planeShadow = new THREE.PlaneGeometry(0.9, 0.6);

export default function FinishScene({ ballsData }) {
    const itemsRef = useRef([]);
    const instances = useRef();

    const [outBoxBalls, setOutBoxBalls] = useState(new Map());

    const bgColor = useGame((state) => (state.theme === "dark" ? "#20273b" : "#008db0"));

    const zPosition = useMemo(() => 2, []);
    const bakedShadow = useLoader(THREE.TextureLoader, "./textures/simpleShadow.jpg");

    const planeShadowMaterial = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                alphaMap: bakedShadow,
            }),
        [bakedShadow]
    );
    const wallMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: bgColor,
            }),
        [bgColor]
    );

    const handleBallsSleep = useCallback(() => {
        itemsRef.current.forEach((item) => {
            item.setBodyType(1);
            item.sleep();
        });
    }, [itemsRef]);

    useEffect(() => {
        const timeout = setTimeout(handleBallsSleep, 5000);
        return () => clearTimeout(timeout);
    }, [handleBallsSleep]);

    const handleCollisionEnter = useCallback((e) => {
        if (e.colliderObject.name.includes("ball")) {
            setOutBoxBalls((prev) => new Map(prev).set(e.colliderObject.name, e.colliderObject));
        }
    }, []);

    return (
        <>
            <group position={[0, -10, -zPosition]}>
                <RigidBody
                    name="floor"
                    type="fixed"
                    friction={0.5}
                    restitution={0.2}
                    onCollisionEnter={handleCollisionEnter}
                    position-z={-zPosition}>
                    <mesh position={[0, 0, 0]} receiveShadow>
                        <boxGeometry args={[2000, 0.1, 2000]} />
                        <meshStandardMaterial color={bgColor} />
                    </mesh>
                </RigidBody>

                <group>
                    <RigidBody name="obstacle" type="fixed" friction={0.2} position-z={-zPosition}>
                        <mesh
                            castShadow
                            position={[-2, 1, 0]}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                        <mesh position={[2, 1, 0]} material={wallMaterial} geometry={wall}></mesh>
                        <mesh
                            castShadow
                            position={[0, 1, -1.9]}
                            rotation={[0, Math.PI / 2, 0]}
                            scale-z={0.95}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                        <mesh
                            position={[0, 1, 1.9]}
                            rotation={[0, Math.PI / 2, 0]}
                            scale-z={0.95}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                        <mesh
                            position={[0, 0.1, 0]}
                            rotation={[0, 0, Math.PI / 2]}
                            scale={[0.5, 1.9, 0.9]}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                    </RigidBody>

                    <Instances limit={1000} range={1000} ref={instances}>
                        <icosahedronGeometry args={[0.3, 1]} />
                        <meshStandardMaterial flatShading />
                        {ballsData.map(({ key, position, color }) => (
                            <RigidBody
                                name="floor"
                                key={key}
                                position-z={-zPosition}
                                friction={1}
                                linearDamping={1}
                                angularDamping={1}
                                userData={{ type: "ball" }}
                                ref={(el) => (itemsRef.current[key] = el)}>
                                <BallCollider
                                    args={[0.3]}
                                    position={position}
                                    name={"ball" + key}
                                />
                                <Instance color={color} position={position} rotation={[0, 0, 0]} />
                            </RigidBody>
                        ))}
                    </Instances>

                    <group position-z={0}>
                        {Array.from(outBoxBalls.values()).map((item, i) => {
                            const worldPosition = new THREE.Vector3();
                            item.getWorldPosition(worldPosition);
                            return (
                                <mesh
                                    key={i}
                                    position-x={worldPosition.x - 0.2}
                                    position-z={worldPosition.z + zPosition}
                                    position-y={0.06 + worldPosition.x * 0.001}
                                    rotation-z={-0.5}
                                    rotation-x={-Math.PI * 0.5}
                                    material={planeShadowMaterial}
                                    geometry={planeShadow}
                                />
                            );
                        })}
                    </group>
                </group>
            </group>
        </>
    );
}
