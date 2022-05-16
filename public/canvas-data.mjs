let canvas = document.getElementById('game-window');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const playerSize = 15;
const border = 5; // Between edge of canvas and play field
const infoBar = 45; 


const canvasCalcs = {
  canvasWidth: canvasWidth,
  canvasHeight: canvasHeight,
  playerSize,
  borderX: border,
  borderY: border + infoBar,
  borderMaxX: canvasWidth-border,
  borderMaxY: canvasHeight-border,
  playFieldMinX: border + playerSize,
  playFieldMinY: border + playerSize + infoBar,
  playFieldWidth: canvasWidth - (border * 2),
  playFieldHeight: (canvasHeight - infoBar) - (border * 2),
  playFieldMaxX: (canvasWidth - playerSize) - border,
  playFieldMaxY: (canvasHeight - playerSize) - border,
}

const generateStartPos = (min, max, multiple) => {
  return Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
};

export {
  generateStartPos,
  canvasCalcs
}
