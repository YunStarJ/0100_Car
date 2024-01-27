import { useBox, useCompoundBody, useRaycastVehicle } from "@react-three/cannon";
import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import DummyCarBody from "./dummy/DummyCarBody";
import DummyWheel from "./dummy/DummyWheel";
import { useControls } from "leva";
import { useWheels } from "./utils/useWheels";
import { useVehicleControls } from "./utils/useVehicleControls";
import { Vector3 } from "three";
import { socket } from "./Scene.jsx";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
// import useFollowCam from "./utils/useFollowCam";
import { Object3D } from 'three'


const Car = (props) => {
  const worldPosition = useMemo(() => new Vector3(), [])

  const chassisBodyValue = useControls('chassisBody', {
    width: { value: 0.16, min: 0, max: 1, },
    height: { value: 0.12, min: 0, max: 1, },
    front: { value: 0.17, min: 0, max: 1, },
  })
  // 위치 초기값
  const position = [0, 0.1, 0];

  let width, height, front, mass, wheelRadius;

  width = 0.16;
  height = 0.12;
  front = 0.17;
  wheelRadius = 0.05;
  mass = 150;

  const chassisBodyArgs = [width, height, front * 2];

  const [chassisBody, chassisApi] = useCompoundBody(
    () => ({
      position,
      mass: mass,
      rotation: [0, Math.PI, 0],
      shapes: [
        {
          args: chassisBodyArgs,
          position: [0, 0, 0],
          type: "Box"
        },
        {
          args: [width, height, front],
          position: [0, height, 0],
          type: "Box",
        },
      ],
    }),
    useRef(null)
  );

  const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    useRef(null),
  );

  useVehicleControls(vehicleApi, chassisApi, props.player.id)

  const body = useRef();

  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

// Back-View 카메라
useFrame((state, delta) => {
  if (socket.id === props.player.id) {
      const worldQuaternion = new THREE.Quaternion();  // Quaternion 인스턴스 생성

    const bodyPosition = chassisBody.current.getWorldPosition(new THREE.Vector3());
    const bodyRotation = chassisBody.current.getWorldQuaternion(worldQuaternion);

    // 카메라의 상대 위치 (자동차 뒷부분에서의 상대 위치)
    const relativeCameraPosition = new THREE.Vector3(0, 0.55, 0.65);

    // 카메라의 전역 위치 계산
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(relativeCameraPosition);
    cameraPosition.applyQuaternion(bodyRotation); // 카메라 위치를 자동차의 회전에 따라 변환
    cameraPosition.add(bodyPosition); // 카메라 위치를 자동차 위치에 더함

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);

    // 카메라가 항상 자동차의 뒷부분을 바라보도록 설정
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;
    state.camera.lookAt(cameraTarget);
  }
})

// 철구형 카메라
  // useFrame((state, delta)=>{
  //   // makeFollowCam()
  //   if (socket.id === props.player.id) {
  //     const bodyPosition = chassisBody.current.getWorldPosition(worldPosition);

  //     const cameraPosition = new THREE.Vector3();
  //     cameraPosition.copy(bodyPosition);
  //     cameraPosition.z += 2.25;
  //     cameraPosition.y += 0.65;

  //     const cameraTarget = new THREE.Vector3();
  //     cameraTarget.copy(bodyPosition);
  //     cameraTarget.y += 0.25;

  //     smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
  //     smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

  //     state.camera.position.copy(smoothedCameraPosition);
  //     state.camera.lookAt(smoothedCameraTarget);
  //   }
  // })

  return (
    <group ref={body}>
      <group ref={vehicle}>
        <group ref={chassisBody}>
          <DummyCarBody width={chassisBodyValue.width} height={chassisBodyValue.height} front={chassisBodyValue.front * 2} color={props.player.color} />
        </group>
        <DummyWheel wheelRef={wheels[0]} radius={wheelRadius} />
        <DummyWheel wheelRef={wheels[1]} radius={wheelRadius} />
        <DummyWheel wheelRef={wheels[2]} radius={wheelRadius} />
        <DummyWheel wheelRef={wheels[3]} radius={wheelRadius} />
      </group>
    </group>
  )
}

export default Car