import { RigidBody } from "@react-three/rapier";
import { boxGeometry, levelMaterials } from "./Level";

export function Floor({
    geometry = boxGeometry,
    material = levelMaterials.floor,
    position = [0, -0.1, 0],
    scale = [4, 0.2, 4],
    restitution = 0.2,
    friction = 0,
}) {
    return (
        <RigidBody type="fixed" restitution={restitution} friction={friction} name="Floor">
            <mesh
                geometry={geometry}
                material={material}
                position={position}
                receiveShadow
                scale={scale}
            /> 
        </RigidBody>
    );
}
