const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('API server is running');
});

io.on('connection', (socket) => {
   console.log('A user connected');

socket.on('teamName', (data) => {
   console.log(data);
   io.emit('teamName',data)
});

socket.on('responseTeamName', (data) => {
   console.log(data);
   io.emit('responseTeamName',data)
});

socket.on('gameScore', (data) => {
   console.log(data);
   io.emit('gameScore',data)
});

socket.on('Attack', (data) => {
   console.log(data);
   io.emit('Attack',data)
});

socket.on('teamReady', (data) => {
   console.log(data);
   io.emit('teamReady',data)
});

socket.on('situation', (data) => {
   console.log(data);
   io.emit('situation',data)
});

socket.on('round', (data) => {
   console.log(data);
   io.emit('round',data)
});

socket.on('teamReady', (data) => {
   console.log(data);
   socket.emit('teamReady',data)
});

socket.on('gameScore', (data) => {
   console.log(data);
   io.emit('gameScore',data)
});
})


server.listen(5000, () => {
   console.log(`Server On : http://localhost:5000/`);
})

