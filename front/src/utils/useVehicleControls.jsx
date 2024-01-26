import { useEffect, useState } from "react";
import { socket } from "../Scene.jsx";

export const useVehicleControls = (vehicleApi, chassisApi, id) => {
    const [controls, setControls] = useState({});
    
    useEffect(()=>{
        if(socket.id === id){
            const KeDownPressHandler = (e) => {
                setControls((controls) => ({ 
                    ...controls, [e.key]: true 
                }));
                console.log('Down',e)
            }
            const KeUpPressHandler = (e) => {
                setControls((controls) => ({ 
                    ...controls, [e.key]: false,
                }));
                console.log('Up',e)
            }
            
                window.addEventListener('keydown', KeDownPressHandler);
                window.addEventListener('keyup', KeUpPressHandler);
            
            return () => {
                window.removeEventListener('keydown', KeDownPressHandler);
                window.removeEventListener('keyup', KeUpPressHandler);
            }
        }
    },[])

    useEffect(() => {
        if (controls.w) {
            vehicleApi.applyEngineForce(120, 2);
            vehicleApi.applyEngineForce(120, 3);
        } else if (controls.s) {
            vehicleApi.applyEngineForce(-120, 2);
            vehicleApi.applyEngineForce(-120, 3);
        } else {
            vehicleApi.applyEngineForce(0, 2);
            vehicleApi.applyEngineForce(0, 3);
        }

        if (controls.a) {
            vehicleApi.setSteeringValue(-0.1, 0);
            vehicleApi.setSteeringValue(-0.1, 1);
            vehicleApi.setSteeringValue(0.35, 2);
            vehicleApi.setSteeringValue(0.35, 3);
           
        } else if (controls.d) {
            vehicleApi.setSteeringValue(0.1, 0);
            vehicleApi.setSteeringValue(0.1, 1);
            vehicleApi.setSteeringValue(-0.35, 2);
            vehicleApi.setSteeringValue(-0.35, 3);
        } else {
          for (let i = 0; i < 4; i++) {
            vehicleApi.setSteeringValue(0, i);
          }
        }

    }, [controls, vehicleApi, chassisApi]);

    return controls;
}