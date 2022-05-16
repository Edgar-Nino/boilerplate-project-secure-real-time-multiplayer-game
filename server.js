require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' }));

// Index page (static HTML)
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const generateStartEndPos = (min, max, multiple) => {
  return Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
}
const createCoin = () => {
  return {
    id: uuid(),
    x: generateStartEndPos(playFieldMinX, playFieldMaxX, 10),
    y: generateStartEndPos(playFieldMinY, playFieldMaxY, 10),
    value: Math.ceil(Math.random() * 3)
  }
}

const portNum = process.env.PORT || 3000;

let players = []
let playFieldMaxY = 460
let playFieldMaxX = 620
let playFieldMinY = 65
let playFieldMinX = 20
let coin = createCoin()
io.on('connection', socket => {
  console.log('Connection')
  const id = uuid()

  socket.emit('init', { id, players, coin })

  socket.on('new-player', (player) => {
    player.main = false
    players.push(player)
    socket.broadcast.emit('new-player', player)
  })

  socket.on('move-player', (dir, pos) => {
    player = players.find(v => v.id == id)
    if (player) {
      player.x = pos.x
      player.y = pos.y
      player.movementDirection[dir] = true
      socket.broadcast.emit('move-player', ({ id, dir, pos }))
    }
  })
  socket.on('stop-player', (dir, pos) => {
    player = players.find(v => v.id == id)
    if(player){
      player.x = pos.x
      player.y = pos.y
      player.movementDirection[dir] = false
      socket.broadcast.emit('stop-player', ({ id, dir, pos }))
    }
  })
  socket.on('coin-destroyed', (data) => {
    if (coin.id == data.coinID) {
      const res = players.find(v => v.id == data.playerID)
      if (res) {
        res.score += coin.value
        players = players.sort((a, b) => b.score-a.score)
    
        players.forEach((v,i)=>v.rank = i + 1)
        io.sockets.emit('update-player', { id: data.playerID, score: res.score })
        coin = createCoin()
        io.sockets.emit('new-coin', coin)
      }
    }
  })
  socket.on('disconnect', () => {
    players = players.filter(v => v.id !== id)
    socket.broadcast.emit('quit-player', id)
    console.log('Disconnect')
  })
})

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }

});

module.exports = app; // For testing
