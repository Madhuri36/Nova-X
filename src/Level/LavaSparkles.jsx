import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const countSparkles = 40;
const largeSparklesCount = 15;
const smallSparklesCount = countSparkles - largeSparklesCount;
const blackColor = new THREE.Color("rgb(20%, 20%, 20%)");

const smallSparklesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: true,
});

const largeSparklesMaterial = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: true,
});

export function LavaSparkles({ position }) {
    const smallPointsRef = useRef();
    const largePointsRef = useRef();

    const createSparklesGeometry = (sparklesCount) => {
        const positions = new Float32Array(sparklesCount * 3);
        const colors = new Float32Array(sparklesCount * 3);
        const positionsArray = [];
        const colorArray = [];

        for (let i = 0; i < sparklesCount; i++) {
            const i3 = i * 3;

            const x = Math.random() * 0.7 - 0.35;
            const y = Math.random() * 0.5;
            const z = Math.random() * 0.7 - 0.35;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            positionsArray.push({ x, y, z });

            const color = new THREE.Color(`hsl(${i * 0.05 * (35 - 20) + 20}, 100%, 44.71%)`);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            colorArray.push({ r: color.r, g: color.g, b: color.b });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        return [geometry, positionsArray, colorArray];
    };

    const [smallGeometry, smallPositionsArray, smallColorArray] = useMemo(() => {
        return createSparklesGeometry(smallSparklesCount);
    }, [smallSparklesCount]);

    const [largeGeometry, largePositionsArray, largeColorArray] = useMemo(() => {
        return createSparklesGeometry(largeSparklesCount);
    }, [largeSparklesCount]);

    useFrame((state, delta) => {
        if (!smallPointsRef.current || !largePointsRef.current) return;

        const updateSparkles = (
            positions,
            colorsAttr,
            positionsArray,
            colorArray,
            speedMultiplier,
            resetHeight
        ) => {
            for (let i = 0; i < positions.count; i++) {
                const i3 = i * 3;

                positionsArray[i].y += delta * 0.02 * (i * speedMultiplier + 2);
                positions.array[i3 + 1] = positionsArray[i].y;

                if (positionsArray[i].y > resetHeight && colorArray[i].r > 0.2) {
                    colorArray[i].r = blackColor.r;
                    colorArray[i].g = blackColor.g;
                    colorArray[i].b = blackColor.b;

                    colorsAttr.array[i3] = blackColor.r;
                    colorsAttr.array[i3 + 1] = blackColor.g;
                    colorsAttr.array[i3 + 2] = blackColor.b;
                }

                if (positionsArray[i].y > resetHeight) {
                    const color = new THREE.Color(
                        `hsl(${Math.random() * (35 - 20) + 20}, 100%, 44.71%)`
                    );

                    colorArray[i].r = color.r;
                    colorArray[i].g = color.g;
                    colorArray[i].b = color.b;

                    colorsAttr.array[i3] = color.r;
                    colorsAttr.array[i3 + 1] = color.g;
                    colorsAttr.array[i3 + 2] = color.b;

                    positionsArray[i].y = 0;
                    positions.array[i3 + 1] = 0;
                }
            }

            positions.needsUpdate = true;
            colorsAttr.needsUpdate = true;
        };

        updateSparkles(
            smallPointsRef.current.geometry.attributes.position,
            smallPointsRef.current.geometry.attributes.color,
            smallPositionsArray,
            smallColorArray,
            1.1, 
            0.7, 
            blackColor
        );
     
        updateSparkles(
            largePointsRef.current.geometry.attributes.position,
            largePointsRef.current.geometry.attributes.color,
            largePositionsArray,
            largeColorArray,
            1.5, 
            0.8, 
            blackColor
        );
    });

    return (
        <group position={position} position-y={position.y + 0.2}>
            <points
                ref={smallPointsRef}
                geometry={smallGeometry}
                material={smallSparklesMaterial}
            />
            <points
                ref={largePointsRef}
                geometry={largeGeometry}
                material={largeSparklesMaterial}
            />
        </group>
    );
}
