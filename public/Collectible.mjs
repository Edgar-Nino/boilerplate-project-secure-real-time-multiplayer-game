class Collectible {
  constructor({x, y, value, id,size=8}) {
    this.x = x
    this.y = y
    this.size = size
    this.value = value
    this.id = id
  }
  draw(ctx,img){
    ctx.drawImage(img[this.value-1],this.x-this.size, this.y-this.size, this.size*2, this.size*2);
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
