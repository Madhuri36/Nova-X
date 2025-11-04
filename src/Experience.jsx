import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useControls } from "leva";
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import useGame from "./stores/useGame";

import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import Player from "./Player.jsx";
import FinishScene from "./FinishScene.jsx";

import { useThree } from '@react-three/fiber';

export default function Experience() {
    const spaceSphereRef = useRef();
    
    const [phase, setPhase] = useState(null);
    const [isConfigReady, setIsConfigReady] = useState(false);

    const blocksSeed = useGame((state) => state.blocksSeed);
    const setLevels = useGame((state) => state.setLevels);

    const currentTheme = useGame((state) => state.theme);
    const toggleTheme = useGame((state) => state.toggleTheme);
    const bgColor = useGame((state) => (state.theme === "dark" ? "#191920" : "#afe0dd"));

    const config = useGame((state) => state.config);
    const ballsCount = useMemo(() => 100, []);

    // Load space texture
    const spaceTexture = useTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/96252/space.jpg');
    const { scene } = useThree();
    
    // Disable fog
    useEffect(() => {
        scene.fog = null;
    }, [scene]);
    
    // Configure texture wrapping and repeat
    spaceTexture.wrapS = THREE.RepeatWrapping;
    spaceTexture.wrapT = THREE.RepeatWrapping;
    spaceTexture.repeat.set(5, 3);

    // Rotate the space sphere slowly and make it follow camera
    useFrame((state) => {
        if (spaceSphereRef.current) {
            spaceSphereRef.current.rotation.y += 0.0005;
            spaceSphereRef.current.position.copy(state.camera.position);
        }
    });

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

            {/* Space Background Sphere - follows camera */}
            <mesh ref={spaceSphereRef}>
                <sphereGeometry args={[150, 32, 32]} />
                <meshBasicMaterial 
                    map={spaceTexture} 
                    side={THREE.BackSide}
                    fog={false}
                />
            </mesh>

            <Physics>
                <Lights isFinish={phase === "finalized"} />
                {phase !== "finalized" && (
                    <>
                        {/* Invisible ground plane - only for physics */}
                        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[500, 500]} />
                            <meshBasicMaterial 
                                transparent 
                                opacity={0} 
                                toneMapped={false} 
                            />
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