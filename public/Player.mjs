import { canvasCalcs } from './canvas-data.mjs';

class Player {
  constructor({ x, y, score = 0, id, speed = 400, main, rank = 0, movementDirection = {} }) {
    this.x = x
    this.y = y
    this.id = id
    this.score = score
    this.speed = speed
    this.size = canvasCalcs.playerSize
    this.main = main
    this.movementDirection = movementDirection
    this.rank = rank
  }

  movePlayer(dir, time) {
    if (dir === 'up') this.y - this.speed * time >= canvasCalcs.playFieldMinY ? this.y -= this.speed * time : this.y -= 0;
    if (dir === 'down') this.y + this.speed * time <= canvasCalcs.playFieldMaxY ? this.y += this.speed * time : this.y += 0;
    if (dir === 'left') this.x - this.speed * time >= canvasCalcs.playFieldMinX ? this.x -= this.speed * time : this.x -= 0;
    if (dir === 'right') this.x + this.speed * time <= canvasCalcs.playFieldMaxX ? this.x += this.speed * time : this.x += 0;
  }

  draw(ctx, players, img, coin, ms) {
    const currDir = Object.keys(this.movementDirection).filter(dir => this.movementDirection[dir])
    currDir.forEach(dir => this.movePlayer(dir, ms))

    const imgPlayer = this.main ? img.green : img.red
    ctx.drawImage(imgPlayer, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    if (this.rank == 1) {
      const cSx = 17
      const cSy = 10
      const mul = 1.5
      ctx.drawImage(img.crown, this.x - (cSx/2) * mul, this.y - this.size - 7, cSx * mul, cSy * mul);
    }
    if (this.main) {
      const rank = (this.rank) ? this.rank : players.length
      ctx.font = "30px Arial";
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.strokeText(`SCORE:${this.score}`, 10, 27.5);

      ctx.font = "30px Arial";
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.strokeText(`RANK: ${rank}\\${players.length}`, canvasCalcs.borderMaxX, 27.5);
    }

    if (this.collision(coin)) {
      coin.destroyed = this.id
    }
  }

  moveDir(dir) {
    this.movementDirection[dir] = true
  }

  stopDir(dir) {
    this.movementDirection[dir] = false
  }

  collision(item) {
    const sumSquare = Math.pow(this.x - item.x, 2) + Math.pow(this.y - item.y, 2)
    const distance = Math.sqrt(sumSquare)
    return ((this.size + item.size) > distance)
  }

  calculateRank(arr) {

  }
}

export default Player;
