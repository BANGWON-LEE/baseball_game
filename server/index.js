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

const db = require('./config/db');
const cors = require('cors');
const e = require('express');

app.use(cors());

app.use(express.json());
let totalJoinCnt = {'1' : 0,'2' : 0, '3' : 0};
let roomStageStep = {'1' : 0,'2' : 0, '3' : 0};


app.put('/api/room/join', function(req, res) {
  disconnected = false;
  clearTimeout(timer);

    const params = req.body
    // let roomKey = params['room_no']
    console.log('방 인원 수정', totalJoinCnt)
    // console.log('방 인원 수정22', totalJoinCnt[roomKey])



  
    if(totalJoinCnt[`${params['room_no']}`]< 2 && params['user_cnt'] !== 0){
    console.log('방 체크 확인')
       totalJoinCnt[`${params['room_no']}`] += params['user_cnt'];
    } else if (totalJoinCnt[`${params['room_no']}`] >= 2 && params['user_cnt'] === 0){
       totalJoinCnt[`${params['room_no']}`] *= params['user_cnt']
    }
      //  totalJoinCnt[`${params['room_no']}`].toString();
       console.log('totalJoinCnt1 type', typeof(totalJoinCnt[`${params['room_no']}`]?.toString()))
       console.log('totalJoinCnt2 type', totalJoinCnt[`${params['room_no']}`]?.toString())

    if(totalJoinCnt[`${params['room_no']}`] < 0 ){
      totalJoinCnt[`${params['room_no']}`] *= 0
    }

    db.query(
      //  values("adminUser", "1234","관리자", 0.0, 0.0, 0.0);
      "UPDATE tb_room SET user_cnt = "+ totalJoinCnt[`${params['room_no']}`]?.toString() +" WHERE room_id = " + params['room_no'],(err,result) => {
      console.log('data', result);  
      if(err) {
        res.send(err); 
        
      }else if(!err){
        res.send(200)
        
      }
  });
    
}
);

app.get('/api/room/user', function(req, res) {
  disconnected = false;
  clearTimeout(timer);
  db.query(
    //  values("adminUser", "1234","관리자", 0.0, 0.0, 0.0);
    "SELECT room_no, user_cnt FROM tb_room",(err,result) => {
    console.log('겟데이터', result);  
    if(err) {
      res.send(err); 
      
    }else if(!err){
      res.send(result)
      
    }
});
  
}
);

app.put('/api/room/stage', function(req, res) {

  disconnected = false;
  clearTimeout(timer);
    const params = req.body


    db.query(
      //  values("adminUser", "1234","관리자", 0.0, 0.0, 0.0);
      "UPDATE tb_room SET user_cnt = "+ totalJoinCnt[`${params['room_no']}`]?.toString() +" WHERE room_id = " + params['room_no'],(err,result) => {
      console.log('data', result);  
      if(err) {
        res.send(err); 
        
      }else if(!err){
        res.send(200)
        
      }
  });
    
}
);


const rooms = {};



app.get('/', (req, res) => {
  res.send('API server is running');
});

let visitorCount = {
  '1' : 0,
  '2' : 0,
  '3' : 0 
}

let disconnected = false;

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

  disconnected = false;
  clearTimeout(timer);
      console.log('visi room',  visitorCount)
      console.log(`접속자 수 Message received from ${socket.id} in room ${room}: ${visitorCount}`);
    io.to(room).emit('visitorCount',{ visitorCount})
  });
    
  socket.on('teamName', ({room, teamName}) => {
    disconnected = false;
    clearTimeout(timer);
    console.log("teamName",teamName);
    console.log(`이름 Message received from ${socket.id} in room ${room}: ${teamName}`);
    io.to(room).emit('responseTeamName',{sender: socket.id , teamName})
  });

  socket.on('joinStep', ({room, joinStep}) => {
    disconnected = false;
    clearTimeout(timer);
    console.log("joinStep",joinStep);
        console.log(`스텝 Message received from ${socket.id} in room ${room}: ${joinStep}`);
    io.to(room).emit('joinStep',{sender: socket.id , joinStep})
  });

  socket.on('joinReady', ({room, joinReady}) => {
    disconnected = false;
    clearTimeout(timer);
    console.log("준비name",joinReady);
    console.log(`준비 Message received from ${socket.id} in room ${room}: ${joinReady}`);
    io.to(room).emit('joinReady',{sender: socket.id , joinReady})
  });

