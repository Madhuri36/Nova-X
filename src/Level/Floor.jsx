import { boxGeometry, levelMaterials } from "./Level";

export function Floor({
    geometry = boxGeometry,
    material = levelMaterials.floor2,
    position = [0, -0.1, 0],
}) {
    return (
        <mesh
            geometry={geometry}
            material={material}
            position={position}
            receiveShadow
            scale={[4, 0.2, 4]}
        />
    );
}