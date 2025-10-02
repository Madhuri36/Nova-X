import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function Player() {
    const body = useRef();
    const [subscribeKeys, getKeys] = useKeyboardControls();
    const { rapier, world } = useRapier();

    const jump = () => {
        const origin = body.current.translation();
        origin.y -= 0.31;
        const direction = { x: 0, y: -1, z: 0 };

        const ray = new rapier.Ray(origin, direction);
        const hit = world.castRay(ray, 10, true);
        if (hit.timeOfImpact < 0.15) body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
    };

    useEffect(() => {
        const unsubscribeJump = subscribeKeys(
            //selector
            (state) => state.jump,
            //what to do
            (val) => {
                if (val) jump();
            }
        );

        return () => {
            unsubscribeJump();
        };
    }, []);

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward, jump } = getKeys();
        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        }
        if (rightward) {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }
        if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        }
        if (leftward) {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }

        body.current?.applyImpulse(impulse);
        body.current?.applyTorqueImpulse(torque);
    });

    return (
        <RigidBody
            ref={body}
            canSleep={false}
            position={[0, 0.5, 0]}
            colliders="ball"
            restitution={0.2}
            friction={1}
            linearDamping={1}
            angularDamping={1}>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color="orangered" />
            </mesh>
        </RigidBody>
    );
}