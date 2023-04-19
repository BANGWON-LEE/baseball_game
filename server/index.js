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

let visitorCount = {
  '1' : 0,
  '2' : 0,
  '3' : 0 
}

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



  socket.on('1', (no) =>{
    console.log('no ref', no);
    io.emit('1', no );
  }) 

  socket.on('joinRoom', (room) => {
  if (!rooms[room]) {
    rooms[room] = [];
  }
  rooms[room].push(socket.id);
  socket.join(room); // room 변수를 전달하도록 수정
  console.log(`User ${socket.id} joined room ${room}`);
})


  socket.on('userCnt', ({room, userCnt}) => {

    
  visitorCount[`${room}`] += userCnt;

      console.log('visi room',  visitorCount)
      console.log(`접속자 수 Message received from ${socket.id} in room ${room}: ${visitorCount}`);
    io.to(room).emit('visitorCount',{ visitorCount})
  });
    
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

socket.on('gameScore',  ({room, homeTeamScore}) => {
    console.log(homeTeamScore);
    console.log(`게임 스코어 Message received from ${socket.id} in room ${room}: ${homeTeamScore}`);
   io.to(room).emit('gameScore',{ sender: socket.id, homeTeamScore })
});

socket.on('Attack',  ({room, determineMyAttackNum}) => {
  console.log(determineMyAttackNum);
  console.log(`Message received from ${socket.id} in room ${room}: ${determineMyAttackNum}`);
  io.to(room).emit('Attack',{sender: socket.id, determineMyAttackNum })
});

socket.on('teamReady', ({room, readySignal}) => {
   console.log(readySignal);
      console.log(`Message received from ${socket.id} in room ${room}: ${readySignal}`);
   io.to(room).emit('teamReady',{ sender: socket.id, readySignal })
});

// socket.on('situation', ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('situation',{data, sender: socket.id })
// });

socket.on('round',  ({room, gameRound}) => {
   console.log(gameRound);
      console.log(`Message received from ${socket.id} in room ${room}: ${gameRound}`);
   io.to(room).emit('round',{sender: socket.id, gameRound })
});

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

socket.on('rivalOutNum',  ({room, myScore}) => {
   console.log('rivalOutNum',myScore);
      console.log(`Message received from ${socket.id} in room ${room}: ${myScore}`);
   io.to(room).emit('rivalOutNum',{sender: socket.id, myScore })
});


});
    
server.listen(5000, () => {
   console.log(`Server On : http://localhost:5000/`);
})

