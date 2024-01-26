const DummyCarBody = (props) => {
    const { width, height, front } = props;
    
    return(
        <mesh>
            <boxGeometry args={[width, height, front]}/>
            <meshBasicMaterial color={props.color}/>
        </mesh>
    )
}

export default DummyCarBody;