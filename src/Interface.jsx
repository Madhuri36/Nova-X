import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useState } from "react";

import useGame from "./stores/useGame";
import Lives from "./Lives";
import { sounds } from "./sounds";

export default function Interface() {
    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const jump = useKeyboardControls((state) => state.jump);
    const goNext = useKeyboardControls((state) => state.goNext);

    const soundEnabled = useGame((state) => state.soundEnabled);
    const toggleSound = useGame((state) => state.toggleSound);

    const restart = useGame((state) => state.restart);
    const phase = useGame((state) => state.phase);
    const nextLevel = useGame((state) => state.nextLevel);
    const updateLevelOnFail = useGame((state) => state.updateLevelOnFail);

    const [isLoaded, setIsLoaded] = useState(false);

    const goToTheNextLevel = () => {
        restart();
        if (phase === "ended") nextLevel();
        if (phase === "failed") updateLevelOnFail();
    };

    useEffect(() => {
        if (goNext && (phase === "ended" || phase === "failed")) goToTheNextLevel();
    }, [goNext]);

    useEffect(() => {
        let isCancelled = false;
        let timer;

        const soundPromises = Object.keys(sounds).map((key) => {
            return new Promise((resolve) => {
                sounds[key].addEventListener("canplaythrough", resolve, { once: true });
            });
        });

        const waitMinimumTime = new Promise((resolve) => {
            timer = setTimeout(() => {
                resolve();
            }, 3000);
        });

        Promise.all([...soundPromises, waitMinimumTime])
            .then(() => {
                if (!isCancelled) {
                    setIsLoaded(true);
                }
            })
            .catch((error) => {
                console.error("Ошибка при загрузке аудио:", error);
            });

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [sounds]);

    return (
        <>
            <div className="interface">
                {/* Lives */}
                <div className="interface__lives">
                    <Lives />
                </div>

                {/* Restart */}
                <div
                    className={`interface__restart ${
                        (phase === "ended" || phase === "failed") && "active"
                    }`}
                    onClick={goToTheNextLevel}>
                    {phase === "failed" ? "RETRY" : "NEXT"}
                </div>

                {/* Controls */}
                <div className="interface__controls">
                    <div className="raw">
                        <div className={`key ${forward && "active"}`}></div>
                    </div>
                    <div className="raw">
                        <div className={`key ${leftward && "active"}`}></div>
                        <div className={`key ${backward && "active"}`}></div>
                        <div className={`key ${rightward && "active"}`}></div>
                    </div>
                    <div className="raw">
                        <div className={`key large ${jump && "active"}`}></div>
                    </div>
                </div>
            </div>
            <div className={`loading + ${isLoaded && " loaded"}`}>
                <div className={"loading__text"}></div>
            </div>
            <div className={`sound ${soundEnabled && "active"} `} onClick={toggleSound}></div>
        </>
    );
}
