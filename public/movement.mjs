const movement = (player, socket) => {
  const getKey = e => {
    if (e.keyCode == 38 || e.keyCode == 87) {  return 'up'  }
    if (e.keyCode == 39 || e.keyCode == 68) {  return 'right'  }
    if (e.keyCode == 40 || e.keyCode == 83) {  return 'down'  }
    if (e.keyCode == 37 || e.keyCode == 65) {  return 'left'  }
  }

  document.onkeydown = e => {
    const dir = getKey(e)
    if(dir)
    {
      player.moveDir(dir)
      socket.emit('move-player', dir, { x: player.x, y: player.y });
    }
  }

  document.onkeyup = e => {
    const dir = getKey(e)
    if(dir)
    {
      player.stopDir(dir)
      socket.emit('stop-player', dir, { x: player.x, y: player.y });
    }
  }
}

export default movement