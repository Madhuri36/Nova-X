import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useControls } from "leva";

import useGame from "./stores/useGame";

import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import Player from "./Player.jsx";
import FinishScene from "./FinishScene.jsx";

export default function Experience() {
    const [phase, setPhase] = useState(null);
    const [isConfigReady, setIsConfigReady] = useState(false);

    const blocksSeed = useGame((state) => state.blocksSeed);
    const setLevels = useGame((state) => state.setLevels);

    const currentTheme = useGame((state) => state.theme);
    const toggleTheme = useGame((state) => state.toggleTheme);
    const bgColor = useGame((state) => (state.theme === "dark" ? "#191920" : "#afe0dd"));

    const config = useGame((state) => state.config);
    const ballsCount = useMemo(() => 100, []);

    useControls({
        theme: {
            value: currentTheme,
            options: ["dark", "light"],
            onChange: (val) => toggleTheme(val),
        },
    });

    const ballsData = useMemo(() => {
        const data = [];

        for (let ball = 0; ball < ballsCount; ball++) {
            const position = [
                Math.random() * 3.5 - 1.75,
                1 + ball * 0.1,
                Math.random() * 3.5 - 1.75,
            ];
            const hue = Math.random() * 360;
            data.push({
                key: ball,
                position,
                color: `hsl(${hue}, 50%, 50%)`,
            });
        }
        return data;
    }, []);

    const handlePhaseChange = useCallback(
        (value) => {
            if (value === "finalized") setPhase(value);
        },
        [phase]
    );

    useEffect(() => {
        const length = Object.keys(config).length;
        setLevels(length);
        setIsConfigReady(true);
    }, []);

    useEffect(() => {
        const unsubscribePhase = useGame.subscribe((state) => state.phase, handlePhaseChange);
        return () => {
            unsubscribePhase();
        };
    }, [handlePhaseChange]);

    return (
        <>
            {/* <Perf position="top-left" /> */}
            <OrbitControls makeDefault />

            <color args={[bgColor]} attach="background" />

            <Physics>
                <Lights isFinish={phase === "finalized"} />
                {phase !== "finalized" && (
                    <>
                        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[500, 500]} />
                            <meshBasicMaterial color={bgColor} toneMapped={false} />
                        </mesh>
                        <Level />
                    </>
                )}

                {isConfigReady && <FinishScene ballsData={ballsData} />}

                <Player />
            </Physics>
        </>
    );
}
