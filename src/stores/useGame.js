import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { BlockLimbo } from "../Level/BlockLimbo";
import { BlockAxe } from "../Level/BlockAxe";
import { BlockSpinner } from "../Level/BLockSpinner";
import { BlockLava } from "../Level/BlockLava";
import { BlockNarrow } from "../Level/BlockNarrow";
import { BlockSeesaw } from "../Level/BlockSeesaw";

import { playLoseLifeSound, playNextLevelSound, playLastFailSound, stopAllSounds } from "../sounds";

export const blockFunctions = {
    BlockSpinner: {
        component: BlockSpinner,
        length: 4,
        isSpecialBlock: false,
        isLongerBlock: false,
    },
    BlockLimbo: {
        component: BlockLimbo,
        length: 4,
        isSpecialBlock: false,
        isLongerBlock: false,
    },
    BlockAxe: {
        component: BlockAxe,
        length: 4,
        isSpecialBlock: false,
        isLongerBlock: false,
    },
    BlockLava: {
        component: BlockLava,
        length: 4,
        isSpecialBlock: true,
        isLongerBlock: false,
    },
    BlockNarrow: {
        component: BlockNarrow,
        length: 4,
        isSpecialBlock: true,
        isLongerBlock: false,
    },
    BlockSeesaw: {
        component: BlockSeesaw,
        length: 8,
        isSpecialBlock: true,
        isLongerBlock: true,
    },
};

const initialConfig = {
    1: {
        blocks: 6,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe"],
        finalLength: 0,
        finalBlocks: [],
        
    },
    2: {
        blocks: 8,
        types: ["BlockAxe", "BlockLava", "BlockSpinner", "BlockLava"],
        finalLength: 0,
        finalBlocks: [],
        
    },
    3: {
        blocks: 10,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe", "BlockNarrow", "BlockLava"],
        finalLength: 0,
        finalBlocks: [],
        
    },
    4: {
        blocks: 12,
        types: [
            "BlockSpinner",
            "BlockLimbo",
            "BlockAxe",
            "BlockNarrow",
            "BlockLava",
            "BlockSeesaw",
        ],
        finalLength: 0,
        finalBlocks: [],
        
    },
    5: {
        blocks: 20,
        types: [
            "BlockSpinner",
            "BlockLimbo",
            "BlockAxe",
            "BlockNarrow",
            "BlockNarrow",
            "BlockNarrow",
            "BlockLava",
            "BlockLava",
            "BlockLava",
            "BlockSeesaw",
            "BlockSeesaw",
            "BlockSeesaw",
        ],
        finalLength: 0,
        finalBlocks: [],
        
    },
};

const calcNewConfig = () => {
    const newConfig = JSON.parse(JSON.stringify(initialConfig));
    Object.entries(newConfig).forEach(([key, configKey]) => {
        const { blocks, types } = configKey;
        if (!blocks || !types?.length) return;
        Array.from({ length: blocks }, () => {
            const block = blockFunctions[types[Math.floor(Math.random() * types.length)]];

            newConfig[key].finalLength += block.length;
            newConfig[key].finalBlocks.push({
                Component: block.component,
                isSpecialBlock: block.isSpecialBlock || false,
                isLongerBlock: block.isLongerBlock || false,
            });
        });
    });

    const finalLevelLength = newConfig[Object.keys(newConfig).length].finalLength;
    return { newConfig, finalLevelLength };
};

const initialCalcConfig = calcNewConfig();

export default create(
    subscribeWithSelector((set) => {
        return {
            blocksSeed: 0,

            // Sound
            soundEnabled: localStorage.getItem("soundEnabled") === "true",
            toggleSound: () =>
                set((state) => {
                    const nextValue = !state.soundEnabled;
                    if (!nextValue) stopAllSounds();
                    localStorage.setItem("soundEnabled", nextValue);
                    return { soundEnabled: nextValue };
                }),

            // Theme
            theme: localStorage.getItem("gameTheme") ?? "dark",
            toggleTheme: (val) =>
                set((state) => {
                    localStorage.setItem("gameTheme", val);
                    return { theme: val };
                }),

            // Level length
            finalLevelLength: initialCalcConfig.finalLevelLength,
            levelLength: 0,
            updateLevelLength: (val) =>
                set((state) => {
                    return { levelLength: val };
                }),
            updateFinalLevelLength: (val) =>
                set((state) => {
                    return { finalLevelLength: val };
                }),

            // Burning
            isBurning: false,
            startBurning: (val) => set({ isBurning: true }),
            endBurning: (val) => set({ isBurning: false }),

            // Levels
            currentLevel: 1,
            levels: 0,

            setLevels: (val) => set({ levels: val }),

            nextLevel: () =>
                set((state) => {
                    if (state.soundEnabled) playNextLevelSound();
                    return state.phase === "ready"
                        ? {
                              currentLevel:
                                  state.currentLevel + 1 <= state.levels
                                      ? state.currentLevel + 1
                                      : 1,
                          }
                        : {};
                }),

            // Lives
            lives: 3,
            maxLives: 3,

            // Phases
            phase: "ready",
            isLastTry: false,

            start: () => set((state) => (state.phase === "ready" ? { phase: "playing" } : {})),
            restart: () =>
                set((state) => {
                    const config = calcNewConfig();
                    return state.phase !== "ready"
                        ? {
                              phase: "ready",
                              blocksSeed: Math.random(),
                              config: config.newConfig,
                              finalLevelLength: config.finalLevelLength,
                          }
                        : {};
                }),
            end: () => set((state) => (state.phase === "playing" ? { phase: "ended" } : {})),
            fail: () =>
                set((state) => {
                    return state.phase === "playing" ? { phase: "failed" } : {};
                }),
            finish: () => set((state) => (state.phase !== "finished" ? { phase: "finished" } : {})),
            final: () => set((state) => (state.phase === "finished" ? { phase: "finalized" } : {})),

            updateLivesOnFail: () =>
                set((state) => {
                    const nextLives = state.lives - 1 < 0 ? state.maxLives : state.lives - 1;
                    const isLastTry = nextLives === 0;
                    return isLastTry
                        ? { lives: nextLives, isLastTry: true }
                        : { lives: nextLives, isLastTry: false };
                }),

            updateLevelOnFail: () =>
                set((state) => {
                    if (state.isLastTry && state.soundEnabled) {
                        playLastFailSound();
                    } else if (state.soundEnabled) {
                        playLoseLifeSound();
                    }
                    const nextLevel = state.isLastTry ? 1 : state.currentLevel;
                    const nextLives =
                        nextLevel === 1 && state.isLastTry ? state.maxLives : state.lives;
                    return { currentLevel: nextLevel, lives: nextLives };
                }),

            // Config
            config: initialCalcConfig.newConfig,
        };
    })
);
