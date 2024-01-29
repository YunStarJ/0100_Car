import React from 'react'
import { usePlane } from "@react-three/cannon";
import { Bridge } from './Bridge';

export function Ground(props) {

  const [meshRef] = usePlane(
    () => ({ args: [30, 30], mass: 1, type: 'Static', ...props}),
  )

  return (
    <mesh
    {...props}
    ref={meshRef} 
    receiveShadow
    >
    <planeGeometry args={[30, 30]} />
    <meshStandardMaterial color="white" opacity={0}/>
    <Bridge />
  </mesh>
  )
}