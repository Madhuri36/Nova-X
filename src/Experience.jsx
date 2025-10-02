import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import { Physics } from "@react-three/rapier";
export default function Experience() {
  return;
  <>
    {" "}
    <OrbitControls makeDefault />{" "}
    <Physics debug>
      {" "}
      <Lights /> <Level />{" "}
    </Physics>{" "}
  </>;
}
