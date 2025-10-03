import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import Player from "./Player";

export default function Experience() {
  return (
    <>
      {/* Camera controls */}
      <OrbitControls makeDefault />
      {/* Rapier physics world */}
      <Physics>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
