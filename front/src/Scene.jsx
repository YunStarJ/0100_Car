import { Canvas } from "@react-three/fiber";
import { Ground } from "./components/Ground";
import { Physics, Debug, useBox } from "@react-three/cannon";
import Car from "./Car";
import DummyBall from "./dummy/DummyBall";
import DummyBox from "./dummy/DummyBox";
import DummyWall from "./dummy/DummyWall";
import io from "socket.io-client"
import { useState, useEffect, useRef, React } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";


export const socket = io("http://localhost:5000")
function Scene() {
  // const [players] = useAtom(PlayerAtom)
  const [players, setPlayers] = useState([])
  useEffect(() => {
    
    function onPlayers(backEndPlayers){ 
      const playersArray = Object.values(backEndPlayers);
      setPlayers(playersArray)
    }

    return (() =>{
      socket.on("updatePlayers", onPlayers)
    })
  })

  return (
    <>
      {/* <SocketManager/> */}
      <Canvas camera={{ fov:75, position:[1.5, 8, 4]}}>
        <ambientLight/>
        <directionalLight position={[0, 5, 5]} />
        <Physics gravity={[0, -2.6, 0]} allowSleep>
          <Debug>
            {
              players.map((player) => (
                  <Car key={player.id} player={player}/>
              ))
            } 
            <DummyBall position={[0,0.2,-2]} args={[0.15]}/>
            <DummyBox position={[1,0.2,-2]} args={[0.2,0.2,0.2]}/>
            <DummyBox position={[-1,0.2,1.5]} args={[0.2,0.4,0.2]} type={"Static"}/>
            <DummyWall position={[5,0.5,0]} args={[1,1,10]} />
            <Ground rotation={[-Math.PI/2,0,0]}/>
          </Debug>
        </Physics>
      </Canvas>
    </>
  );
}

export default Scene;
