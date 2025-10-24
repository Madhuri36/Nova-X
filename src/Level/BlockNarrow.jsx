import { useMemo } from "react";
import { Floor } from "./Floor";

export function BlockNarrow({ position = [0, 0, 0] }) {
    const randomX = useMemo(() => Math.random() * 2 - 1, []);
    return (
        <group position={[randomX, position[1], position[2]]}>
            <Floor scale={[0.5, 0.2, 4]} />
        </group>
    );
}
