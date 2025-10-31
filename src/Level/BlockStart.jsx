import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import useGame from "../stores/useGame";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

export function BlockStart({
    geometry = boxGeometry,
    material = levelMaterials.floor,
    position = [0, 0, 0],
}) {
    const level = useGame((state) => state.currentLevel);
    const phase = useGame((state) => state.phase);
    const [textOpacity, setTextOpacity] = useState(1);

    useFrame((state, delta) => {
        if (phase === "ready") setTextOpacity(1);

        if (phase === "playing") {
            setTextOpacity(textOpacity - delta * 2);
            if (textOpacity <= 0) setTextOpacity(0);
        }
    });

    return (
        <>
            <Float
                floatIntensity={0.5}
                rotationIntensity={0.25}
                position={[position[0], position[1], position[2] + 0.2]}>
                {level === 1 &&
                    ["BALL", "RUN"].map((text, index) => (
                        <Text
                            key={text}
                            font="./Days.woff"
                            maxWidth={0.5}
                            lineHeight={0.75}
                            textAlign="left"
                            position={[index === 0 ? -0.85 : 0.75, 0.4, 0]}
                            rotation-y={index === 0 ? 0.5 : -0.5}
                            scale={0.35}
                            fillOpacity={textOpacity}>
                            {text}
                            <meshBasicMaterial toneMapped={false} />
                        </Text>
                    ))}

                {level !== 1 && (
                    <Text
                        font="./Days.woff"
                        maxWidth={5}
                        lineHeight={0.75}
                        textAlign="left"
                        position={[0.9, 0.4, 0]}
                        rotation-y={-0.25}
                        scale={0.25}
                        fillOpacity={textOpacity}>
                        LEVEL {level}
                        <meshBasicMaterial toneMapped={false} />
                    </Text>
                )}
            </Float>
            <group position={position}>
                <Floor geometry={geometry} material={material} />
            </group>
        </>
    );
}