socket.on('gameScore',  ({room, homeTeamScore}) => {
  disconnected = false;
  clearTimeout(timer);
    console.log(homeTeamScore);
    console.log(`게임 스코어 Message received from ${socket.id} in room ${room}: ${homeTeamScore}`);
  io.to(room).emit('gameScore',{ sender: socket.id, homeTeamScore })
});

socket.on('Attack',  ({room, determineMyAttackNum}) => {
  console.log(determineMyAttackNum);
  disconnected = false;
  clearTimeout(timer);
  console.log(`Message received from ${socket.id} in room ${room}: ${determineMyAttackNum}`);
  io.to(room).emit('Attack',{sender: socket.id, determineMyAttackNum })
});

socket.on('teamReady', ({room, readySignal}) => {
  console.log(readySignal);
  disconnected = false;
  clearTimeout(timer);
    console.log(`readySignal Message received from ${socket.id} in room ${room}: ${readySignal}`);
  io.to(room).emit('teamReady',{ sender: socket.id, readySignal })
});

// socket.on('situation', ({room, data}) => {
//    console.log(data);
//       console.log(`Message received from ${socket.id} in room ${room}: ${data}`);
//    io.to(room).emit('situation',{data, sender: socket.id })
// });

socket.on('round',  ({room, gameRound}) => {
  console.log(gameRound);
  disconnected = false;
  clearTimeout(timer);
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
  disconnected = false;
  clearTimeout(timer);
    console.log(`Message received from ${socket.id} in room ${room}: ${myScore}`);
  io.to(room).emit('rivalOutNum',{sender: socket.id, myScore })
});

const timer = setTimeout(() => {
  if (disconnected) {
    console.log('end 됨')
    // const rooms = socket.rooms; // 클라이언트가 속한 방 목록
    console.log('rooooom dis', rooms)
    for (let room in rooms) {
      if (room !== socket.id) { // 클라이언트의 기본 room은 제외
        console.log(`Client left room ${room}`);
        if(totalJoinCnt[`${room}`] > 0){
          console.log('뭐야', totalJoinCnt[`${room}`])
            totalJoinCnt[`${room}`] -= 1
        }
        db.query(
          //  values("adminUser", "1234","관리자", 0.0, 0.0, 0.0);
          "UPDATE tb_room SET user_cnt = "+ totalJoinCnt[`${room}`]?.toString() +" WHERE room_id = " +room,(err,result) => {
          console.log('data', result);  
      });
      }
    }
    // socket.end();
  }
}, 120000);


socket.on('disconnect', () => {
  console.log('Client disconnected');
  disconnected = true;
  // const rooms = socket.rooms; // 클라이언트가 속한 방 목록
  // console.log('rooooom dis', rooms)
  // for (let room in rooms) {
  //   if (room !== socket.id) { // 클라이언트의 기본 room은 제외
  //     console.log(`Client left room ${room}`);
  //     if(totalJoinCnt[`${room}`] > 0){
  //       console.log('뭐야', totalJoinCnt[`${room}`])
  //         totalJoinCnt[`${room}`] -= 1
  //     }
  //     db.query(
  //       //  values("adminUser", "1234","관리자", 0.0, 0.0, 0.0);
  //       "UPDATE tb_room SET user_cnt = "+ totalJoinCnt[`${room}`]?.toString() +" WHERE room_id = " +room,(err,result) => {
  //       console.log('data', result);  
  //   });
  //   }
  // }
  timer.refresh();
});


});
    
server.listen(5000, () => {
  console.log(`Server On : http://localhost:5000/`);
})

