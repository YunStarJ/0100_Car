import { useAtom, atom } from "jotai"
import { useEffect } from "react"
import {io} from "socket.io-client"

export const socket = io("http://localhost:3000")
export const PlayerAtom = atom([])

export const SocketManager = ()=>{
  const [_players, setPlayers] = useAtom(PlayerAtom)
  
  useEffect(()=>{
    function onPlayers(value){ 
      console.log(value);
      setPlayers(value)
    }

    socket.on("updatePlayers", onPlayers)
    socket.on("hello", () => {
        console.log("hello");
    })
    return (() => {

    })
  })
  
}