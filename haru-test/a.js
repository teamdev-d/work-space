const canvas = document.getElementById('next-block');
const ctx =canvas.getContext('2d');
const SCALE = 30;

function drawTetromino(tetromino, color, offsetX, offsetY){
  ctx.fillSrtyle = color;
  for (let y = 0; y < tetromino.length; y++){
    for (let x = 0; x < tetromino[y].length; x++){
      if (tetromino[y][x]){
        ctx.fillRect((x + offsetX) * SCALE, (y + offsetY) * SCALE, SCALE, SCALE);
      }
    }
  }
}

function disolayNextTetromino(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let color = tetColors[tetroTypesIndex];
  drawTetromino(tetroMino, color, 0, 0);
}

displayNextTetromino();//初回表示