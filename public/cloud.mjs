import { canvasCalcs } from './canvas-data.mjs';

class Cloud {
  constructor({x=-100, y=(Math.random()*canvasCalcs.playFieldHeight)+canvasCalcs.borderY, size = Math.random()*3+1,type=Math.floor(Math.random()*3)}) {
    this.x = x
    this.y = y
    this.type = type
    this.speed = 25 * size
    this.size = size
  }
  draw(ctx,img,ms){
    ctx.globalAlpha = this.size/4
    this.x += this.speed * ms
    const cloud = img[this.type]
    ctx.drawImage(cloud,this.x, this.y, cloud.width * this.size, cloud.height * this.size);
    ctx.globalAlpha = 1
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
export default Cloud;