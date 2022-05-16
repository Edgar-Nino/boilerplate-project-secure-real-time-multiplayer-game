import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import Cloud from './cloud.mjs';
import movement from './movement.mjs'
import { canvasCalcs, generateStartPos } from './canvas-data.mjs';

function loadImage(src) {
  let img = new Image()
  img.src = src
  return img
}


let red = loadImage('/assets/RedR.png');
let green = loadImage('/assets/GreenR.png');
let goldCoin = loadImage('/assets/goldCoin.png');
let silverCoin = loadImage('/assets/silverCoin.png');
let bronzeCoin = loadImage('/assets/bronzeCoin.png');
let crown = loadImage('/assets/crownR.png');
const cloud1 = loadImage('/assets/cloud-1.png')
const cloud2 = loadImage('/assets/cloud-2.png')
const cloud3 = loadImage('/assets/cloud-3.png')
const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
let currPlayers = []
let clouds = []
let timeElapsed = Date.now()
let coingame = null
let gameSeconds = 0
let acc = 0
function draw() {
  const ms = (Date.now() - timeElapsed) / 1000
  acc += ms
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(0, 0, canvasCalcs.canvasWidth, canvasCalcs.canvasHeight);
  ctx.fillStyle = "#8a9877";
  ctx.fill();
  ctx.closePath();

  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText('KING COIN', canvasCalcs.canvasWidth / 2, 27.5);

  if (Math.floor(acc) % 2 && Math.floor(acc) != gameSeconds) {
    clouds.push(new Cloud({}))
  }
  clouds.slice(0).forEach((v,i) => {
    console.log(v.x)
    v.draw(ctx, [cloud1, cloud2, cloud3], ms)
    if(v.x > canvasCalcs.canvasWidth){
      clouds.splice(i,1)
    }
  })

  ctx.beginPath();
  ctx.rect(canvasCalcs.borderX, canvasCalcs.borderY, canvasCalcs.playFieldWidth, canvasCalcs.playFieldHeight);
  ctx.fillStyle = "#5b634d";
  ctx.stroke();
  
  if (coingame) {
    coingame.draw(ctx, [bronzeCoin, silverCoin, goldCoin])
  }

  currPlayers.forEach(player => {
    player.draw(ctx, currPlayers, { green, red, crown }, coingame, ms)
  })

  if (coingame.destroyed) {
    socket.emit('coin-destroyed', { playerID: coingame.destroyed, coinID: coingame.id })
  }
  gameSeconds = Math.floor(acc)
  timeElapsed = Date.now()
}

socket.on('init', ({ id, players, coin }) => {
  const mainPlayer = new Player({ x: generateStartPos(canvasCalcs.playFieldMinX, canvasCalcs.playFieldMaxX, 10), y: generateStartPos(canvasCalcs.playFieldMinY, canvasCalcs.playFieldMaxY, 10), id, main: true })
  socket.emit('new-player', mainPlayer)

  movement(mainPlayer, socket)

  socket.on('new-player', player => {
    const playersIDs = currPlayers.map(v => v.id)
    if (!playersIDs.includes(player.id)) {
      currPlayers.push(new Player(player))
    }
  })

  socket.on('move-player', ({ id, dir, pos }) => {
    const movingPlayer = currPlayers.find(v => v.id == id)
    movingPlayer.moveDir(dir)
    movingPlayer.x = pos.x
    movingPlayer.y = pos.y
  })

  socket.on('stop-player', ({ id, dir, pos }) => {
    const stoppingPlayer = currPlayers.find(v => v.id == id)

    stoppingPlayer.stopDir(dir)

    stoppingPlayer.x = pos.x
    stoppingPlayer.y = pos.y
  })

  socket.on('quit-player', (id) => {
    console.log(`Player ${id} disconnected`)
    currPlayers = currPlayers.filter(v => v.id !== id)
  })

  socket.on('update-player', ({ id, score }) => {
    const updatePlayer = currPlayers.find(v => v.id == id)

    updatePlayer.score = score

    currPlayers = currPlayers.sort((a, b) => b.score - a.score)

    currPlayers.forEach((v, i) => v.rank = i + 1)
  })

  socket.on('new-coin', (coin) => {
    coingame = new Collectible(coin)
  })


  currPlayers = players.map(v => new Player(v)).concat(mainPlayer)
  console.log(currPlayers)
  coingame = new Collectible(coin)
  setInterval(draw, 8)
})

// initResources()