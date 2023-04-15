const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
   //  methods: ['GET', 'POST'],
   //  allowedHeaders: ['my-custom-header'],
   //  credentials: true
  }
});

const rooms = {};

app.get('/', (req, res) => {
  res.send('API server is running');
});

io.on('connection', (socket) => {
   console.log('A user connected');

   // socket.on('joinRoom', room => {
   //    if (!rooms[room]) {
   //      rooms[room] = [];
   //    }
   //    rooms[room].push(socket.id);
   //    socket.join(rooms[room]);
      
   //    console.log('room1', room)
   //    console.log('room2', rooms[room])
   //    // console.log('room3', io.id)

   //  });

  socket.on('joinRoom', (room) => {
  if (!rooms[room]) {
    rooms[room] = [];
  }
  rooms[room].push(socket.id);
  socket.join(room); // room 변수를 전달하도록 수정
  console.log(`User ${socket.id} joined room ${room}`);
})

    
  socket.on('teamName', ({room, teamName}) => {
    console.log("teamName",teamName);
        console.log(`이름 Message received from ${socket.id} in room ${room}: ${teamName}`);
    io.to(room).emit('responseTeamName',{sender: socket.id , teamName})
  });

  socket.on('joinStep', ({room, joinStep}) => {
    console.log("joinStep",joinStep);
        console.log(`스텝 Message received from ${socket.id} in room ${room}: ${joinStep}`);
    io.to(room).emit('joinStep',{sender: socket.id , joinStep})
  });

  socket.on('joinReady', ({room, joinReady}) => {
    console.log("준비name",joinReady);
        console.log(`준비 Message received from ${socket.id} in room ${room}: ${joinReady}`);
    io.to(room).emit('joinReady',{sender: socket.id , joinReady})
  });

// socket.on('gameScore',  ({room, data}) => {
//    console.log(data);

//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('gameScore',{data, sender: socket.id })
// });

// socket.on('Attack',  ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('Attack',{data, sender: socket.id })
// });

// socket.on('teamReady', ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('teamReady',{data, sender: socket.id })
// });

// socket.on('situation', ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('situation',{data, sender: socket.id })
// });

// socket.on('round',  ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('round',{data, sender: socket.id })
// });

// socket.on('teamReady', ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('teamReady',{data, sender: socket.id })
// });

// socket.on('gameScore',  ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('gameScore',{data, sender: socket.id })
// });

// socket.on('rivalOutNum',  ({room, data}) => {
//    console.log('rivalOutNum',data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('rivalOutNum',{data, sender: socket.id })
// });


});
    
server.listen(5000, () => {
   console.log(`Server On : http://localhost:5000/`);
})

