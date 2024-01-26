import { Server } from "socket.io"

const io = new Server({
  cors: {
    origin: [ "http://15.164.215.83:3000","http://localhost:3000"]
  },
})

io.listen(5000)

const backEndPlayers = {}

io.on("connection", (socket)=>{
  console.log(`${socket.id} user connect`)
  
  // 접속시 socket.id
  backEndPlayers[socket.id] = {
    id: socket.id,
    position: [0, 0.1, 0],
    color: `hsl(${360 * Math.random()}, 100%, 50%)`
  }
  console.log(backEndPlayers);
  socket.emit("hello")
  // new player update
  io.emit('updatePlayers', backEndPlayers);

  // 자신의 키다운 이벤트를 상대에게 
  socket.on('keydown', ({ keycode, sequenceNumber }) => {
    backEndPlayers[socket.id].sequenceNumber = sequenceNumber
    switch (keycode) {
      case 'KeyW':
        console.log("상대가 w 누름");
        break

      case 'KeyA':
        console.log("상대가 a 누름");
        break

      case 'KeyS':
        console.log("상대가 a 누름");
        break

      case 'KeyD':
        console.log("상대가 a 누름");
        break
    }
  })
  // 접속 해제시 
  socket.on('disconnect', (reason) => {
    console.log(reason)
    console.log(socket.id);
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })
})