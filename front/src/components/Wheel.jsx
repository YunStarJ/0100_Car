import { useGLTF } from "@react-three/drei";

useGLTF.preload(`/assets/models/PoliceCar.glb`)

export const Wheel = ({ wheelRef, radius, lefSide }) => {
  const { nodes, materials } = useGLTF(`/assets/models/PoliceCar.glb`)

  return(
    <group ref={wheelRef} scale={0.5}>
      <group rotation={lefSide ? [0, -Math.PI, 0 ] :[ 0, 0, 0] }>
        {/* <mesh geometry={nodes.PUSHILIN_Police_car_Cube006.geometry} material={materials.police_car} rotation={[-1.576, 0, 0]} scale={0.32} />            */}
      </group>
    </group>
  );
};
