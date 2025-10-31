import { useMemo } from "react";
import useGame from "./stores/useGame";

const HeartIcon = ({ hidden }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="56"
        height="56"
        viewBox="0 0 32 32"
        className={hidden ? "hidden" : ""}
    >
        <path
            className={"background"}
            fill="#e57373"
            d="M30 8v10L17 30h-2L2 18V8l5-6h6l3 3 3-3h6z"
            data-original="#e57373"
        />
        <path
            className={"background"}
            fill="#f44336"
            d="M30 8v10L17 30h-2l-4.42-4.08c8.71-3.55 15.24-11.38 16.96-20.87z"
            data-original="#f44336"
        />
        <path
            d="M25.469 1h-6.883L16 3.586 13.414 1H6.531L1 7.638v10.8L14.609 31h2.781L31 18.438v-10.8zM29 17.563 16.609 29H15.39L3 17.563v-9.2L7.469 3h5.117L16 6.414 19.414 3h5.117L29 8.362z"
            fill="#fff"
        />
        <path d="M22.826 5.641 26 9.448V14h2V8.724l-3.637-4.365z" fill="#fff" />
    </svg>
);

export default function Lives() {
    const lives = useGame((state) => state.lives);
    const maxLives = useMemo(() => useGame.getState().maxLives, []);

    return (
        <>
           {Array.from({ length: maxLives }, (_, i) => (
                <HeartIcon key={i} hidden={lives < i + 1} />
            ))}
        </>
    );
}
