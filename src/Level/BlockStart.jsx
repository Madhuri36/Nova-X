import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

export function BlockStart({
    geometry = boxGeometry,
    material = levelMaterials.floor1,
    position = [0, 0, 0],
}) {
    return (
        <group position={position}>
            <Floor geometry={geometry} material={material} />
        </group>
    );
}