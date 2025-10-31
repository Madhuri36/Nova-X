import { useEffect, useState } from "react";
import useGame from "../stores/useGame";
import { BlockStart } from "./BlockStart";
import { BlockEnd } from "./BlockEnd";

import * as THREE from "three";
import { Floor } from "./Floor";

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export const levelMaterials = {
    accentFloor: new THREE.MeshStandardMaterial({ color: "#336D82" }),
    floor: new THREE.MeshStandardMaterial({ color: "#69868e" }),
    obstacle: new THREE.MeshStandardMaterial({ color: "mediumpurple" }),
    lava: new THREE.MeshStandardMaterial({ color: "#FF6600" }),
};

export function Level() {
    let positionZ = 0;
    let holisticFloor = 0;

    const updateLevelLength = useGame((state) => state.updateLevelLength);
    const currentLevel = useGame((state) => state.currentLevel);
    const finalLevelLength = useGame((state) => state.finalLevelLength);
    const finalConfig = useGame.getState().config;

    const finalBlocks = finalConfig[currentLevel]?.finalBlocks;
    const levelLength = finalConfig[currentLevel]?.finalLength;

    useEffect(() => {
        updateLevelLength(levelLength);
    }, [levelLength]);

    return (
        <>
            <BlockStart position={[0, 0, finalLevelLength]} key={finalLevelLength} />

            {finalBlocks.map(({ Component, isSpecialBlock, isLongerBlock }, i) => {
                let prevHolisticFloor = holisticFloor;
                const isLastBlock = finalBlocks.length - 1 === i;

                !isSpecialBlock ? (holisticFloor += 1) : (holisticFloor = 0);
                prevHolisticFloor =
                    !isSpecialBlock && isLastBlock ? holisticFloor : prevHolisticFloor;

                const needAddFloor =
                    (prevHolisticFloor > 0 && holisticFloor === 0) ||
                    (isLastBlock && !isSpecialBlock);

                const fixFloorPosition = !isSpecialBlock && isLastBlock ? -4 : 0;
                const floorOffset = isLongerBlock ? 4 : 2;
                const blockPositionZ = isLongerBlock ? positionZ - 6 : positionZ - 4;

                positionZ += isLongerBlock ? -8 : -4;

                return (
                    <group key={Date.now() + i}>
                        <Component position={[0, 0, blockPositionZ + finalLevelLength]} />
                        {needAddFloor && (
                            <Floor
                                scale={[4, 0.2, 4 * prevHolisticFloor]}
                                position={[
                                    0,
                                    -0.1,
                                    blockPositionZ +
                                        finalLevelLength +
                                        (4 * prevHolisticFloor) / 2 +
                                        floorOffset +
                                        fixFloorPosition,
                                ]}
                            />
                        )}
                    </group>
                );
            })}
            <BlockEnd
                position={[0, 0, positionZ - 4 + finalLevelLength]}
                key={positionZ - 4 + finalLevelLength}
            />
        </>
    );
}
