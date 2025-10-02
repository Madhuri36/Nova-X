import * as THREE from "three";
import { useMemo } from "react";

import { BlockStart } from "./BlockStart";
import { BlockEnd } from "./BlockEnd";
import { BlockLimbo } from "./BlockLimbo";
import { BlockAxe } from "./BlockAxe";
import { Walls } from "./Walls";
import { BlockSpinner } from "./BlockSpinner";

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export const levelMaterials = {
    floor1: new THREE.MeshStandardMaterial({ color: "limegreen" }),
    floor2: new THREE.MeshStandardMaterial({ color: "greenyellow" }),
    obstacle: new THREE.MeshStandardMaterial({ color: "mediumpurple" }),
    wall: new THREE.MeshStandardMaterial({ color: "stagegrey" }),
};

export function Level({ count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe] }) {
    const blocks = useMemo(
        () => Array.from({ length: count }, () => types[Math.floor(Math.random() * types.length)]),
        [count, types]
    );
    return (
        <>
            <BlockStart position={[0, 0, 0]} />

            {blocks.map((Block, i) => (
                <Block key={i} position={[0, 0, (i + 1) * -4]} />
            ))}

            <BlockEnd position={[0, 0, -(count + 1) * 4]} />
            <Walls length={count + 2} />
        </>
    );
}