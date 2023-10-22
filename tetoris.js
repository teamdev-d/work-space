// 右回転
const createRightRotateTet = () => {
  //回転後の新しいテトリミノ用配列
  let newTet = [];
  for (let y = 0; y < TET_SIZE; y++) {
    newTet[y] = [];
    for (let x = 0; x < TET_SIZE; x++) {
      newTet[y][x] = tetroMino[TET_SIZE - 1 - x][y];
    }
  }
  return newTet;
};

// 左回転
const createLeftRotateTet = () => {
  //回転後の新しいテトリミノ用配列
  let newTet = [];
  for (let y = 0; y < TET_SIZE; y++) {
    newTet[y] = [];
    for (let x = 0; x < TET_SIZE; x++) {
      newTet[y][x] = tetroMino[x][TET_SIZE - 1 - y];
    }
  }
  return newTet;
};

//テトリミノの操作
document.onkeydown = (e) => {
  if (isGameOver) return;
  switch (e.code) {
    //左に移動
    case "ArrowLeft":
      if (canMove(-1, 0)) tetroMinoDistanceX--;
      break;

    //右に移動
    case "ArrowRight":
      if (canMove(1, 0)) tetroMinoDistanceX++;
      break;

    //下に移動
    case "ArrowDown":
      if (canMove(0, 1)) tetroMinoDistanceY++;
      break;

    //'R'キーを押すと右回転
    case "KeyR":
      let newRTet = createRightRotateTet();
      if (canMove(0, 0, newRTet)) {
        tetroMino = newRTet;
      }
      break;

    //'L'キーを押すと左回転
    case "KeyL":
      let newLTet = createLeftRotateTet();
      if (canMove(0, 0, newLTet)) {
        tetroMino = newLTet;
      }
      break;
  }
  drawPlayScreen();
};
